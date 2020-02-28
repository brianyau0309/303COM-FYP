import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import Nav from './Nav.jsx'

import Courses from './Courses/Courses.jsx'
import CreateCourse from './Courses/CreateCourse.jsx'
import MyCourses from './Courses/MyCourses.jsx'
import CourseCollection from './Courses/CourseCollection.jsx'

import Questions from './Questions/Questions.jsx'
import CreateQuestions from './Questions/CreateQuestion.jsx'
import MyQuestions from './Questions/MyQuestions.jsx'
import QuestionCollection from './Questions/QuestionCollection.jsx'

import Classrooms from './Classrooms/Classrooms.jsx'
import Classroom from './Classrooms/Classroom.jsx'
import ClassroomMember from './Classrooms/ClassroomMembers.jsx'
import CreateTask from './Classrooms/CreateTask.jsx'

import Notification from './Notification/Notification.jsx'
import Setting from './Setting/Setting.jsx'

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
              <Route path="/courses/collection">
                <div className="header">
                  <img className="header-icon" src={imgBack} onClick={() => window.history.back()}/>
                  <span>My Collection</span>
                </div>
                <CourseCollection/>
              </Route>
              {this.state.user_data.user_type === 'teacher' ?
                <Route path="/courses/my">
                  <div className="header">
                    <img className="header-icon" src={imgBack} onClick={() => window.history.back()}/>
                    <span>My Courses</span>
                  </div>
                  <MyCourses/>
                </Route>
              : null}
              {this.state.user_data.user_type === 'teacher' ?
                <Route path="/courses/create">
                  <div className="header">
                    <img className="header-icon" src={imgBack} onClick={() => window.history.back()}/>
                    <span>Create Courses</span>
                  </div>
                  <CreateCourse/>
                </Route>
              : null}
              <Route path="/courses">
                <Header title='Courses'/>
                <Courses user_type={this.state.user_data.user_type} user_id={this.state.user_data.user_id}/>
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
                  <span>Create Questions</span>
                </div>
                <CreateQuestions/>
              </Route>
              <Route path="/questions">
                <Header title='Questions'/>
                <Questions user_id={this.state.user_data.user_id}/>
              </Route>

              {this.state.user_data.user_type === 'teacher' ?
                <Route path="/classrooms/:id/create_task">
                  <div className="header">
                    <img className="header-icon" src={imgBack} onClick={() => window.history.back()}/>
                    <span>Create Task</span>
                  </div>
                  <CreateTask/>
                </Route>
              : null}
              <Route path="/classrooms/:id/members">
                <div className="header">
                  <img className="header-icon" src={imgBack} onClick={() => window.history.back()}/>
                  <span>Classroom Members</span>
                </div>
                <ClassroomMember/>
              </Route>
              <Route path="/classrooms/:id">
                <div className="header">
                  <img className="header-icon" src={imgBack} onClick={() => window.history.back()}/>
                  <span>Classroom</span>
                </div>
                <Classroom/>
              </Route>
              <Route path="/classrooms">
                <Header title='Classrooms'/>
                <Classrooms user_type={this.state.user_data.user_type}/>
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
