import React, {useState} from 'react'
import numbersService from '../services/backend'

const People = ({persons, setPersons, setIsError, setEventMessage}) => {
   
  const removePerson = (event) => {
    if (window.confirm(`Delete ${event.target.name} ?`)) {
      numbersService
        .remove(event.target.id)
        .then(() => {
          setPersons(persons.filter(n => String(n.id) !== event.target.id))
        })
        .catch(error => {
          setIsError(true)
          setEventMessage(`Information of ${event.target.name} has already been removed from server`)
          setPersons(persons.filter(n => String(n.id) !== event.target.id))
          setTimeout(() => {
            setEventMessage(null)
            setIsError(false)
          }, 5000)
        })
    } 
  }

  return(
      <div>
      {persons.map(person => <Person key={person.id} name={person.name} number={person.number} id={person.id} removePerson={removePerson}/>)}
      </div>
    )  
}

const Person = ({name, number, id, removePerson}) => {   
    return (<p>
      {name} {number}
      <button name={name} id={id} onClick={removePerson}>delete</button>
    </p>)
}

  export default People