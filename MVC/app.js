const express = require('express')
const {healthCheck} = require('./controllers')

const app = express()
app.use(express.json())

app.get('/api/healthcheck', healthCheck)

module.exports = app