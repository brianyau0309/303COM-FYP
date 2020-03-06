import React from 'react'
import { Link, withRouter } from 'react-router-dom'

import Days from './Days.jsx'
import Day from './Day.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

class Calendar extends React.Component {
  constructor () {
    super();
    this.state = {
      'date': {'year': 2000, 'month': 1},
      'deadline': [], 'events': [],
    }
    this.child = React.createRef()
    this.loadCalendar = this.loadCalendar.bind(this)
    this.loadDate = this.loadDate.bind(this)
    this.createMonthList = this.createMonthList.bind(this)
    this.changeMonth = this.changeMonth.bind(this)
    this.openChild = this.openChild.bind(this)
  }

  componentDidMount() {
    this.createMonthList()
    this.loadCalendar()
    this.loadDate()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match !== this.props.match) {
      this.loadDate()
      if (prevProps.match.path === "/classrooms/:class/calendar/:date" && this.props.match.path === "/classrooms/:class/calendar") {
        if (this.child.current) {
          this.child.current.openToggle()
        }
      }  
    }
  }

  loadCalendar() {
    fetch(`/api/calendar?class=${this.props.match.params.class}`).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 'deadline': result.calendar.deadline, 'events': result.calendar.events })
        })
      }
    })
  }

  loadDate() {
    if (this.props.match.path === "/classrooms/:class/calendar/:date") {
      if (this.child.current) {
        this.child.current.loadCalendar()
        this.child.current.openToggle()
      }  
    }
  }

  createMonthList() {
    let today = new Date().toLocaleDateString(), 
      todayYear = parseInt(today.split('/')[2]),
      todayMonth = parseInt(today.split('/')[1]),
      date = {'year': todayYear, 'month': todayMonth}
    this.setState({ 'date': date })
  }

  changeMonth(num) {
    let date = this.state.date
    if (date.month + num < 1) { date = {'year': date.year - 1, 'month': date.month + 12 + num} }
    else if (date.month + num > 12) { date = {'year': date.year + 1, 'month': date.month - 12 + num} }
    else { date = {'year': date.year, 'month': date.month + num} }
    this.setState({ 'date': date })
  }

  openChild() {
    this.child.current.openToggle()
  }
    
  render() {
    return (
      <div className={this.props.match.path === "/classrooms/:class/calendar" ? "Calendar conetent" : "Calendar conetent hide"}>
        <div className="header" style={{gridArea: 'header'}}>
          <Link className="header-icon" to={'/classrooms/'+this.props.match.params.class}>
            <img className='header-icon' src={imgBack}/>
          </Link>
          <span onClick={this.openChild}>Calendar</span>
        </div>
        <div className="month">
          <img src={imgBack} className="left" onClick={() => this.changeMonth(-1)}/>
          <span className="middle">{this.state.date.year}-{this.state.date.month}</span>
          <img src={imgBack} className="right" onClick={() => this.changeMonth(1)}/>
        </div>
          <ul className="weeks">
              <li className="week sunday">Sun</li>
              <li className="week">Mon</li>
              <li className="week">Tue</li>
              <li className="week">Wed</li>
              <li className="week">Thu</li>
              <li className="week">Fri</li>
              <li className="week">Sat</li>
          </ul>
          <Days deadline={this.state.deadline} events={this.state.events} date={this.state.date} class={this.props.match.params.class}/>
          <Day reload={this.loadCalendar} ref={this.child} date={this.props.match.params.date ? this.props.match.params.date : ''  } user_type={this.props.user_type} class={this.props.match.params.class}/>
      </div>
    )
  }
} 

export default withRouter(Calendar)
