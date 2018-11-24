package dotty.bot

import dotty.bot.model.CLASignature
import dotty.bot.model.Github.{IssueCommentEvent, PullRequestEvent}
import requests.RequestAuth
import upickle.default.read

object Main extends cask.MainRoutes with PullRequestService {


//  override def port: Int = 3338

  def GITHUB_USER = "dotty-bot"
  def GITHUB_PWD = "3fP17Nw3oBY2wyMsNT"
  def GITHUB_TKN = "ddc12156902e1f2fecfe0669a7e9da0db1a2619e"
  def GITHUB_CLIENT_ID = "7e5e441828bfe7ccc314"
  def GITHUB_CLIENT_SECRET = "10145f4ab03812a167fdb6f6877a7ac444d4f11"

  override def debugMode: Boolean = true

  val ghSession = requests.Session(
    auth = new RequestAuth.Basic(GITHUB_USER, GITHUB_TKN)
  )

  private def claUrl(userName: String) = s"https://www.lightbend.com/contribute/cla/scala/check/$userName"

  @cask.get("/")
  def root() = {
    "Hello Allan"
  }

  @cask.get("/user")
  def user() = {
    ghSession.get("https://api.github.com/user").text
  }

  @cask.get("/rate")
  def rate() = {
    ghSession.get("https://api.github.com/rate_limit").text
  }

  @cask.get("/cla/:userName")
  def checkCLA(userName: String) = {
    val response = requests.get(claUrl(userName))
    val signature = read[CLASignature](response.text)
    signature.toString + "\n" + response.text
  }

  @cask.post("/hook")
  def githubHook(request: cask.Request) = {
    val githubEvent =
      request.headers
        .getOrElse("x-github-event", Nil)
        .headOption

    githubEvent match {
      case Some("pull_request") =>
        checkPullRequest(read[PullRequestEvent](request.readAllBytes()))
      case Some("issue_comment") =>
        checkIssueComment(read[IssueCommentEvent](request.readAllBytes()))
      case Some(event) =>
        BadRequest(s"Unsupported event: $event")
      case _ =>
        BadRequest("Missing X-GitHub-Event Header")
    }
  }

  initialize()
}
