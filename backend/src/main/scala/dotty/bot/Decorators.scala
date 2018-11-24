package dotty.bot

import cask.internal.Router.Result
import dotty.bot.model.LauzHack.User

object Decorators {
  class loggedIn extends cask.Decorator {
    private final val LH_TOKEN = "lauz-hack-token"

    def wrapFunction(request: cask.Request, delegate: Delegate): Returned = {
      val tokenOpt =
        request.headers
          .getOrElse(LH_TOKEN, Nil)
          .headOption

      tokenOpt match {
        case Some(token) =>
          delegate(Map("user" -> User(token)))
        case _ =>
          Result.Success(BadRequest("Missing user token"))
      }
    }
  }
}
