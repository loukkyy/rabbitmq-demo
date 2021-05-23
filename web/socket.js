const WebSocketServer = require("websocket").server
const { consume } = require("../rabbitmq-service")

const configureWebSockets = (httpServer) => {
  const wsServer = new WebSocketServer({ httpServer })

  let connection

  wsServer.on("request", function (request) {
    connection = request.accept(null, request.origin)
    console.log("[WebSocket]: accepted connection")

    connection.on("close", function () {
      console.log("[WebSocket]: closing connection")
      connection = null
    })
  })

  // consume RabbitMQ messages from 'notification' queue
  consume("notification", (message) => {
    if (!connection) {
      console.log("[WebSocket]: no connection")
      return
    }
    // send message to client
    connection.sendUTF(JSON.stringify(message))
  }).catch(console.error)
}

module.exports = configureWebSockets
