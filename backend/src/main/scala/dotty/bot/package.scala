package dotty

import java.net.HttpURLConnection.{HTTP_BAD_REQUEST, HTTP_OK}

package object bot {
  private val headers = List(
    "Access-Control-Allow-Origin" -> "*"
  )

  def BadRequest(msg: String) = cask.Response(msg, HTTP_BAD_REQUEST, headers)
  def Ok(msg: String) = cask.Response(msg, HTTP_OK, headers)
}
