const mongoose = require('mongoose')

if (process.argv.length<5) {
  console.log('give password, name and number as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://joanratesmas:${password}@cluster0.rr5b0xy.mongodb.net/personsApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const note = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

note.save().then(result => {
  console.log('added', result.name, 'number', result.number, 'to phonebook')
  mongoose.connection.close()
}) 


/* Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
}) */