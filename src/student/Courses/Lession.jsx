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
    this.openFalse = this.openFalse.bind(this)
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
    document.querySelector('.Lesson').style.overflowY = 'hidden'
  }

  deleteLesson() {
    fetch('/api/lesson?c='+this.state.course_id+'&l='+this.state.lesson_num, { method: 'DELETE' }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 'deleteLesson': true })
          this.props.loadLessons()
          document.querySelector('.Lesson').scrollTo(0,0)
          document.querySelector('.Lesson').style.overflowY = 'hidden'
        })
      }
    })
  }

  openToggle() {
    this.setState({ 'open': !this.state.open })
   document.querySelector('.Course').style.overflowY = 'scroll'
  }

  openFalse() {
    this.setState({'open': false})
    if (this.child.current) this.child.current.openFalse()
  }

  render() {
    return(
      <div className={this.state.open ? 'Lesson open' : 'Lesson close'}>
        { this.state.deleteLesson ? 
          <div className="success_page">
            <div>Delete Lesson Success!</div>
            <div className="btn" onClick={this.openToggle}>Back to Course Page</div>
          </div>
        : null }

        <div className="header sticky-top">
          <img className='header-icon' src={imgBack} onClick={this.openToggle}/>
          <span>Lession</span>
        </div>
        
        <div className="Lesson-detail">
          <div className="lesson_title block">{this.state.title}</div>
          {this.props.myCourse ? 
            <div className="flex">
              <div className="edit" onClick={() => this.editLesson(this.state.title, this.state.filename, this.state.video_link, this.state.detail)}>Edit Lesson</div>
              <div className="delete" onClick={this.deleteLesson}>Delete Lesson</div>
            </div>
          : null}
          {this.state.video_link != '' && this.state.video_link ? 
            <iframe className="video" src={this.state.video_link} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          : null}
          {this.state.filename != null ? 
            <div className="block download">
              <span>{this.state.filename}</span>
              <a href={window.location.origin+'/static/files/'+this.state.course_id+'_'+this.state.lesson_num+'.'+this.state.filename.split('.').pop()} Download={this.state.filename}>Download</a>
            </div>
          : null}
          <div className="lesson_detail" dangerouslySetInnerHTML={{__html: this.state.detail}}></div>
        </div>

      
         {this.props.myCourse ?
           <EditLesson ref={this.child} reloadCoruse={this.props.reload} reload={() => this.loadLesson(this.state.course_id, this.state.lesson_num)} course_id={this.state.course_id} lesson_num={this.state.lesson_num}/>
         : null }

      </div>
    )
  }
}

