import React from 'react'
import { NavLink } from 'react-router-dom'

import Course from './Course.jsx'

export default class Courses extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 'new': [] }
    this.child = React.createRef()
    this.loadCourses = this.loadCourses.bind(this)
    this.callCourse = this.callCourse.bind(this)
  }

  componentDidMount() {
    this.loadCourses()
  }

  loadCourses() {
    fetch('/api/courses').then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 
            'new': result.courses.new,
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
      <div className="Courses content">
        <div>
          <select>
            <option>Title</option>
            <option>Tag</option>
            <option>Author</option>
          </select>
          <input type='text' placeholder='Search Courses Here!'/>
          <span>Search</span>
        </div>

        { this.props.user_type === 'teacher' ? <NavLink to='/courses/create'><div>Create Course</div></NavLink> : null }
        { this.props.user_type === 'teacher' ? <NavLink to='/courses/my'><div>My Courses</div></NavLink> : null }
        <NavLink to='/courses/collection'><div>My Collection</div></NavLink>

        <h1>New</h1>
        <ul className='courses-list'>
          {this.state.new.map(c => 
            <li onClick={() => this.callCourse(c.course_id)}>
              <h4>{c.title}</h4>
              <h6>{c.nickname}</h6>
              <div dangerouslySetInnerHTML={{__html: c.description}}></div>
              <h6>{c.create_date}</h6>
            </li>
          )}
        </ul>
        <h3>Hotest</h3>
        <ul>2</ul>
        <h3>Recommand</h3>
        <ul>3</ul>

        <Course ref={this.child} user_id={this.props.user_id} loadCourses={this.loadCourses}/>
      </div>
    )
  }
}
