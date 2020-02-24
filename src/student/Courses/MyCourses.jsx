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
        <ul className='courses-list'>
          {this.state.myCourses.map(c => 
            <li onClick={() => this.callCourse(c.course_id)}>
              <h4>{c.title}</h4>
              <h6>{c.nickname}</h6>
              <div dangerouslySetInnerHTML={{__html: c.description}}></div>
              <h6>{c.create_date}</h6>
            </li>
          )}
        </ul>

        <Course ref={this.child} user_id={this.props.user_id} loadCourses={this.loadCourses}/>
      </div>
    )
  }
}

