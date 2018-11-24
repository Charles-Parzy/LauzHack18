package dotty.bot.model

import scala.collection.mutable

object LauzHack {
  case class User(token: String, topics: mutable.HashSet[String], languages: mutable.HashSet[String])
}
