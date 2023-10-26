const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Clothing = require('./models/clothing')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))

app.get('/api/clothes', (request, response) => {
  Clothing.find({}).then(clothes => {
    response.json(clothes)
})
})

app.post('/api/clothes', (request, response, next) => {
  const body = request.body

  const clothing = new Clothing({
    name: body.name,
  })

  clothing.save()
    .then(savedClothing => {
      response.json(savedClothing)
    })
    .catch(error => next(error))
})

app.get('/api/clothes/:id', (request, response, next) => {
  Clothing.findById(request.params.id)
    .then(clothing => {
      if (clothing) {
        response.json(clothing)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/clothes/:id', (request, response, next) => {
  Clothing.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})