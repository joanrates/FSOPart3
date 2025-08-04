const mongoose = require('mongoose')
console.log(process.env.PROVA)
if (process.argv.length < 3){
  console.log('give password, name and number as argument')
  process.exit(1)
}
const password = process.argv[2]

const url =   `mongodb+srv://joanratesmas:${password}@cluster0.rr5b0xy.mongodb.net/personsApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length<5) {
  Person.find({}).then(result => {
    console.log('Phonebook')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })


}else{
  const note = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  note.save().then(result => {
    console.log('added', result.name, 'number', result.number, 'to phonebook')
    mongoose.connection.close()
  })
}