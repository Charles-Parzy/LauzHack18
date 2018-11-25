package dotty.bot.model

import upickle.default.{ReadWriter, Reader, Writer, macroR, macroRW, macroW}

/** Models JSON objects from the GitHub v3 REST API.
 *
 *  GitHub documentation at: https://developer.github.com/v3/
 *
 *  This object includes JSON serializer using the µPickle library.
 *
 *  Notes:
 *    - A model fields name must match its JSON object.
 *    - These models are incomplete. New fields should be added as needed.
 */
object Github {

  // https://developer.github.com/v3/users/
  case class User(
    login: String,
    avatar_url: String,
  )
  object User {
    implicit def rw: ReadWriter[User] = macroRW
  }

  case class Repositories(items: Seq[Repository] = Nil)
  object Repositories {
    implicit def reader: Reader[Repositories] = macroR
  }

  // https://developer.github.com/v3/repos/
  case class Repository(
    name: String,
    full_name: String,
    description: String,
    html_url: String,
    topics: Seq[String] = Nil,
    owner: User
  )
  object Repository {
    implicit def reader: Reader[Repository] = macroR
  }

  case class PullRequests(items: List[PullRequest])
  object PullRequests {
    implicit def reader: Reader[PullRequests] = macroR
  }

  // https://developer.github.com/v3/pulls/
  case class PullRequest(
    number: Int,
    repository_url: String,
    user: User
  )
  object PullRequest {
    implicit def reader: Reader[PullRequest] = macroR
  }

  // https://developer.github.com/v3/activity/events/types/#pullrequestevent
  case class PullRequestEvent(
    action: String,
    pull_request: PullRequest,
    repository: Repository
  )
  object PullRequestEvent {
    implicit def reader: Reader[PullRequestEvent] = macroR
  }

  case class Issue(
    number: Int,
    title: String,
    html_url: String,
    created_at: String,
    user: User
  )
  object Issue {
    implicit def rw: ReadWriter[Issue] = macroRW
  }

  // https://developer.github.com/v3/issues/comments/
  case class Comment(
    user: User,
    body: String
  )
  object Comment {
    implicit def reader: Reader[Comment] = macroR
  }

  // https://developer.github.com/v3/activity/events/types/#issuecommentevent
  case class IssueCommentEvent(
    action: String,
    issue: Issue,
    comment: Comment,
    repository: Repository
  )
  object IssueCommentEvent {
    implicit def reader: Reader[IssueCommentEvent] = macroR
  }

  // https://developer.github.com/v3/pulls/#list-commits-on-a-pull-request
  case class Commit(
    sha: String,
    author: User,
    committer: User,
    commit: CommitInfo
  )
  object Commit {
    implicit def reader: Reader[Commit] = macroR
  }

  case class CommitInfo(message: String)
  object CommitInfo {
    implicit def reader: Reader[CommitInfo] = macroR
  }

  case class AccessToken(access_token: String)
  object AccessToken {
    implicit def rw: ReadWriter[AccessToken] = macroRW
  }

  case class UserUpdate(
    token: String,
    topics: Seq[String] = Seq.empty,
    languages: Seq[String] = Seq.empty
  )
  object UserUpdate {
    implicit def reader: Reader[UserUpdate] = macroR
  }
}
