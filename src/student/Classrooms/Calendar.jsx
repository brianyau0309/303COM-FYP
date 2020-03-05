import React from 'react'
import { Link, withRouter } from 'react-router-dom'

import Days from './Days.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

class Calendar extends React.Component {
  constructor () {
    super();
    this.state = {
      'today': new Date(Date.now()).toLocaleDateString(),
      'center': '',
      'date': {'year': 2000, 'month': 1},
      'eventList': [],
    }
    this.createMonthList = this.createMonthList.bind(this)
    this.changeMonth = this.changeMonth.bind(this)
  }

  componentDidMount() {
    this.createMonthList()
  }

  createMonthList() {
    let todayYear = parseInt(this.state.today.split('/')[2])
    let todayMonth = parseInt(this.state.today.split('/')[1])
    let date = {'year': todayYear, 'month': todayMonth}
    this.setState({ 'date': date })
  }

  changeMonth(num) {
    let date = this.state.date
    if (date.month + num < 1) { date = {'year': date.year - 1, 'month': date.month + 12 + num} }
    else if (date.month + num > 12) { date = {'year': date.year + 1, 'month': date.month - 12 + num} }
    else { date = {'year': date.year, 'month': date.month + num} }
    this.setState({ 'date': date })
  }
    
  render() {
    return (
      <div className="Calendar content">
        <div className="header" style={{gridArea: 'header'}}>
          <Link className="header-icon" to={'/classrooms/'+this.props.match.params.class}>
            <img className='header-icon' src={imgBack}/>
          </Link>
          <span>Calendar</span>
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
          <Days date={this.state.date}/>
      </div>
    )
  }
} 

export default withRouter(Calendar)
