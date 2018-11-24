package dotty.bot

import collection.mutable

import dotty.bot.model.LauzHack.User

object DB {
  /** Token to User */
  val users: mutable.Map[String, User] = new mutable.HashMap()

  def addUser(token: String): Unit = {
    users += token -> User(token, new mutable.HashSet(), new mutable.HashSet())
  }

  def getUser(token: String): Option[User] = {
    users.get(token)
  }

  def addTopic(token: String, topic: String): Unit = users.get(token) match {
    case Some(user) => user.topics += topic
    case None =>
  }

  def addLanguage(token: String, language: String): Unit = users.get(token) match {
    case Some(user) => user.languages += language
    case None =>
  }
}
