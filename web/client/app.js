// const $sendMessageBtn = document.querySelector("#send-message-button")
const toastr = require("toastr")
const {
  createMessage,
  deleteMessage,
  getMessages,
} = require("./services/messages")

const $messageForm = document.querySelector("#message-form")
const $inputMessage = document.querySelector("#input-message")
const $jobList = document.querySelector(".job-list")
const $jobTemplate = document.querySelector("#job-template")
const socket = new WebSocket("ws://localhost:3000")

// listen to incoming messages on websocket
socket.onmessage = (message) => {
  const data = JSON.parse(message.data)
  toastr.success(data.message)
  
  loadMessages()
}

// load all messages
loadMessages()

async function loadMessages() {
  const response = await getMessages()
  if (response.status == 200) {
    // remove all existing cards
    $jobList.innerHTML = ""

    const messages = await response.json()
    messages.forEach((message) =>
      renderJob({
        id: message._id,
        title: message.text,
        status: message.status,
        text: message.text,
        description: message.result,
      })
    )
  } else {
    toastr.error(`Could not fetch messages`)
  }
}

$messageForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  // post message
  const response = await createMessage({ text: $inputMessage.value })

  if (response.status == 201) {
    // notify user
    const data = await response.json()
    toastr.success(data.message)
    // load messages
    loadMessages()
  } else {
    toastr.error(`An error occured`)
  }

  // reset text input
  $inputMessage.value = ""
})

async function deleteCard(id) {
  await deleteMessage(id)
  loadMessages()
}

function renderJob({ id, title, status, text, description }) {
  const $jobClone = $jobTemplate.content.cloneNode(true)
  const $job = $jobClone.querySelector("[data-job]")
  const $jobTitle = $job.querySelector("[data-title]")
  const $jobStatus = $job.querySelector("[data-status]")
  const $jobDescription = $job.querySelector("[data-description]")
  $job.dataset.id = id
  $jobTitle.textContent = title
  $jobDescription.textContent = description
  $jobStatus.textContent = status

  // set badge class from status
  $jobStatus.classList.toggle("bg-info", status === "Pending")
  $jobStatus.classList.toggle("bg-warning", status === "Processing...")
  $jobStatus.classList.toggle("bg-success", status === "Completed")
  $jobStatus.classList.toggle("bg-error", status === "Error")

  // add 'remove card' event listener
  const deleteButton = $job.querySelector("[data-remove-card-button]")
  deleteButton.addEventListener("click", () => deleteCard(id))

  // append to DOM
  $jobList.append($job)
}

