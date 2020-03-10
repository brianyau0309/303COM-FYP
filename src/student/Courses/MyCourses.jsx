import React from 'react'

import Course from './Course.jsx'

export default class MyCourses extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 'myCourses': [] }
    this.child = React.createRef()
    this.loadCourses = this.loadCourses.bind(this)
    this.callCourse = this.callCourse.bind(this)
  }

  componentDidMount() {
    this.loadCourses()
  }

  loadCourses() {
    fetch('/api/my_courses').then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 
            'myCourses': result.my_courses,
          }, () => console.log(this.state))
        })
      }
    })
  }

  callCourse(id) {
    this.child.current.loadCourse(id)
    this.child.current.loadLessons(id)
    this.child.current.loadComments(id)
    this.child.current.checkCanComment(id)
    this.child.current.checkMyCourse(id)
    this.child.current.checkIsCollection(id)
    this.child.current.openToggle()
  }

  render() {
    return (
      <div className="MyCourses content">
        <ul className='course-list'>
          {this.state.myCourses.map(c => 
            <li onClick={() => this.callCourse(c.course_id)}>
              <h4>{c.title}</h4>
              <h6>Author: {c.nickname} <span>{new Date(c.create_date).toISOString().split('T')[0]} {new Date(c.create_date).toISOString().split('T')[1].split('.')[0]}</span></h6>
              <div dangerouslySetInnerHTML={{__html: c.description}}></div>
            </li>
          )}
        </ul>

        <Course ref={this.child} user_id={this.props.user_id} loadCourses={this.loadCourses} userInfoToggle={this.props.userInfoToggle}/>
      </div>
    )
  }
}

