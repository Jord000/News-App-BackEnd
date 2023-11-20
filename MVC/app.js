const express = require('express')
const { healthCheck, getAllTopics, incorrectPath } = require('./controllers')
const { customError, internalError } = require('./errors')

const app = express()

app.get('/api/healthcheck', healthCheck)
app.get('/api/topics', getAllTopics)

app.all('/*', incorrectPath)

app.use(customError)

module.exports = app
