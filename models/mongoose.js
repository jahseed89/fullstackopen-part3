const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.DATABASE_URI
console.log('Connect to ', url)

mongoose.connect(url).then(result => {
    console.log('Connect to DataBase')
}).catch((error) => {
    console.log('Error connecting to ', error.message)
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Person', personSchema)