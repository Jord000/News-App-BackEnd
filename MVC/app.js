const express = require('express')
const { healthCheck, incorrectPath, getEndPoints } = require('./controllers')
const { customError, internalError, sqlError } = require('./errors')
const apiRouter = require('../routes/api-router')

const app = express()
app.use(express.json())

app.use('/api', apiRouter)

app.get('/api/healthcheck', healthCheck)
app.get('/api', getEndPoints)

app.all('*', incorrectPath)

app.use(sqlError)
app.use(customError)
app.use(internalError)

module.exports = app
