require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
app.use(express.json())
app.use(cors())
morgan.token('person', (req, res) => {
            if (req.method !== 'POST') return ''
            return JSON.stringify({
                name: req.body.name,
                number: req.body.number
            })
        })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(express.static('dist'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<a href="/api/persons"> Phonebook </a> <br> <a href="/info"> Info </a>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.put('/api/persons/:id',(request,response) =>{
    const id = Number(request.params.id)
    const body = request.body
    const person = persons.find(person => person.id === id)

    if (!person) {
        return response.status(404).json({
            error: 'Person not found'
        })
    }

    const updatedPerson = {
        ...person,
        name: body.name,
        number: body.number
    }

    persons = persons.map(p => p.id !== id ? p : updatedPerson)
    response.json(updatedPerson)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id )
    if (person){
        response.json(person)
    } else {
        response.statusMessage = "This person does not exist in database";
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people
    <br/>
    ${new Date()} </p>
    `)
})
const getId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0
    return maxId + 1
}
app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number){
        response.status(400).json({
            ...body,
            error: "name or number missing"
        })
    } else if (persons.find(person => person.name === body.name)) {
        response.status(409).json({
            error: "This name is already set in the server"
        })
    } else {
        const newPerson = {
            id: getId(),
            name: body.name,
            number: body.number
            
        }

        persons.push(newPerson)
        response.json(newPerson)
    }
})

const PORT = process.env.PORT || 3001
console.log(`port ${process.env.PORT}`)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})