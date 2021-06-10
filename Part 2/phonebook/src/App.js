import React, { useState, useEffect } from 'react'
import People from './components/People.js'
import Filter from './components/Filter.js'
import PersonForm from './components/PersonForm.js'
import axios from 'axios'
import numbersService from './services/backend'
import Notification from './components/Notification'
import './App.css'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newSearch, setNewSearch ] = useState('')
  const [ eventMessage, setEventMessage] = useState(null)
  const [ isError, setIsError ] = useState(false)

  useEffect(() => {
    numbersService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }

    const checkDuplicate = () => {
      if (persons.some(e => e.name === newName)) {
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
          const id = persons.find(element => element.name === newName ).id
          const person = persons.find(n => n.id === id)
          const changedPerson = {...person, number: newNumber}

          return numbersService
            .update(id, newPerson)
            .then(response => {
              setPersons(persons.map(person => person.id !== id ? person : response.data))
              setEventMessage(
                `Updated ${newPerson.name}'s number`
              )
              setTimeout(() => {
                setEventMessage(null)
              }, 5000)
            })

        }
        return (
          setEventMessage(
          `Nothing was changed`
        ),
        setTimeout(() => {
          setEventMessage(null)
        }, 5000))
          
      }

      numbersService
        .create(newPerson)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setEventMessage(
            `Added ${newPerson.name} with the number ${newPerson.number}`
          )
          setTimeout(() => {
            setEventMessage(null)
          }, 5000)
        })
    }

    checkDuplicate()
  }

  const handleNewName= (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setNewSearch(event.target.value)
  }

  const filtered = () => { 
    if (newSearch === '') return persons 
    else return persons.filter(person => person.name.toLowerCase().search(newSearch.toLowerCase()) > -1)
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification eventMessage={eventMessage} isError={isError}/>
      <Filter newSearch={newSearch} handleSearch={handleSearch} />
      <h3>Add a new </h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNewName={handleNewName} newNumber={newNumber} handleNewNumber={handleNewNumber}/>
      <h3>Numbers</h3>
      <People persons={filtered()} setPersons={setPersons} setIsError={setIsError} setEventMessage={setEventMessage} />
      <div>debug: {newName}</div>
    </div>
  )
}

export default App
