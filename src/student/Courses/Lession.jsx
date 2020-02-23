import React from 'react'

import EditLesson from './EditLession.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

export default class Lesson extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'open': false, 'deleteLesson': false,
      'course_id': '', 'lesson_num': '', 'title': '', 'detail': '', 'video_link': '', 'filename': '', 'last_update': '',
    }
    this.child = React.createRef()
    this.editLesson = this.editLesson.bind(this)
    this.deleteLesson = this.deleteLesson.bind(this)
    this.openToggle = this.openToggle.bind(this)
  }
  
  loadLesson(course, num) {
    fetch('/api/lesson?c='+course+'&l='+num).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({
            'deleteLesson': false,
            'course_id': result.lesson.course,
            'lesson_num': result.lesson.lesson_num,
            'title': result.lesson.title, 
            'detail': result.lesson.detail,
            'video_link': result.lesson.video_link,
            'filename': result.lesson.filename,
            'last_update': result.lesson.last_update,
          })
        })
      }
    })
  }

  editLesson(t,f,v,d) {
    this.child.current.loadLesson(t,f,v,d)
    this.child.current.openToggle()
  }

  deleteLesson() {
    fetch('/api/lesson?c='+this.state.course_id+'&l='+this.state.lesson_num, { method: 'DELETE' }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 'deleteLesson': true })
          this.props.loadLessons()
        })
      }
    })
  }

  openToggle() {
    this.setState({ 'open': !this.state.open })
  }

  render() {
    return(
      <div className={this.state.open ? 'Lesson open' : 'Lesson close'}>
        { this.state.deleteLesson ? 
          <div style={{top: '0', left: '0', position: 'absolute', width: '100%', height: '100vh', background: 'white'}}>
            <div>Delete Lesson Success!</div>
              <div onClick={this.openToggle}>Back to Course Page</div>
          </div>
        : null }

        <div className="header">
          <img className='header-icon' src={imgBack} onClick={this.openToggle}/>
          <span>Lession</span>
        </div>
        
        <div className="Lesson-detail">
          <div>{this.state.title}</div>
          <a href={this.state.video_link}>Link</a>
          <div>{this.state.filename}</div>
          <div className="lesson_detail" dangerouslySetInnerHTML={{__html: this.state.detail}}></div>
        </div>

        {this.props.myCourse ? 
          <div>
            <div onClick={() => this.editLesson(this.state.title, this.state.filename, this.state.video_link, this.state.detail)}>Edit Lesson</div>
            <div onClick={this.deleteLesson}>Delete Lesson</div>
          </div>
        : null}

      
         {this.props.myCourse ?
           <EditLesson ref={this.child} reload={() => this.loadLesson(this.state.course_id, this.state.lesson_num)} course_id={this.state.course_id} lesson_num={this.state.lesson_num}/>
         : null }

      </div>
    )
  }
}

