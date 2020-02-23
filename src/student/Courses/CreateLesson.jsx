import React from 'react'

import TextEditor from '../../TextEditor.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

export default class CreateLesson extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'open': false,
    }
    this.openToggle = this.openToggle.bind(this)
    this.createLesson = this.createLesson.bind(this)
  }

  createLesson() {
    let allowed = ['pdf', 'doc', 'docx', 'ppt', 'pptx']
    let title = document.querySelector('#lesson_title').value
    let file = document.querySelector('#lesson_file').files[0]
    let filetype = null
    if (file != undefined) { filetype = document.querySelector('#lesson_file').files[0].name.split('.').pop() }
    let youtube_link = document.querySelector('#youtube_link').value
    let lesson_detail = TextField.document.body.innerHTML

    const form = new FormData()
    form.append('title', title)
    if (allowed.includes(filetype)) { form.append('file', file) }
    form.append('youtube_link', youtube_link)
    form.append('lesson_detail', lesson_detail)

    fetch('/api/lesson?c='+this.props.course_id, {
      method: 'POST',
      body: form
    }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.props.reload()
          this.openToggle()
        })
      }
    })  
  }

  openToggle() {
    document.querySelector('#lesson_title').value = ''
    document.querySelector('#lesson_file').value = ''
    document.querySelector('#youtube_link').value = ''
    TextField.document.body.innerHTML = ''
    this.setState({'open': !this.state.open})
  }

  render() {
    return (
      <div className={this.state.open ? 'CreateLesson open' : 'CreateLesson close'}>
        <div className="header">
          <img className='header-icon' src={imgBack} onClick={this.openToggle}/>
          <span>Create Lesson</span>
        </div>

        <input id='lesson_title' type='text' placeholder='Lesson Title' required maxLength='40'/>
        <input id='youtube_link' type='url' placeholder='Youtube Embed Link'/>
        <input id='lesson_file' type='file' placeholder='Lesson File'/>
        
        <TextEditor/>

        <button style={{display: 'block'}} className='submit' onClick={this.createLesson}>Create</button>
      </div>
    )
  }
}

