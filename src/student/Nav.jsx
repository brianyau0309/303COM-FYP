import React from 'react'
import { NavLink  } from 'react-router-dom'

const imgCourses = 'https://img.icons8.com/dusk/64/000000/course-assign.png'
const imgQuestions = 'https://img.icons8.com/dusk/64/000000/why-us-male.png'
const imgClassrooms = 'https://img.icons8.com/dusk/64/000000/class.png'
const imgSelf = 'https://img.icons8.com/dusk/64/000000/small-smile.png'
const imgNotice = 'https://img.icons8.com/dusk/64/000000/appointment-reminders.png'
const imgLogout = 'https://img.icons8.com/dusk/64/000000/logout-rounded-left.png'

export default class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
  }

  logout(e) {
    e.preventDefault()
    fetch('/logout', {method: 'POST'}).then(res => {
      if (res.ok) {
        res.json().then(result => {
          if (result.logout === 'Success') {
            window.location.href = window.location.origin
          }
        })
      }
    })
  }

  render() {
    return (
      <ul id="nav" className={this.props.nav ? 'open' : 'close'}>
        <NavLink to="/courses" onClick={this.props.navToggle}>
          <li className="nav-items">
            <img src={imgCourses}/>
            <div>Courses</div>
          </li>
        </NavLink>
        <NavLink to="/questions" onClick={this.props.navToggle}>
          <li className="nav-items">
            <img src={imgQuestions}/>
            <div>Questions</div>
          </li>
        </NavLink>
        <NavLink to="/classrooms" onClick={this.props.navToggle}>
          <li className="nav-items">
            <img src={imgClassrooms}/>
            <div>Classrooms</div>
          </li>
        </NavLink>
        <NavLink to="/setting" onClick={this.props.navToggle}>
          <li className="nav-items">
            <img src={imgSelf}/>
            <div>Self</div>
          </li>
        </NavLink>
        <NavLink to="/notification" onClick={this.props.navToggle}>
          <li className="nav-items">
            <img src={imgNotice}/>
            <div>Notification</div>
          </li>
        </NavLink>
        <a href="/" onClick={this.logout}>
          <li className="nav-items">
            <img src={imgLogout}/>
            <div>Logout</div>
          </li>
        </a>
      </ul>
    )
  }
}
