const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const { sendMessage } = require("../../rabbitmq-service")
const repo = require('../repo')

/**
 * Get all messages
 */
router.get("/", (req, res) => {
  repo
    .listMessages()
    .then((messages) => {
      res.setHeader("content-type", "application/json")
      res.end(JSON.stringify(messages))
    })
    .catch((e) => {
      console.error(e)
      res.status(500)
      res.setHeader("content-type", "application/json")
      res.end(JSON.stringify({ error: e.message }))
    })
})

/**
 * Post new message
 */
router.post("/", (req, res) => {

  // create unique job ID
  const jobId = uuidv4()
  
  // send message to queue
  const message = { jobId , text: req.body.text, status: "Pending" }

  // save message to database
  repo
  .createMessage(message)
  .then((record) => {
    console.log("Saved " + JSON.stringify(record))

    // send message to queue for processing
    sendMessage(record, "jobs")
  })
  .catch((e) => {
    console.error(e)
  })

  // respond to client
  return res.status(201).json({ jobId , message: `Message has been submitted with job id ${jobId}` })
})

/**
 * Update message by id
 */
 router.patch("/:id", (req, res) => {
  repo.updateMessageById(req.params.id, req.body.result)
  .then(record => console.log("Updated " + JSON.stringify(record)))

  // respond to client
  return res.sendStatus(200)
})

/**
 * Delete message by id
 */
 router.delete("/:id", (req, res) => {
  repo.deleteMessageById(req.params.id)

  // respond to client
  return res.sendStatus(204)
})

module.exports = router
