require("dotenv").config()
const { sendMessage, consume } = require("../rabbitmq-service")
const { updateMessageById } = require("../web/repo")

// start consuming 'jobs' queue
console.log("[Worker]: Waiting for messages...")
consume("jobs", runTask)

/**
 * 
 * @param {jobId, text, status} data 
 */
function runTask(data) {
  console.log(data)
  // add 1s delay before processing
  setTimeout(() => {
    console.log(`[Worker]: Processing message ${data.jobId}`)

    // update status in db
    updateMessageById(data._id, { status: "Processing..." })

    // send 'notification' message to queue
    sendMessage({ message: `Job ID ${data.jobId} is processing` }, "notification")
  }, 1000)

  // add 5s delay before doing stuff
  setTimeout(() => {
    // do stuff
    const textLength = data.text.length
    const result = `Text '${data.text}' is ${textLength} characters long`

    // save results
    updateMessageById(data._id, { result, status: "Completed" })

    // send 'notification' message to queue
    sendMessage({ message: `Job ID ${data.jobId} is completed` }, "notification")
  }, 5000)
}
