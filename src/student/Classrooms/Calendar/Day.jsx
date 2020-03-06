import React from 'react'
import { Link, withRouter } from 'react-router-dom'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'
const imgPlus = 'https://img.icons8.com/flat_round/64/000000/plus.png'
const imgMinus = 'https://img.icons8.com/flat_round/64/000000/minus.png'

export default class Day extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'open': false, 'createEventToggle': false,
      'deadline': [], 'events': []
    }
    this.loadCalendar = this.loadCalendar.bind(this)
    this.createEvent = this.createEvent.bind(this)
    this.deleteEvent = this.deleteEvent.bind(this)
    this.createEventToggle = this.createEventToggle.bind(this)
    this.openToggle = this.openToggle.bind(this)
  }

  loadCalendar() {
    fetch(`/api/calendar?class=${this.props.class}&date=${this.props.date}`).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 'deadline': result.calendar.deadline, 'events': result.calendar.events })
        })
      }
    })
  }

  createEvent(e) {
    e.preventDefault()
    let form = document.forms.form_createEvent
    fetch(`/api/calendar?class=${this.props.class}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({'createEvent': {
        'name': form.event_name.value,
        'description': form.event_description.value,
        'date': this.props.date
      }})
    }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.loadCalendar()
          this.props.reload()
          form.event_name.value = ''
          form.event_description.value = ''
          this.setState({'createEventToggle': false})
        })
      }
    })
  }

  deleteEvent(event_num) {
    fetch(`/api/calendar?class=${this.props.class}&event=${event_num}`, {method: 'DELETE'}).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.loadCalendar()
          this.props.reload()
        })
      }
    })
  }

  createEventToggle() {
    this.setState({'createEventToggle': !this.state.createEventToggle})
  }

  openToggle() {
    this.setState({'open': !this.state.open})
  }

  render() {
    return (
      <div className={this.state.open ? 'Day content open' : 'Day content close'}>
        <div className="header">
          <Link className="header-icon" to={`/classrooms/${this.props.class}/calendar`}>
            <img className='header-icon' src={imgBack}/>
          </Link>
          <span>Day</span>
        </div>
        <div className="dayPannel">
          <span>{this.props.date ? this.props.date.replace('_','-').replace('_','-') : null}</span>
          <span></span>
          {this.props.user_type === 'teacher' ? <img src={imgPlus} onClick={this.createEventToggle}/> : null }
        </div>
        {this.state.createEventToggle && this.props.user_type === 'teacher' ? 
          <div>
            <div style={{textAlign: 'center'}}>New Event</div>
            <form name='form_createEvent' onSubmit={this.createEvent} style={{paddingBottom: '.5vh'}}>
              <input type="text" name="event_name" placeholder="Name of the Event" required/>
              <textarea name="event_description" placeholder="Desceibe the Event here..." required/>
              <input type="submit"/>
            </form>
          </div>
        : null}
        <ul>
          <li style={{textAlign: 'center'}}>Deadline Today</li>
          {this.state.deadline.map((task, i) => 
            <Link to={`/classrooms/${task.classroom}/tasks/${task.task_num}`}>
              <li className="deadline-item">
                <span>{i+1}</span>
                <span>{task.title} (Task number: {task.task_num})</span>
              </li>
            </Link>
          )}
          <li style={{textAlign: 'center'}}>Events Today</li>
          {this.state.events.map((event, i) => 
            <li className="event-item">
              <div>
                <span>{i+1}</span>
                <span>{event.event}</span>
                {this.props.user_type === 'teacher' ? 
                  <img src={imgMinus} onClick={() => this.deleteEvent(event.event_num)}/>
                : null}
              </div>
              <div>{event.detail}</div>
            </li>
          )}
        </ul>
      </div>
    )
  }
} 
