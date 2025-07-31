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



app.get('/', (request, response) => {
  response.send('<a href="/api/persons"> Phonebook </a> <br> <a href="/info"> Info </a>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.put('/api/persons/:id',(request,response) =>{
    const id = (request.params.id)
    const body = request.body
    /* Person.findById(id)
        .then(person => {
            if (!person) {
                return response.status(404).json({
                    error: 'Person not found'
                })
            }

            const updatedPerson = Person({
                ...person,
                name: body.name,
                number: body.number
            })
            
            persons = persons.map(p => p.id !== id ? p : updatedPerson)
            response.json(updatedPerson)
        }) */
    Person.findByIdAndUpdate(id,{number:body.number, name:body.name})
        .then(result => {
            console.log("updated", result.toJSON())
            response.json(result)
        })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = Person.find({_id: id})
        .then(result=>{
            if(result[0]){
                response.json(result[0])
            }   
            else{
                response.statusMessage="Person not found"
                response.status(404).end()
            }
        })
        .catch(error => {
            response.statusMessage=error.message
            response.status(500).end()
        })

})

app.delete('/api/persons/:id', (request, response) =>{
    const id = request.params.id;
    Person.deleteOne({_id: id})
        .then(result => {
            response.status(204).end()
        })

})

app.get('/info', (request, response) => {
    Person.find({}).then(result => {
        response.send(`
    <p>Phonebook has info for ${result.length} people
    <br/>
    ${new Date()} </p>
    `)
    })
  
})

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
        const person = new Person({
            name: body.name,
            number: body.number
        })

        person.save().then(savedPerson => {
            response.json(savedPerson)
        })
        
    }
})

const PORT = process.env.PORT || 3001
console.log(`port ${process.env.PORT}`)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})