const mongoose = require("mongoose")

const USERNAME = process.env.DB_USER
const PASSWORD = process.env.DB_PASS
const DB_NAME = process.env.DB_NAME
const DB_HOST = process.env.DB_HOST
const dbURI = `mongodb://${DB_HOST}/${DB_NAME}`

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on("error", console.error)

const messageSchema = new mongoose.Schema({
  text: String,
  url: String,
  jobId: String,
  result: String,
  status: String,
})

const Message = mongoose.model("Message", messageSchema)

const createMessage = (attrs) => new Message(attrs).save()

const listMessages = () =>
  Message.find().then((messages) => messages.slice().reverse())

const deleteMessageById = (id) => {
  Message.findByIdAndRemove({ _id: id }, () =>
    console.log(`Message ${id} has been deleted`)
  )
}

const updateMessageById = (id, update) => {
  Message.findById(id, (err, message) => {
    if (err) {
      console.error(err)
    }
    message.result = update.result
    message.status = update.status
    message.save(() => console.log(`Message ${id} has been updated`))
  })
}

module.exports = {
  createMessage,
  listMessages,
  deleteMessageById,
  updateMessageById,
}
