import React from 'react'
import Person from './Person'

const Numbers =  ({persons, showAll, deletePerson}) =>{
    return (
<ul>
    {persons.filter(person => person.name.toLowerCase().includes(showAll))
    .map(person => <Person name = {person.name} id = {person.id} number= {person.number} deletePerson = {deletePerson} />)} 
    </ul>
    )
}
export default Numbers