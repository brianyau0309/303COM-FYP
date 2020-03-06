import React from 'react'
import { Link } from 'react-router-dom'

const day = (classroom, date, deadline, events, day) => {
  let dayHead, deadlineCount = 0, deadlineDetail, eventCount = 0, eventDetail, todayDate = new Date().toLocaleDateString()

  if (day === 0) {
    dayHead = <div className="dayHead"></div>
  } else if (todayDate === (new Date(`${date.year}/${date.month}/${day}`).toLocaleDateString())) {
    dayHead = <div className="dayHead today">{day}</div>
  } else {
    dayHead = <div className="dayHead">{day}</div>
  }

  deadline.forEach(task => {
    if ((new Date(task.deadline).toLocaleDateString()) === (new Date(`${date.year}/${date.month}/${day}`).toLocaleDateString())) {
      deadlineCount++
    }
  })

  events.forEach(event => {
    if ((new Date(event.event_date).toLocaleDateString()) === (new Date(`${date.year}/${date.month}/${day}`).toLocaleDateString())) {
      eventCount++
    }
  })

  deadlineDetail = (deadlineCount > 0 ? <div className="deadline">{deadlineCount} Deadline</div> : null)
  eventDetail = (eventCount > 0 ? <div className="event">{eventCount} Events</div> : null)

  return(
    <Link className="day" to={day !== 0 ? `/classrooms/${classroom}/calendar/${date.year}_${date.month}_${day}` : null}>
      <li>
        {dayHead}
        <div className="dayDetail">
          {deadlineDetail}
          {eventDetail}
        </div>
      </li>
    </Link>
)}

const dayList = (classroom, date, deadline, events) => {
  let bigMonth = [1,3,5,7,8,10,12], list = [], days = 30, weekday = (new Date(`${date.year}/${date.month}/1`)).getDay()
  if (date.month === 2) {
    let y = date.year
    if ((y%4 === 0 && y%100 != 0)||(y%400 === 0 && y%3200 != 0)) { days = 29 }
    else { days = 28 }
  } else {
    for (let i = 0; i < bigMonth.length; i++) {
      if (date.month === bigMonth[i]) { days = 31 }
    }
  }
  let daynum = day.bind(null, classroom, date, deadline, events)
  for (let i = 1; i <= weekday; i++) { list.push(daynum(0)) }
  for (let i = 1; i <= days; i++) { list.push(daynum(i)) }

  return (<ul className="days">{list}</ul>)
}

export default class Days extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render() {
    let Month = dayList(this.props.class, this.props.date, this.props.deadline, this.props.events)
    
    return (
      <div className="day-list">
        {Month}
      </div>
    )
  }
} 
