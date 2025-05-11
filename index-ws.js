const express = require("express")
const app = express()
const server = require("http").createServer(app)

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname })
})

const { WebSocketServer } = require("ws") // 正确导入方式
const wss = new WebSocketServer({ server }) // 直接传入 server 对象

wss.on("connection", function connection(ws) {
  const numClients = wss.clients.size
  console.log("clients connected:", numClients)

  wss.broadcast(`Current visitors: ${numClients}`)

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server")
  }

  ws.on("close", function close() {
    const currentClients = wss.clients.size
    wss.broadcast(`Current visitors: ${currentClients}`)
    console.log("A client has disconnected")
  })
})

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === client.OPEN) {
      client.send(data)
    }
  })
}

server.listen(3000, function () {
  console.log("Server started on port 3000")
})
