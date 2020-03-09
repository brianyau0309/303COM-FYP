import React from 'react'
import { NavLink } from 'react-router-dom'

import Course from './Course.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

export default class Courses extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      'new': [], 'hot':[], 'recommand': [],
      'search_mode': false, 'search_query': '', 'search_method': 'title','search_result': []
    }
    this.child = React.createRef()
    this.loadCourses = this.loadCourses.bind(this)
    this.loadCourseSearch = this.loadCourseSearch.bind(this) 
    this.callCourse = this.callCourse.bind(this)
    this.inputOnChange = this.inputOnChange.bind(this)
    this.inputKeyDown = this.inputKeyDown.bind(this)
    this.methodOnChange = this.methodOnChange.bind(this)
    this.back =  this.back.bind(this)
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
            'hot': result.courses.hot,
            'recommand': result.courses.recommand,
          }, () => console.log(this.state))
        })
      }
    })
  }

  loadCourseSearch() {
    fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        'search_query': this.state.search_query,
        'search_method': this.state.search_method
      })
    }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          this.setState({ 'search_result': result.search_result }, () => console.log(this.state))
          this.setState({ 'search_mode': true })
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

  inputOnChange(event) {
    this.setState({ 'search_query': event.target.value })
  }

  inputKeyDown(event) {
    if (event.key === 'Enter') this.loadCourseSearch()
  }

  methodOnChange(e) {
    console.log(e.target.value)
    this.setState({'search_method': e.target.value})
  }
  
  back() {
    this.loadCourses()
    this.setState({ 'search_mode': false, 'search_query': '' })
  }

  render() {
    return (
      <div className="Courses content">
        <div>
          <select onChange={this.methodOnChange} value={this.state.search_method}>
            <option value='title'>Title</option>
            <option value='tags'>Tags</option>
            <option value='author'>Author</option>
          </select>
          <input type='text' placeholder='Search Courses Here!' value={this.state.search_query} onChange={this.inputOnChange} onKeyDown={this.inputKeyDown}/>
          <span onClick={this.loadCourseSearch}>Search</span>
        </div>

        {this.state.search_mode ? 
          <div>
            <h3><img src={imgBack} onClick={this.back}/>Search Results</h3>
            <ul className="courses-list">
              {this.state.search_result.map(c => 
                <li onClick={() => this.callCourse(c.course_id)}>
                  <h4>{c.title}</h4>
                  <h6>{c.nickname}</h6>
                  <div dangerouslySetInnerHTML={{__html: c.description}}></div>
                  <h6>{c.create_date}</h6>
                </li>
              )}
            </ul>
          </div>
        :
          <div>
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
            <ul>
              {this.state.hot.map(c => 
                <li onClick={() => this.callCourse(c.course_id)}>
                  <h4>{c.title}</h4>
                  <h6>{c.nickname}</h6>
                  <div dangerouslySetInnerHTML={{__html: c.description}}></div>
                  <h6>{c.create_date}</h6>
                </li>
              )}
            </ul>
            <h3>Recommand</h3>
            <ul>
              {this.state.recommand.map(c => 
                <li onClick={() => this.callCourse(c.course_id)}>
                  <h4>{c.title}</h4>
                  <h6>{c.nickname}</h6>
                  <div dangerouslySetInnerHTML={{__html: c.description}}></div>
                  <h6>{c.create_date}</h6>
                </li>
              )}
            </ul>
          </div>
        }

            <Course ref={this.child} user_id={this.props.user_id} loadCourses={this.loadCourses} userInfoToggle={this.props.userInfoToggle}/>
      </div>
    )
  }
}
