const express = require('express')
const {healthCheck,getAllTopics} = require('./controllers')
const {customError} = require('./errors')

const app = express()
app.use(express.json())

app.get('/api/healthcheck', healthCheck)
app.get('/api/topics',getAllTopics)

app.use(customError)

module.exports = app