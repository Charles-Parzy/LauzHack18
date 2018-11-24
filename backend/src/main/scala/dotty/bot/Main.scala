package dotty.bot


import dotty.bot.Decorators._
import dotty.bot.model.Github
import dotty.bot.model.Github.{AccessToken, PublicRepository}
import dotty.bot.model.LauzHack.User
import requests.RequestAuth
import ujson.Js
import upickle.default.{read, write}

object Main extends cask.MainRoutes {
  // LauzHack Github app
  def CLIENT_ID = "1eb8e00f3ac5bcfa3b42"
  def CLIENT_SECRET = "7243931f96aec1e7ba7c4638e65365bba78f3f44"

  override def debugMode: Boolean = true

  class OAuth2(token: String) extends RequestAuth {
    def header = Some(s"token $token")
  }

  def ghUserSession(implicit user: User) = requests.Session(
    auth = new OAuth2(user.token)
  )

  /** Build the GitHub API url */
  private def ghAPI(path: String) = "https://api.github.com" + path

  @cask.get("/generateToken")
  def generateToken(code: String) = {
    val response = requests.post(
      s"https://github.com/login/oauth/access_token?client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&code=$code",
      headers = Map("Accept" -> "application/json")
    )

    if (response.is2xx) {
      val signature = read[AccessToken](response.text)
      DB.addUser(signature.access_token)
      write[AccessToken](signature)
      Ok(write[AccessToken](signature))
    } else {
      BadRequest(response.statusMessage)
    }
  }

  @cask.get("/timeline")
  def timeline(languages: Seq[String], topics: Seq[String]) = {
    val top = topics.map(s => "topic:" + s).mkString("+")
    val l = languages.map(s => "language:" + s).mkString("+")
    val response = requests.get(
      ghAPI(s"/search/repositories?q=$l+$top&sort=stars&order=desc"),
      headers = Map ("Accept" -> "application/vnd.github.mercy-preview+json"))
    if (response.is2xx) {
      val repos = read[List[PublicRepository]](response.text)
      Ok(timelineToJson(repos))
    } else {
      BadRequest(response.statusMessage)
    }
  }

  @cask.get("/")
  def root() = {
    implicit val user = User(token = "d8d87e3a68c43741fa2e5730534e952c8ae814f9")
    ghUserSession.get(ghAPI("/user")).text
  }

  @loggedIn()
  @cask.get("/test-logged-in")
  def loggedInTest()(user: User) = {
    Ok(s"Suce ${user.token}!")
  }

  @cask.get("/issues")
  def issues(owner: String, repo: String) = {
    val response = requests.get(
      ghAPI(s"/repos/$owner/$repo/issues"),
      params = Map(
        "labels" -> "help wanted"
      )
    )

    if (response.is2xx) {
      val issues = read[List[Github.Issue]](response.text)
      val cleaned = issues.map { i =>
        Js.Obj(
          "number" -> Js.Num(i.number),
          "title" -> Js.Str(i.title),
          "url" -> Js.Str(i.html_url),
          "created" -> Js.Str(i.created_at),
          "user" -> Js.Str(i.user.login)
        )
      }
      Ok(ujson.write(cleaned))
    }
    else
      BadRequest(response.statusMessage)

  }

  private def timelineToJson(repos: List[PublicRepository]): String = {
    val recommendedRepo = repos.map(i => {
        Js.Obj(
          "id"  -> Js.Num(i.id),
          "name"   -> Js.Str(i.name),
          "description" -> Js.Str(i.description)
        )
    })
    val res = Js.Obj(
      "recommended_projects" -> recommendedRepo,
      "followed_projects" -> Js.Arr()
    )
    ujson.write(res)
  }

  initialize()
}
