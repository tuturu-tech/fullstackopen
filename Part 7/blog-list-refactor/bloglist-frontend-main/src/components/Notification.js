/* eslint-disable linebreak-style */
import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const message = useSelector(state => state.messageObject.message)
  const isError = useSelector(state => state.messageObject.isError)

  if (message === null) {return null}

  if (isError) {
    return (
      <Alert variant="danger">
        {message}
      </Alert>
    )
  }

  return (
    <Alert variant="success">
      {message}
    </Alert>
  )
}

export default Notification