import React from 'react'

const CourseInfo = ({courses}) => {
    return (
      <div>
        <Header course="Web development curriculum" />
        {courses.map(course => <Course key={course.id} course={course}/>)}
      </div>
    )
  }
  
  const Course = ({course}) => {
    return (
      <div>
        <SubHeader name={course.name}/>
        <Content parts={course.parts} />
      </div>
    )
  }
  
  const Header = (props) => {
    console.log("Header gets", props)
    return (
      <h1>{props.course}</h1>
    )
  }
  
  const SubHeader = ({name}) => {
    console.log("SubHeader gets", name)
    return (
      <h2>{name}</h2>
    )
  }
  
  const Part = ({part, exercises}) => {
    console.log("Part gets", part, exercises)
    return (
      <p>
        {part} {exercises}
      </p>
    )
  }
  
  const Content = ({parts}) => {
    console.log("Content gets", parts)
    return (
      <div>
        {parts.map(part => <Part key={part.id} part={part.name} exercises={part.exercises} />)}
        <Total parts={parts} />
      </div>
    ) 
  }
  
  const Total = ({parts}) => {
    console.log("Total gets", parts)
    return (
      <p>
        <strong>
          total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises
        </strong>
      </p>
    )
  }

  export default CourseInfo