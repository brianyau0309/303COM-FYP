import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import Nav from './Nav.jsx'
import Courses from './Courses.jsx'
import Questions from './Questions.jsx'
import Classrooms from './Classrooms.jsx'
import Notification from './Notification.jsx'
import Setting from './Setting.jsx'

export default class Student extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'nav': false,
    }
    this.navToggle = this.navToggle.bind(this)
  }

  navToggle() {
    this.setState({'nav': !this.state.nav}, () => console.log(this.state))
  }

  render() {
    let imgLink = window.location.origin + "/static/images/"
    let Header = (props) => (<div id="header">
                               <img className="header-icon" src={imgLink + "icons/icon-192x192.png"}/>
                               <span>{props.title}</span>
                               <img className="header-toggle" src={imgLink + "toggle.png"} onClick={this.navToggle}/>
                             </div>)
    return (
      <div id="Student">
        <Router>
          <div id="main">
            <Nav nav={this.state.nav} navToggle={this.navToggle}/>
            <Switch>
              <Route path="/courses">
                <Header title='Courses'/>
                <Courses/>
              </Route>
              <Route path="/questions">
                <Header title='Questions'/>
                <Questions/>
              </Route>
              <Route path="/classrooms">
                <Header title='Classrooms'/>
                <Classrooms/>
              </Route>
              <Route path="/notification">
                <Header title='Notification'/>
                <Notification/>
              </Route>
              <Route path="/setting">
                <Header title='Setting'/>
                <Setting/>
              </Route>
              <Redirect from="/" to="/courses"/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}
