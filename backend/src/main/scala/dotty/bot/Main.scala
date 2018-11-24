package dotty.bot

import dotty.bot.Decorators._
import dotty.bot.model.Github
import dotty.bot.model.Github.AccessToken
import dotty.bot.model.LauzHack.User
import requests.RequestAuth
import ujson.Js
import upickle.default.{read, write}

object Main extends cask.MainRoutes {

//  override def port: Int = 3338
  def GITHUB_USER = "allanrenucci"
  def GITHUB_TKN = "6c875951c64484cb9de5a2c0b994471deef54c3c"

  // LauzHack Github app
  def CLIENT_ID = "1eb8e00f3ac5bcfa3b42"
  def CLIENT_SECRET = "7243931f96aec1e7ba7c4638e65365bba78f3f44"

  override def debugMode: Boolean = true

  val ghSession = requests.Session(
    auth = new RequestAuth.Basic(GITHUB_USER, GITHUB_TKN)
  )

  class OAuth2(token: String) extends RequestAuth {
    def header = Some(s"token $token")
  }

  def ghUserSession(implicit user: User) = requests.Session(
    auth = new OAuth2(user.token)
  )

  /** Build the GitHub API url */
  private def ghAPI(path: String) = "https://api.github.com" + path

  @cask.get("/generateToken")
  def loggedIn(code: String) = {
    val response = requests.post(
      s"https://github.com/login/oauth/access_token?client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&code=$code",
      headers = Map("Accept" -> "application/json")
    )
    val signature = read[AccessToken](response.text)
    write[AccessToken](signature)
  }

  @cask.get("/")
  def root() = {
    implicit val user = User(token = "d8d87e3a68c43741fa2e5730534e952c8ae814f9")
    ghUserSession.get(ghAPI("/user")).text
  }

  @cask.get("/user")
  def user() = {
    ghSession.get(ghAPI("/user")).text
  }

  @cask.get("/rate")
  def rate() = {
    ghSession.get(ghAPI("/rate_limit")).text
  }

  @loggedIn()
  @cask.get("/test-logged-in")
  def loggedInTest()(user: User) = {
    Ok(s"Suce ${user.token}!")
  }

  @cask.get("/issues/:owner/:repo")
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
          "number"  -> Js.Num(i.number),
          "title"   -> Js.Str(i.title),
          "url"     -> Js.Str(i.html_url),
          "created" -> Js.Str(i.created_at),
          "user"    -> Js.Str(i.user.login)
        )
      }
      Ok(ujson.write(cleaned))
    }
    else
      BadRequest(response.statusMessage)
  }

  initialize()
}
