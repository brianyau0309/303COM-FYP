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
      'course_id': '', 'title': '', 'author': '', 'description': '',
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
            'author': result.course.nickname,
            'description': result.course.description,
            'tags': result.course.tags,
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
  }

  deleteCourse() {
    fetch('/api/course?c='+this.state.course_id, { method: 'PATCH' }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 'deleteCourse': true })
          this.props.loadCourses()
        })
      }
    })
  }

  openLesson(c, l) {
    this.child4.current.loadLesson(c,l)
    this.child4.current.openToggle()
  }

  createLesson() {
    this.child3.current.openToggle()
  }

  collectionToggle(id, m) {
    fetch('/api/course_collection?c='+id, {method: m}).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.checkIsCollection(this.state.course_id)
        })
      }
    })
  }

  submitComment() {
    let comment = TextField.document.body.innerHTML
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
    this.checkCanComment(this.state.course_id)
    this.loadComments(this.state.course_id)
  }

  openToggle() {
    this.setState({ 'open': !this.state.open })
  }

  commentFieldToggle() {
    this.setState({ 'commentField': !this.state.commentField, 'commentRate': 5})
  }

  render() {
    return(
      <div className={this.state.open ? 'Course open' : 'Course close'}>
        { this.state.deleteCourse ? 
          <div style={{top: '0', left: '0', position: 'absolute', width: '100%', height: '100vh', background: 'white'}}>
            <div>Delete Course Success!</div>
              <div onClick={this.openToggle}>Back to Course Page</div>
          </div>
        : null }

        <div className="header">
          <img className='header-icon' src={imgBack} onClick={this.openToggle}/>
          <span>Course</span>
        </div>
        
        <div className="Course-detail">
          <div>{this.state.title}</div>
          <div>{this.state.author}</div>
          <div className="course_description" dangerouslySetInnerHTML={{__html: this.state.description}}></div>
          <div>Tags: {this.state.tags.map(t => t+' ')}</div>
        </div>

        {this.state.lessons.map(lesson => 
          <div onClick={() => this.openLesson(this.state.course_id, lesson.lesson_num)}>{lesson.title}</div>
        )}

        {this.state.myCourse ? 
          <div onClick={this.createLesson}>Create Lesson</div>
        : null}

        {this.state.myCourse ? 
          <div>
            <div onClick={() => this.editCourse(this.state.title, this.state.tags, this.state.description)}>Edit Course</div>
            <div onClick={this.deleteCourse}>Delete Course</div>
          </div>
        : null}

        {this.state.isCollection ? 
           <div onClick={() => this.collectionToggle(this.state.course_id, 'DELETE')}>Remove from Collection</div>
        :  <div onClick={() => this.collectionToggle(this.state.course_id, 'POST')}>Add to Collection</div> }

        <h3>Comments:</h3>

        {this.state.canComment ? 
          <div>
            <div onClick={this.commentFieldToggle}>I want to comment!</div> 
            {this.state.commentField ? 
              <div>
                {[...Array(5).keys()].map(i => 
                  (this.state.commentRate < i+1 ? 
                    <img src={imgEmptyStar} onClick={() => this.rating(i+1)}/> 
                  :  <img src={imgStar} onClick={() => this.rating(i+1)}/> 
                  )
                )}
                <span>{this.state.commentRate}</span>
                <TextEditor/>
                <button onClick={this.submitComment}>Submit</button>
              </div> 
            : null}
          </div>
         : null}
        
         {this.state.comments.map(c => {
           if (c.create_by !== this.state.solved_by) {
             return(
               <div>
                 <div>{c.nickname}</div>
                 {[...Array(5).keys()].map(i => 
                   (c.rating < i+1 ? 
                     <img src={imgEmptyStar}/> 
                   : <img src={imgStar}/> 
                   )
                 )}
                 <div dangerouslySetInnerHTML={{__html: c.content}}></div>
                 <div>{c.create_date}</div>
                 {this.props.user_id === c.create_by ? 
                   <div>
                     <div onClick={() => this.editComment(c.content, c.rating)}>Edit</div>
                     <div onClick={this.deleteComment}>Delete</div>
                   </div>
                 : null}
               </div>
             )
           }
         })}
      
         {this.state.myCourse ?
           <EditCourse ref={this.child2} reload={() => this.loadCourse(this.state.course_id)} course_id={this.state.course_id}/>
         : <EditComment ref={this.child} reload={this.reloadComments} course_id={this.state.course_id}/> }

         {this.state.myCourse ? <CreateLesson ref={this.child3} course_id={this.state.course_id} reload={() => this.loadLessons(this.state.course_id)}/> : null}

         <Lesson ref={this.child4} myCourse={this.state.myCourse} loadLessons={() => this.loadLessons(this.state.course_id)}/>

      </div>
    )
  }
}