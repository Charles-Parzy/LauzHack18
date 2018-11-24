package dotty.bot.model

import collection.mutable

import upickle.default.{Writer, macroW}

object LauzHack {

  case class User(
    token: String,
    followedRepos: mutable.Set[String],
    topics: mutable.Set[String],
    languages: mutable.Set[String]
  )
  object User {
    def apply(token: String): User = new User(token, new mutable.HashSet, new mutable.HashSet, new mutable.HashSet)
  }

  case class Repository(
    name: String,
    owner: String,
    full_name: String,
    description: String,
    html_url: String,
    topics: Seq[String] = Nil,
  )
  object Repository {
    implicit def writter: Writer[Repository] = macroW
  }
}
