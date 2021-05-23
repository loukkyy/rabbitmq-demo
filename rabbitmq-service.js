const amqp = require("amqplib")
let connection = null

async function connect() {
  try {
    const HOST = process.env.RABBITMQ_HOST
    connection = await amqp.connect(HOST)
    console.log("[RabbitMQ]: Connection created")

connection.on('error', (err) => {
  console.log(err)
})
    return connection
  } catch (error) {
    console.log(error)
  }
}

async function sendMessage(message, queueName) {
  try {
    if (!connection) {
      connection = await connect()
    }
    const channel = await connection.createChannel()
    console.log("[RabbitMQ]: Channel opened")
    const result = await channel.assertQueue(queueName)
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
    console.log("[RabbitMQ]: Message sent successfully")
    await channel.close()
    console.log("[RabbitMQ]: Channel closed")
  } catch (error) {
    console.error(error)
  }
}

async function consume(queueName, callback) {
  try {
    if (!connection) {
      connection = await connect()
    }
    const channel = await connection.createChannel()
    console.log("[RabbitMQ]: Channel opened")
    const result = await channel.assertQueue(queueName)
    channel.consume(queueName, (message) => {
      // acknowledge message
      channel.ack(message)
      callback(JSON.parse(message.content.toString()))
    })
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  sendMessage,
  consume,
}
