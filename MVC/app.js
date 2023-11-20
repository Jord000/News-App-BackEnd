const express = require('express')
const {healthCheck,getAllTopics} = require('./controllers')

const app = express()
app.use(express.json())

app.get('/api/healthcheck', healthCheck)
app.get('/api/topics',getAllTopics)

module.exports = app