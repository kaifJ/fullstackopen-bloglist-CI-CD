import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import phonebookServices from './services/phonebook'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [filteredValues, setFilteredValues] = useState([])

  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    phonebookServices.getAll()
      .then(response => {
        setPersons(response)
      })
      .catch(err => {
        console.log(`Some Error occured : ${err}`)
      })
  }, [errorMessage])

  const handleSubmit = (e) => {
    e.preventDefault()

    let newEntry = {
      name: newName,
      number: newNumber,
    }

    let found = persons.find(person => person.name === newName)
    if (found) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with new number ?`)) {
        phonebookServices.updatePhonebook(found.id, newEntry)
          .then(response => {
            let updatedPhonebook = persons.map(person => person.id !== response.id ? person : response)
            setPersons(updatedPhonebook)
          })
          .catch(err => {
            console.log(`Something went wrong: ${err}`)
            setErrorMessage(`Information of ${newName} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      } else return
    }
    else {
      phonebookServices.create(newEntry).then(response => {
        console.log(response)
        setPersons(persons.concat(response))
        setSuccessMessage(`Added ${newName}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      }).catch(err => {
        let message = err.response.data.error
        setErrorMessage(message)
        setTimeout(() => setErrorMessage(null), 5000)
        console.log(`Some error occured : ${err}`)
      })
    }

    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
    let filteredValues = persons.filter(person => person.name.toLowerCase().includes(e.target.value))
    setFilteredValues(filteredValues)
  }

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete`)) {
      phonebookServices.deletePerson(id)
        .then(response => {
          let updatedPhonebook = [...persons]
          updatedPhonebook.pop()
          setPersons(updatedPhonebook)
        })
        .catch(err => {
          console.log(`Some Error occured: ${err}`)
          setErrorMessage(`Information of ${newName} has already been removed from server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    } else return
  }

  return (
    <div>
      <h2>Phonebook: Customised for your comfort!</h2>
      <Notification message={errorMessage || successMessage} type={errorMessage ? 'error' : 'success'} />
      <Filter
        filterValue={filter}
        handleFilterChange={handleFilterChange}
      />
      <h2>add a new</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        handleNumberChange={handleNumberChange}
        handleNameChange={handleNameChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons
        filter={filter}
        persons={persons}
        handleDelete={handleDelete}
        filteredValues={filteredValues}
      />
    </div>
  )
}

export default App