require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
app.use(express.static('dist'))
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




app.get('/', (request, response) => {
  response.send('<a href="/api/persons"> Phonebook </a> <br> <a href="/info"> Info </a>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.put('/api/persons/:id',(request,response, next) =>{
    const id = request.params.id
    const {name,number} = request.body
   
    Person.findOneAndUpdate({name:name},{number:number, name:name},{new:true,runValidators: true, context: 'query'})
        .then(result => {
            if (result)
                response.json(result)
            else
                response.status(404).json({error: "this person does not exist in the phonebook"})
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
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
            next(error)
        })

})

app.delete('/api/persons/:id', (request, response, next) =>{
    const id = request.params.id;
    Person.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))

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

app.post('/api/persons', (request, response,next) => {
    const body = request.body;

    /* if (!body.name || !body.number){
        return response.status(400).json({
            ...body,
            error: "name or number missing"
        })
    }  */
    Person.exists({name:body.name})
        .then(person => {
            if(person){
                response.status(409).json({
                    error: "This name is already set in the server"
                })
            } else {
                const newPerson = new Person({
                    name: body.name,
                    number: body.number
                })

                newPerson.save()
                .then(savedPerson => {
                    response.json(savedPerson)
                })
                .catch(error => next(error))
                
            }
        })
        .catch(error => next(error))
     
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  
  switch (error.name) {
    case 'CastError':
        return response.status(400).send({ error: 'malformatted id', type: 'CastError' })
    case 'ValidationError':
        return response.status(400).json({ error: error.message , type: 'ValidationError'})
        break;
    default:
        console.error(error.message)
        next(error)
        break;
  }
  
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})