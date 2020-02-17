import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import Nav from './Nav.jsx'
import Courses from './Courses.jsx'
import Questions from './Questions.jsx'
import MyQuestions from './MyQuestions.jsx'
import QuestionCollection from './QuestionCollection.jsx'
import CreateQuestions from './CreateQuestion.jsx'
import Classrooms from './Classrooms.jsx'
import Notification from './Notification.jsx'
import Setting from './Setting.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

export default class Student extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'nav': false,
      'user_data': {},
    }
    this.navToggle = this.navToggle.bind(this)
    this.loadUser = this.loadUser.bind(this)
  }

  componentDidMount() {
    this.loadUser()
  }

  navToggle() {
    this.setState({'nav': !this.state.nav}, () => console.log(this.state))
  }
  
  loadUser() {
    fetch('/api/user_data').then(res => {
      if (res.ok) {
        res.json().then(result => {
          this.setState({'user_data': result.user_data}, () => console.log(this.state.user_data))
        })
      }
    })
  }

  render() {
    let imgLink = window.location.origin + "/static/images/"
    let Header = (props) => (<div className="header">
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
              <Route path="/questions/my">
                <div className="header">
                  <img className="header-icon" src={imgBack} onClick={() => window.history.back()}/>
                  <span>My Questions</span>
                </div>
                <MyQuestions/>
              </Route>
              <Route path="/questions/collection">
                <div className="header">
                  <img className="header-icon" src={imgBack} onClick={() => window.history.back()}/>
                  <span>My Collection</span>
                </div>
                <QuestionCollection/>
              </Route>
              <Route path="/questions/create">
                <div className="header">
                  <img className="header-icon" src={imgBack} onClick={() => window.history.back()}/>
                  <span>Questions</span>
                </div>
                <CreateQuestions/>
              </Route>
              <Route path="/questions">
                <Header title='Questions'/>
                <Questions user_id={this.state.user_data.user_id}/>
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
                <Setting user_data={this.state.user_data}/>
              </Route>
              <Redirect from="/" to="/courses"/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}
