package dotty.bot

import collection.mutable

import dotty.bot.model.LauzHack.{User, Repository}

object DB {
  /** Token to User */
  private val users = new mutable.HashMap[String, User]()

  def addUser(token: String): Unit = {
    users += token -> User(token)
  }

  def getUser(token: String): User =
    users(token)

  def addTopic(token: String, topic: String): Unit =
    users(token).topics += topic

  def addLanguage(token: String, language: String): Unit =
    users(token).languages += language


  /** Full name to repository */
  val repositories = new mutable.HashMap[String, Repository]()

}
