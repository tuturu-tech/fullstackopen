import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({newSearch, handleSearch}) => {
  return (
    <p>find countries
    <input value={newSearch} onChange={handleSearch}/>
    </p>
  )
}

const Country = ({country}) => {
  const [showData, setShowData] = useState(false)
  
  const countryData = () => {
    const countries = [country]

    if (showData === true) {
      return <CountryData countries={countries} />
    }
  }

  return (
    <div>
      <p>
        <strong>{country.name}</strong>
        <button onClick={ () => setShowData(!showData)}>{showData ? 'Hide' : 'Show'}</button>
      </p>
      {countryData()}
    </div> 
  )
}

const Countries = ({countries}) => {
  return(
    <div>
    {
      countries.map(country => <Country key={country.numericCode} country={country} />)
    }
    </div>
  )
}

const CountryData = ({countries}) => {
  const params = {
    access_key: '4df43072afc140a8cb1ffee4791430ac',
    query: countries[0].capital
  }

  const weatherLoaded = () => {
    if (weather.length !== 0) { 
      return(<div>
        <h3>Weather in {countries[0].capital}</h3>
        <p><strong>temperature: </strong>{weather.current.temperature} Celsius</p>
        <img src={weather.current.weather_icons[0]} width="100" alt="Weather icon"/>
        <p><strong>wind:</strong> {weather.current.wind_speed} mph direction {weather.current.wind_dir}</p>
      </div>)
    } 
  }
  
  const [ weather, setWeather ] = useState([])
  
  useEffect(() => {
    axios
      .get('http://api.weatherstack.com/current', {params})
      .then(response => {
        setWeather(response.data)
        console.log(response.data)
      })
  }, [])
  
  return(
    <div>
      <h1>{countries[0].name}</h1>
      <p>capital {countries[0].capital}</p>
      <p>population {countries[0].population}</p>
      <h3>languages</h3>
      <Languages countries={countries}/>
      <img src={countries[0].flag} width="200" />
      {weatherLoaded()}
    </div>
  )
}

const Languages = ({countries}) => {
  return(
    <ul>
    {countries[0].languages.map(language => <li key={language.iso639_1}>{language.name}</li>)}
    </ul>
  )
  
}

const App = () => {
  const [ countries, setCountries] = useState([])
  const [ newSearch, setNewSearch] = useState('')
  
  const handleSearch = (event) => {
    setNewSearch(event.target.value)
  }

  useEffect(() => {
    axios
      .get(`https://restcountries.eu/rest/v2/all`)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const search = () => { 
    if (newSearch === '') return countries 
    else return countries.filter(country => country.name.toLowerCase().search(newSearch.toLowerCase()) > -1)
  }

  const filtered = () => {
    if (search().length > 10) {return <p>Too many matches, specify another filter</p>}
    else if (search().length > 1 && search().length <= 10) {return <Countries countries={search()} />}
    else if (search().length === 1) return <CountryData countries={search()} />
  }
  
  return (
    <div>
      <Filter newSearch={newSearch} handleSearch={handleSearch} />
      
      {filtered()}
    </div>
  )
}

export default App;
