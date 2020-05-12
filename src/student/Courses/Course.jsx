import React from 'react'

import EditCourse from './EditCourse.jsx'
import Lesson from './Lession.jsx'
import CreateLesson from './CreateLesson.jsx'
import EditComment from './EditComment.jsx'
import TextEditor from '../../TextEditor.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'
const imgStar = 'https://img.icons8.com/emoji/48/000000/star-emoji.png'
const imgEmptyStar = 'https://img.icons8.com/color/48/000000/star--v1.png'

export default class Course extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'open': false, 'commentField': false, 'deleteCourse': false,
      'canComment': false, 'myCourse': false, 'isCollection': false,
      'course_id': '', 'title': '', 'author': '', 'nickname': '', 'description': '',
      'commentRate': 5,
      'lessons': [],'comments': [], 'tags': []
    }
    this.child = React.createRef()
    this.child2 = React.createRef()
    this.child3 = React.createRef()
    this.child4 = React.createRef()
    this.checkCanComment = this.checkCanComment.bind(this)
    this.checkMyCourse = this.checkMyCourse.bind(this)
    this.checkIsCollection = this.checkIsCollection.bind(this)
    this.loadCourse = this.loadCourse.bind(this)
    this.loadLessons = this.loadLessons.bind(this)
    this.loadComments = this.loadComments.bind(this)
    this.deleteCourse = this.deleteCourse.bind(this)
    this.openLesson = this.openLesson.bind(this)
    this.createLesson = this.createLesson.bind(this)
    this.collectionToggle = this.collectionToggle.bind(this)
    this.submitComment = this.submitComment.bind(this)
    this.editComment = this.editComment.bind(this)
    this.deleteComment = this.deleteComment.bind(this)
    this.rating = this.rating.bind(this)
    this.reloadComments = this.reloadComments.bind(this)
    this.openToggle = this.openToggle.bind(this)
    this.openTrue = this.openTrue.bind(this)
    this.commentFieldToggle = this.commentFieldToggle.bind(this)
  }

  checkCanComment(id) {
    fetch('/api/courses_comments?cc='+id).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({'canComment': result.canComment})
        })
      }
    })
  }

  checkMyCourse(id) {
    fetch('/api/my_courses?c='+id).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 'myCourse': result.myCourse })
        })
      }
    })
  }
  
  checkIsCollection(id) {
    fetch('/api/course_collection?c='+id).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 'isCollection': result.isCollection })
        })
      }
    })
  }

  loadCourse(id) {
    fetch('/api/course?c='+id).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 
            'commentField': false,
            'deleteCourse': false,
            'course_id': result.course.course_id,
            'title': result.course.title, 
            'author': result.course.author,
            'nickname': result.course.nickname,
            'description': result.course.description,
            'tags': result.course.tags,
            'create_date': result.course.create_date,
            'avg_rate': result.course.avg_rate,
            'raters': result.course.raters,
          })
        })
      }
    })
  }

  loadLessons(id) {
    fetch('/api/lessons?c='+id).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({'lessons': result.lessons})
        })
      }
    })

  }
  
  loadComments(id) {
    fetch('/api/courses_comments?c='+id).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({'comments': result.comments})
        })
      }
    })
  }

  editCourse(title, tags, d) {
    this.child2.current.loadCourse(title, tags, d)
    this.child2.current.openToggle()
    document.querySelector('.Course').scrollTo(0,0)
  }

  deleteCourse() {
    fetch('/api/course?c='+this.state.course_id, { method: 'PATCH' }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 'deleteCourse': true })
          this.props.loadCourses()
          document.querySelector('.Course').scrollTo(0,0)
          document.querySelector('.Course').style.overflowY = 'hidden'
        })
      }
    })
  }

  openLesson(c, l) {
    this.child4.current.loadLesson(c,l)
    this.child4.current.openToggle()
    console.log(document.querySelector('.Course').style.overflowY)
    document.querySelector('.Course').scrollTo(0,0)
    document.querySelector('.Course').style.overflowY = 'hidden'
    console.log(document.querySelector('.Course').style.overflowY)
  }

  createLesson() {
    this.child3.current.openToggle()
    console.log(document.querySelector('.Course').style.overflowY)
    document.querySelector('.Course').scrollTo(0,0)
    document.querySelector('.Course').style.overflowY = 'hidden'
    console.log(document.querySelector('.Course').style.overflowY)
  }

  collectionToggle(id, m) {
    fetch('/api/course_collection?c='+id, {method: m}).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.checkIsCollection(this.state.course_id)
          this.props.loadCourses()
        })
      }
    })
  }

  submitComment() {
    let comment = window.frames['CourseComment'].document.body.innerHTML
    console.log(comment)
    fetch('/api/courses_comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'submit_comment': 
        {
          'course': this.state.course_id,
          'comment': comment,
          'rate': this.state.commentRate
        }
      })
    }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.reloadComments()
        })
      }
    })
  }

  editComment(c, r) {
    this.child.current.loadComment(c, r)
    this.child.current.openToggle()
    document.querySelector('.Course').scrollTop = 0
    document.querySelector('.Course').style.overflowY = 'hidden'
  }

  deleteComment() {
    fetch('/api/courses_comments?c='+this.state.course_id, { method: 'DELETE' }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.reloadComments()
        })
      }
    })
  }

  rating(r) {
    this.setState({ 'commentRate': r })
  }

  reloadComments() {
    this.loadCourse(this.state.course_id)
    this.checkCanComment(this.state.course_id)
    this.loadComments(this.state.course_id)
  }

  openToggle() {
    this.setState({ 'open': !this.state.open })
  }

  openTrue() {
    this.setState({ 'open': true })
    if (this.child.current) this.child.current.openFalse()
    if (this.child2.current) this.child2.current.openFalse()
    if (this.child3.current) this.child3.current.openFalse()
    if (this.child4.current) this.child4.current.openFalse()
    document.querySelector('.Course').style.overflowY = 'scroll'
    document.querySelector('.Lesson').style.overflowY = 'scroll'
  }

  commentFieldToggle() {
    this.setState({ 'commentField': !this.state.commentField, 'commentRate': 5})
  }

  render() {
    return(
      <div className={this.state.open ? 'Course open' : 'Course close'}>
        { this.state.deleteCourse ? 
          <div className="success_page">
            <div>Delete Course Success!</div>
              <div className="btn" onClick={this.openToggle}>Back to Course Page</div>
          </div>
        : null }

        <div className="header sticky-top hidden">
          <img className='header-icon' src={imgBack} onClick={this.openToggle}/>
          <span>Course</span>
        </div>
        
        <div className="course-detail">
          <div className="title">{this.state.title}</div>
          <div className="author" onClick={() => this.props.userInfoToggle(this.state.author)}>Author: {this.state.nickname}</div>
          <div className="description" dangerouslySetInnerHTML={{__html: this.state.description}}></div>
          <div className="tags">Tags: {this.state.tags.map(t => t+' ')}</div>
          <div style={{textAlign: 'right', padding: '1vh 1vh 0 1vh'}}>
              {this.state.create_date && new Date(this.state.create_date).toISOString().split('T')[0]}&nbsp;
              {this.state.create_date && new Date(this.state.create_date).toISOString().split('T')[1].split('.')[0]}
          </div>
        </div>

        {this.state.lessons.length > 0 ? 
          <div className="lesson-panel">
            <div className="lesson" style={{cursor: 'default', borderBottom: '1px solid darkgray'}}>Lessons</div>
            {this.state.lessons.map(lesson => 
              <div className="lesson" onClick={() => this.openLesson(this.state.course_id, lesson.lesson_num)}>
                {lesson.title}  
                {lesson.video_link ? <span style={{background: 'lightskyblue', margin: '0 0.5vh', fontSize: '2vh', padding: '0.5vh', borderRadius: '5px'}}>Video</span> : null} 
                {lesson.filename ? <span style={{background: 'lightyellow', margin: '0 0.5vh', fontSize: '2vh', padding: '0.5vh', borderRadius: '5px'}}>File</span> : null}
              </div>
            )}
        </div>

        : null}

        <div className="course-btn-panel">
          {this.state.myCourse ? 
            <div className="create" onClick={this.createLesson}>Create Lesson</div>
          : null}

          {this.state.myCourse ? 
            <div className="flex">
              <div className="edit" onClick={() => this.editCourse(this.state.title, this.state.tags, this.state.description)}>Edit Course</div>
              <div className="delete" onClick={this.deleteCourse}>Delete Course</div>
            </div>
          : null}

          <div className="rate">Course Rate: {this.state.avg_rate ? this.state.avg_rate.toFixed(2) : '--'}({this.state.raters ? this.state.raters : '--'})</div>

          {this.state.isCollection ? 
             <div className="collection remove" onClick={() => this.collectionToggle(this.state.course_id, 'DELETE')}>Remove from Collection</div>
          :  <div className="collection add" onClick={() => this.collectionToggle(this.state.course_id, 'POST')}>Add to Collection</div> }
        </div>

        <div className="comments-header">Comments</div>

        {this.state.canComment ? 
          <div className="comments-header" style={{background: 'lightgreen', fontWeight: 'auto'}}>
            <div onClick={this.commentFieldToggle} style={{cursor: 'pointer'}}>I want to comment!</div> 
            {this.state.commentField ? 
              <div>
                {[...Array(5).keys()].map(i => 
                  (this.state.commentRate < i+1 ? 
                    <img src={imgEmptyStar} onClick={() => this.rating(i+1)}/> 
                  : <img src={imgStar} onClick={() => this.rating(i+1)}/> )
                )}
                <span>{this.state.commentRate}</span>
                <TextEditor editor='CourseComment'/>
                <button onClick={this.submitComment}>Submit</button>
              </div> 
            : null}
          </div>
        : null}
        {this.state.comments.length > 0 ?
          <ul className="comment-list">
            {this.state.comments.map(c => {
              if (c.create_by !== this.state.solved_by) {
                return(
                  <li>
                    <div onClick={() => this.props.userInfoToggle(c.create_by)}>
                      {c.nickname}&nbsp;
                      {[...Array(5).keys()].map(i => 
                        (c.rating < i+1 ? 
                          <img src={imgEmptyStar}/> 
                        : <img src={imgStar}/> 
                        )
                      )}
                      <span style={{float: 'right'}}>
                          {new Date(c.create_date).toISOString().split('T')[0]}&nbsp;
                          {new Date(c.create_date).toISOString().split('T')[1].split('.')[0]}
                      </span>
                    </div>
                    <div className="comment-content" dangerouslySetInnerHTML={{__html: c.content}}></div>
                    {this.props.user_id === c.create_by ? 
                      <div className="flex">
                        <div className="edit" onClick={() => this.editComment(c.content, c.rating)}>Edit</div>
                        <div className="delete" onClick={this.deleteComment}>Delete</div>
                      </div>
                    : null}
                  </li>
                )
              }
            })}
          </ul>
        : null} 
      
         {this.state.myCourse ?
           <EditCourse ref={this.child2} reloadCourses={this.props.loadCourses} reload={() => this.loadCourse(this.state.course_id)} course_id={this.state.course_id}/>
         : <EditComment ref={this.child} reload={this.reloadComments} course_id={this.state.course_id}/> }

         {this.state.myCourse ? <CreateLesson ref={this.child3} course_id={this.state.course_id} reload={() => this.loadLessons(this.state.course_id)}/> : null}

         <Lesson ref={this.child4} myCourse={this.state.myCourse} loadLessons={() => this.loadLessons(this.state.course_id)}/>

      </div>
    )
  }
}
