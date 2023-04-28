import React from 'react'

  const Person = ({name, number, id, deletePerson}) => {
    return(
    <li key={id}>{name} {number}  <button onClick={() => deletePerson(id)}>delete</button></li>
  )}
  export default Person