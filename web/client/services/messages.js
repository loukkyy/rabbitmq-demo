const HOST = "http://localhost:3001"

async function createMessage(data) {
  const response = await fetch(`${HOST}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return response
}

async function deleteMessage(id) {
  const response = await fetch(`${HOST}/messages/${id}`, {
    method: "DELETE",

  })
  return response
}

async function getMessages(id) {
  const response = await fetch(`${HOST}/messages`, {
    method: "GET",
  })
  return response
}

async function updateMessage(id, data) {
    const response = await fetch(`${HOST}/messages/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
    return response
}

module.exports = {
  createMessage,
  deleteMessage,
  getMessages,
  updateMessage
}
