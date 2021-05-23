const express = require("express")
require("dotenv").config()
const http = require("http")
const cors = require("cors")
const path = require("path")
const configureWebSockets = require("./socket")

const app = express()

app.use(cors())
app.use(express.json())

// api routes
app.use("/messages", require("./routes/messages"))
app.use(express.static(path.join(__dirname, "public")))

const server = http.createServer(app)
configureWebSockets(server)
const PORT = 3000 || process.env.PORT
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
