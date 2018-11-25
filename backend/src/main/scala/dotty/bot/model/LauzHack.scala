package dotty.bot.model

import collection.mutable

import upickle.default.{Writer, macroW}

object LauzHack {

  case class User(
    token: String,
    followedRepos: mutable.Set[String],
    topics: mutable.Set[String],
    languages: mutable.Set[String],
    trophies: Trophies
  )
  object User {
    def apply(token: String): User = new User(token, new mutable.HashSet, new mutable.HashSet, new mutable.HashSet, Trophies())
  }

  case class Trophies(
    gold: Int,
    silver: Int,
    bronze: Int
  )
  object Trophies {
    def GOLD_TROPHY = "https://hrcdn.net/hackerrank/assets/badges/gold_small-90e95e4632dabf13609debebc49d8635.svg"
    def SILVER_TROPHY = "https://hrcdn.net/hackerrank/assets/badges/silver_small-a1d0ba9d3781e58d48c1e89285557401.svg"
    def BRONZE_TROPHY = "https://hrcdn.net/hackerrank/assets/badges/bronze_small-ccb05462f608043be528d2fdaeedb62c.svg"
    def apply(): Trophies = new Trophies(0,0,0)
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
