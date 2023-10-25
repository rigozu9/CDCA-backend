const express = require('express')
const app = express()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)

let clothes = [
      {
        "id": 1,
        "name": "CDG junya jeans"
      },
      {
        "id": 2,
        "name": "CDG HOMME longsleeve"
      },
      {
        "id": 3,
        "name": "DOUBLET hoodie"
      },
      {
        "name": "Chlesa shirt",
        "id": 4
      },
      {
        "name": "Number Nine tshirt",
        "id": 5
      }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
  
app.get('/api/clothes', (req, res) => {
    res.json(clothes)
})

app.get('/api/clothes/:id', (request, response) => {
    const id = Number(request.params.id)
    const clothing = clothes.find(clothing => clothing.id === id)
    if (clothing) {
        response.json(clothing)
      } else {
        response.status(404).end()
      }
})

app.delete('/api/clothes/:id', (request, response) => {
  const id = Number(request.params.id)
  clothes = clothes.filter(clothing => clothing.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = clothes.length > 0
    ? Math.max(...clothes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/clothes', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  const clothing = {
    name: body.name,
    id: generateId(),
  }

  clothes = clothes.concat(clothing)

  response.json(clothing)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})