const mongoose = require('mongoose')

if (process.argv.length < 3){
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =`mongodb+srv://asuv90:${password}@cluster0.anscmb4.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Phonebook = mongoose.model('Phone', phoneSchema)

const number = new Phonebook({
  name: process.argv[3],
  number: process.argv[4]
})

if (process.argv.length ===3){

  Phonebook.find({}).then(result => {
    console.log('Phonebook')
    result.forEach(note => {
      console.log(note.name, note.number)
    })
    mongoose.connection.close()
  })
} else {

  number.save().then(() => {
    console.log('added', number.name, 'number', number.number, 'to phonebook')
    mongoose.connection.close()
  })}

