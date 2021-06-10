import React from 'react'

const Filter = ({newSearch, handleSearch}) => {
    return(
      <p>filter shown with 
      <input value={newSearch} onChange={handleSearch}/>
      </p>
    )
  }

  export default Filter