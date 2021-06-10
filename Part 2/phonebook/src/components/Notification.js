import React, {useState} from 'react'

const Notification = ({eventMessage, isError}) => {
    if (eventMessage === null) {return null}
    
    if (isError) {
        return (
            <div className="error">
                {eventMessage}
            </div>
        )
    }
    return (
        <div className="notification">
            {eventMessage}
        </div>
    )
}

export default Notification