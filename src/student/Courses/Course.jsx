import React from 'react'

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
      'comments': []
    }
    this.child = React.createRef()
    this.checkCanComment = this.checkCanComment.bind(this)
    this.checkMyCourse = this.checkMyCourse.bind(this)
    this.checkIsCollection = this.checkIsCollection.bind(this)
    this.loadCourse = this.loadCourse.bind(this)
    this.loadComments = this.loadComments.bind(this)
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
          this.setState({ 'myQuestion': result.myQuestion })
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
    fetch('/api/course?q='+id).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 
            'commentField': false,
            'course_id': result.course.course_id,
            'title': result.course.title, 
            'author': result.course.nickname,
            'description': result.course.description,
          })
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

  submitComment() {
    let comment = TextField.document.body.innerHTML
    console.log(comment)
    fetch('/api/courses_comments',{
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
        <div className="header">
          <img className='header-icon' src={imgBack} onClick={this.openToggle}/>
          <span>Question</span>
        </div>
        
        <div className="Course-detail">
          <div>{this.state.title}</div>
          <div>{this.state.author}</div>
          <div className="course_description" dangerouslySetInnerHTML={{__html: this.state.description}}></div>
        </div>

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
        
        <EditComment ref={this.child} reload={this.reloadComments} course_id={this.state.course_id}/>
      </div>
    )
  }
}
