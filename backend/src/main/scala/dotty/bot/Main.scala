package dotty.bot

import dotty.bot.model.{Github, LauzHack}
import dotty.bot.model.Github.{AccessToken, Repository}
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

  def ghUserSession(implicit token: String) = requests.Session(
    auth = new OAuth2(token)
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
  def timeline(token: String): cask.Response = {
    val user = DB.getUser(token)
    val topics = user.topics.map(s => "topic:" + s).mkString("+")
    val languages = user.languages.map(s => "language:" + s).mkString("+")
    var repos: List[Github.Repository] = List.empty
    if (!topics.isEmpty && !languages.isEmpty) {
      var query = topics
      if (!query.isEmpty) {
        query += "+" + languages
      } else {
        query = languages
      }
      val response = requests.get(
        ghAPI(s"/search/repositories?q=$query&sort=stars&order=desc"),
        headers = Map ("Accept" -> "application/vnd.github.mercy-preview+json"))
      if (!response.is2xx) {
        BadRequest(response.statusMessage)
      }
      repos = read[List[Repository]](response.text)
    }
    Ok(timelineToJson(repos))
  }

  @cask.get("/project")
  def project(token: String, owner: String, repo: String) = {
    val response = requests.get(ghAPI(s"/repos/$owner/$repo"))
    val issues = getIssues(owner, repo)
    val user = DB.getUser(token)
    if (response.is2xx) {
      val repo = read[Github.Repository](response.text)
      val cleaned = Js.Obj(
        "full_name" -> Js.Str(repo.full_name),
        "name" -> Js.Str(repo.name),
        "url" -> Js.Str(repo.html_url),
        "description" -> Js.Str(repo.description),
        "followed" ->  Js.Bool(user.followedRepos.contains(repo.full_name)),
        "owner" -> Js.Str(repo.owner.login),
        "topics" -> repo.topics,
        "issues" -> issues
      )
      Ok(ujson.write(cleaned))
    } else {
      BadRequest(response.statusMessage)
    }
  }

  @cask.get("/")
  def root() = {
    implicit val token = "d8d87e3a68c43741fa2e5730534e952c8ae814f9"
    ghUserSession.get(ghAPI("/user")).text
  }

  @cask.get("/test-logged-in")
  def loggedInTest(param: String)(user: User) = {
    Ok(s"Suce ${user.token} $param!")
  }

  @cask.get("/profile")
  def profile(token: String): cask.Response = {
    val user = DB.getUser(token)
    val response = ghUserSession(token).get(ghAPI("/user"))
    val json = read[Github.User](response.text)
    val profile = Js.Obj(
      "name" -> Js.Str(json.login),
      "picture" -> Js.Str(json.avatar_url),
      "topics" -> user.topics,
      "languages" -> user.languages
    )
    Ok(ujson.write(profile))
  }

  private def getIssues(owner: String, repo: String) = {
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
      cleaned
    }
    else
      List.empty
  }

  @cask.get("/follow")
  def follow(token: String, owner: String, repo: String) = {
    val user = DB.getUser(token)
    val fullName = owner + repo

    // Adding repo to cache
    val ghRepo = read[Repository](requests.get(ghAPI(s"/repos/$owner/$repo")).text)
    val lhRepo = LauzHack.Repository(
      name = repo,
      owner = owner,
      full_name = fullName,
      description = ghRepo.description,
      html_url = ghRepo.html_url,
      topics = ghRepo.topics
    )
    val repos = DB.repositories
    repos += (fullName -> lhRepo)

    // Adding repo to followed repo
    user.followedRepos += fullName

    val toSend = user.followedRepos.toList.map(repos(_))
    Ok(write[List[LauzHack.Repository]](toSend))
  }

  @cask.get("/unfollow")
  def unfollow(token: String, owner: String, repo: String) = {
    val user = DB.getUser(token)
    val fullName = owner + repo
    user.followedRepos -= fullName
    val toSend = user.followedRepos.toList.map(DB.repositories(_))
    Ok(write[List[LauzHack.Repository]](toSend))
  }

  private def timelineToJson(repos: List[Repository]): String = {
    val recommendedRepo = repos.map(i => {
        Js.Obj(
          "full_name"  -> Js.Str(i.full_name),
          "name"   -> Js.Str(i.name),
          "description" -> Js.Str(i.description),
          "owner" -> Js.Str(i.owner.login)
        )
    })
    val res = Js.Obj(
      "recommended_projects" -> recommendedRepo,
      "followed_projects" -> Js.Arr()
    )
    ujson.write(res)
  }

  initialize()

  DB.addUser("d8d87e3a68c43741fa2e5730534e952c8ae814f9") // adding Mickael
}
