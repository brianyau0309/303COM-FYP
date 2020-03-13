import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import Nav from './Nav.jsx'
import UserInfo from './UserInfo.jsx'

import Courses from './Courses/Courses.jsx'
import CreateCourse from './Courses/CreateCourse.jsx'
import MyCourses from './Courses/MyCourses.jsx'
import CourseCollection from './Courses/CourseCollection.jsx'

import Questions from './Questions/Questions.jsx'
import CreateQuestions from './Questions/CreateQuestion.jsx'
import MyQuestions from './Questions/MyQuestions.jsx'
import QuestionCollection from './Questions/QuestionCollection.jsx'

import Classrooms from './Classrooms/Classrooms.jsx'

import Notification from './Notification/Notification.jsx'
import Setting from './Setting/Setting.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

export default class Student extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'nav': false, 'userInfo': false,
      'user_data': {},
    }
    this.child = React.createRef()
    this.navToggle = this.navToggle.bind(this)
    this.loadUser = this.loadUser.bind(this)
    this.userInfoToggle = this.userInfoToggle.bind(this)
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

  userInfoToggle(target) {
    if (this.state.userInfo) {
      this.setState({ 'userInfo': false })
    } else {
      this.setState({ 'userInfo': true }, () => {
        this.child.current.loadUserInfo(target)
      })
    }
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
            {this.state.userInfo ? <UserInfo ref={this.child} user_id={this.state.user_data.user_id} openToggle={this.userInfoToggle}/> : null}
            <Switch>
              <Route path="/courses/collection">
                <div className="header">
                  <img className="header-icon" src={imgBack} onClick={() => window.history.back()}/>
                  <span>My Collection</span>
                </div>
                <CourseCollection userInfoToggle={this.userInfoToggle}/>
              </Route>
              {this.state.user_data.user_type === 'teacher' ?
                <Route path="/courses/my">
                  <div className="header">
                    <img className="header-icon" src={imgBack} onClick={() => window.history.back()}/>
                    <span>My Courses</span>
                  </div>
                  <MyCourses userInfoToggle={this.userInfoToggle}/>
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
                <Courses user_type={this.state.user_data.user_type} user_id={this.state.user_data.user_id} userInfoToggle={this.userInfoToggle}/>
              </Route>

              <Route path="/questions/my">
                <div className="header">
                  <img className="header-icon" src={imgBack} onClick={() => window.history.back()}/>
                  <span>My Questions</span>
                </div>
                <MyQuestions userInfoToggle={this.userInfoToggle}/>
              </Route>
              <Route path="/questions/collection">
                <div className="header">
                  <img className="header-icon" src={imgBack} onClick={() => window.history.back()}/>
                  <span>My Collection</span>
                </div>
                <QuestionCollection userInfoToggle={this.userInfoToggle}/>
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
                <Questions user_id={this.state.user_data.user_id} userInfoToggle={this.userInfoToggle}/>
              </Route>

              <Route path="/classrooms/:class/chat">
                <Header title='Classrooms'/>
                <Classrooms user_type={this.state.user_data.user_type} user_id={this.state.user_data.user_id} userInfoToggle={this.userInfoToggle}/>
              </Route>
              <Route path="/classrooms/:class/calendar/:date">
                <Header title='Classrooms'/>
                <Classrooms user_type={this.state.user_data.user_type} user_id={this.state.user_data.user_id} userInfoToggle={this.userInfoToggle}/>
              </Route>
              <Route path="/classrooms/:class/calendar">
                <Header title='Classrooms'/>
                <Classrooms user_type={this.state.user_data.user_type} user_id={this.state.user_data.user_id} userInfoToggle={this.userInfoToggle}/>
              </Route>
              {this.state.user_data.user_type === 'teacher' ?
                <Route path="/classrooms/:class/create_task">
                  <Header title='Classrooms'/>
                  <Classrooms user_type={this.state.user_data.user_type} user_id={this.state.user_data.user_id} userInfoToggle={this.userInfoToggle}/>
                </Route>
              : null}
              {this.state.user_data.user_type === 'teacher' ?
                <Route path="/classrooms/:class/tasks/:task/edit">
                  <Header title='Classrooms'/>
                  <Classrooms user_type={this.state.user_data.user_type} user_id={this.state.user_data.user_id} userInfoToggle={this.userInfoToggle}/>
                </Route>
              : null}
              <Route path="/classrooms/:class/tasks/:task/results/:student">
                <Header title='Classrooms'/>
                <Classrooms user_type={this.state.user_data.user_type} user_id={this.state.user_data.user_id} userInfoToggle={this.userInfoToggle}/>
              </Route>
              {this.state.user_data.user_type === 'teacher' ?
                <Route path="/classrooms/:class/tasks/:task/results">
                  <Header title='Classrooms'/>
                  <Classrooms user_type={this.state.user_data.user_type} user_id={this.state.user_data.user_id} userInfoToggle={this.userInfoToggle}/>
                </Route>
              : null}
              {this.state.user_data.user_type === 'student' ?
                <Route path="/classrooms/:class/tasks/:task/edit_answer/:student">
                  <Header title='Classrooms'/>
                  <Classrooms user_type={this.state.user_data.user_type} user_id={this.state.user_data.user_id} userInfoToggle={this.userInfoToggle}/>
                </Route>
              : null}
              {this.state.user_data.user_type === 'student' ?
                <Route path="/classrooms/:class/tasks/:task/answer">
                  <Header title='Classrooms'/>
                  <Classrooms user_type={this.state.user_data.user_type} user_id={this.state.user_data.user_id} userInfoToggle={this.userInfoToggle}/>
                </Route>
              : null}
              <Route path="/classrooms/:class/tasks/:task">
                <Header title='Classrooms'/>
                <Classrooms user_type={this.state.user_data.user_type} user_id={this.state.user_data.user_id} userInfoToggle={this.userInfoToggle}/>
              </Route>
              <Route path="/classrooms/:class/tasks">
                <Header title='Classrooms'/>
                <Classrooms user_type={this.state.user_data.user_type} user_id={this.state.user_data.user_id} userInfoToggle={this.userInfoToggle}/>
              </Route>
              <Route path="/classrooms/:class/members">
                <Header title='Classrooms'/>
                <Classrooms user_type={this.state.user_data.user_type} user_id={this.state.user_data.user_id} userInfoToggle={this.userInfoToggle}/>
              </Route>
              <Route path="/classrooms/:class">
                <Header title='Classrooms'/>
                <Classrooms user_type={this.state.user_data.user_type} user_id={this.state.user_data.user_id} userInfoToggle={this.userInfoToggle}/>
              </Route>
              <Route path="/classrooms">
                <Header title='Classrooms'/>
                <Classrooms user_type={this.state.user_data.user_type} user_id={this.state.user_data.user_id} userInfoToggle={this.userInfoToggle}/>
              </Route>

              <Route path="/notification">
                <Header title='Notification'/>
                <Notification/>
              </Route>

              <Route path="/setting">
                <Header title='Setting'/>
                <Setting user_data={this.state.user_data} reload={this.loadUser}/>
              </Route>
              <Redirect from="/" to="/courses"/>
            </Switch>
          </div>
        </Router>
      </div>
    )
  }
}
