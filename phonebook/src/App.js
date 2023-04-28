import { useState, useEffect } from 'react'
import PersonForm from './components/AddPerson'
import Numbers from './components/Number'
import numberMethods from './services/numbers'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas',
      number: '02852399'}
  ]) 

  const[errorMessage, setErrorMessage] = useState(null)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState('')

  useEffect(() => {
    console.log('effect')
    numberMethods
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])

  const handleFilter = (event) => {
    setShowAll(event.target.value)      
  }

  const addName = (event) => {
    event.preventDefault()
    const per =  {
        name: newName,
        number: newNumber
    }

    if (persons.some(e => e.name === per.name &&  per.number !== "")){
      const filteredPerson = persons.filter(person => person.name === per.name)
      const personId = filteredPerson[0].id

    if (window.confirm(`Do you want to update ${per.name} ?`)) {
      numberMethods
        .repla(personId, per).then(error => {
          setErrorMessage('Updated ' + per.name)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }).catch(error => {
      alert(
        `Person '${per.name}' was already deleted from server`
      )
    })
      console.log(`${per.name} successfully updated`)
      const updatedPersons = persons.map(person =>
        person.id === personId ? { ...person, number: per.number } : person
      )
      setPersons(updatedPersons)
    }
  } else {

    if (persons.some(e => e.name === per.name &&  per.number === "")){
      alert(per.name + " is already in the phonebook.")
     }else{
      numberMethods.create(per).then(error => {
        setErrorMessage('Added ' + per.name)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    setPersons(persons.concat(per))}
   setNewName("")
   setNewNumber("")
    }
  }

  const deletePerson = (name) => {
    const filteredPerson = persons.filter(person => person.id === name)
    const personId = filteredPerson[0].id
    const personName = filteredPerson[0].name
    if (window.confirm(`Delete ${personName} ?`)) {
      numberMethods
        .update(personId).then(error => {
          setErrorMessage('Removed ' + personName)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
      console.log(`${personName} successfully deleted`)
      setPersons(persons.filter(person => person.id !== personId))
    }
  }

  const handleNameChange = (event) => {
      console.log(event.target.value)
      setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message = {errorMessage}/>
        <div>
     filter: <input value= {showAll} onChange={handleFilter} />
</div>
      <h2>Add a new</h2>
      <PersonForm onSubmit={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Numbers persons= {persons} showAll= {showAll} deletePerson={deletePerson} />
    </div>
  )

}

export default App

