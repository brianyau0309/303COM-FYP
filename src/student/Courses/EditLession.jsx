import React from 'react'

import TextEditor from '../../TextEditor.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

export default class EditLesson extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'open': false,
      'filename': 'No File',
    }
    this.openToggle = this.openToggle.bind(this)
    this.editLesson = this.editLesson.bind(this)
  }

  loadLesson(t,f,v,d) {
    document.querySelector('#edited_lesson_title').value = t
    document.querySelector('#edited_lesson_file').value = ''
    document.querySelector('#edited_youtube_link').value = v
    document.querySelector('#delete_file_check').checked = false
    window.frames['EditLesson'].document.body.innerHTML = d
    this.setState({ 'filename': f })
  }

  editLesson() {
    let allowed = ['pdf', 'doc', 'docx', 'ppt', 'pptx']
    let title = document.querySelector('#edited_lesson_title').value
    let file = document.querySelector('#edited_lesson_file').files[0]
    let filetype = null
    if (file!= undefined) { filetype = document.querySelector('#edited_lesson_file').files[0].name.split('.').pop() }
    let youtube_link = document.querySelector('#edited_youtube_link').value
    let lesson_detail = window.frames['EditLesson'].document.body.innerHTML
    let delete_file = false
    if (document.querySelector('#delete_file_check').checked === true) { delete_file = true }
    console.log(delete_file)

    const form = new FormData()
    form.append('title', title)
    if (allowed.includes(filetype)) { form.append('file', file) }
    form.append('delete_file', delete_file)
    form.append('youtube_link', youtube_link)
    form.append('lesson_detail', lesson_detail)

    fetch('/api/lesson?c='+this.props.course_id+'&l='+this.props.lesson_num, {
      method: 'PUT',
      body: form
    }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.openToggle()
          this.props.reload()
        })
      }
    })
  }

  openToggle() {
    this.setState({'open': !this.state.open})
  }

  render() {
    return (
      <div className={this.state.open ? 'EditLesson open' : 'EditLesson close'}>
        <div className="header">
          <img className='header-icon' src={imgBack} onClick={this.openToggle}/>
          <span>Edit Lesson</span>
        </div>

        <input id='edited_lesson_title' type='text' placeholder='Lesson Title' required maxLength='40'/>
        <input id='edited_youtube_link' type='url' placeholder='Youtube Embed Link'/>
        <div>{this.state.filename}</div>
        <input id='edited_lesson_file' type='file' placeholder='Lesson File'/>

        <label>
          Delete File
          <input id='delete_file_check' type="checkbox"/>
        </label>
        
        <TextEditor editor='EditLesson'/>

        <button style={{display: 'block'}} className='submit' onClick={this.editLesson}>Edit</button>
      </div>
    )
  }
}

