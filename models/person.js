require('dotenv').config()
const mongoose = require('mongoose')
const password = process.argv[2]
const url = process.env.MONGO_URI
mongoose.set('strictQuery',false)
console.log('connecting to url', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength:3,
    required:true
  },
  number: {
    type: String,
    minLength:8,
    validate:{
      validator:(v) => {
        return /^\d{2,3}-\d*$/.test(v)
      },
      message:'This format does not match a phone number. At least 8 digits started by dd-... or ddd-...'
    },
    required: [true, 'user phone is required']
  },
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Person', personSchema)