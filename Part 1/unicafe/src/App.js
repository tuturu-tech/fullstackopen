import React, { useState } from 'react'

const Header = ({text}) => {
  return (
  <h1>
    {text}
  </h1>
  )
}

const Button = ({handleClick, text}) => {
  return(
  <button onClick={handleClick}>
    {text}
  </button>
  )
}

const Statistic = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const sum = (good + neutral + bad)
  const average = (good - bad)/sum
  const percentage = (good/sum * 100) + ' %'
  
  if (good === 0 && neutral === 0 && bad === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  return (
    <table>
      <tbody>
      <Statistic text="good" value={good} />
      <Statistic text="neutral" value={neutral} />
      <Statistic text="bad" value={bad} />
      <Statistic text="all" value={sum} />
      <Statistic text="average" value={average} />
      <Statistic text="percentage" value={percentage} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text="give feedback" />
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Header text ="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
