package dotty.bot

import collection.mutable

import dotty.bot.model.LauzHack.User

object DB {
  /** Token to User */
  val users: mutable.Map[String, User] = new mutable.HashMap()

  def addUser(token: String): Unit = {
    users += token -> User(token)
  }
}
