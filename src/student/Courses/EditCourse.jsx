import React from 'react'

import TextEditor from '../../TextEditor.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

export default class EditCourse extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'open': false,
      'editedTitle': '',
      'tags': []
    }
    this.loadCourse = this.loadCourse.bind(this)
    this.submitEditedCourse = this.submitEditedCourse.bind(this)
    this.newTag = this.newTag.bind(this)
    this.popTag = this.popTag.bind(this)
    this.tagInputOnChange = this.tagInputOnChange.bind(this)
    this.titleOnChange = this.titleOnChange.bind(this)
    this.openToggle = this.openToggle.bind(this)
  }

  loadCourse(title, tags, d) {
    this.setState({ 'editedTitle': title, 'tags': tags })
    window.frames['EditCourse'].document.body.innerHTML = d
  } 

  submitEditedCourse() {
    let editedDescription = window.frames['EditCourse'].document.body.innerHTML
    fetch('/api/course', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'submit_edited_course': 
        {
          'course': this.props.course_id,
          'edited_title': this.state.editedTitle,
          'edited_description': editedDescription,
          'edited_tags': this.state.tags
        }
      })
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

  newTag() {
    if (this.state.tags.length < 10) {
      let newTags = this.state.tags
      newTags.push('')
      this.setState({ 'tags': newTags })
    }
  }

  popTag(i) {
    if (this.state.tags.length > 1) {
      let newTags = this.state.tags
      newTags.splice(i, 1)
      this.setState({ 'tags': newTags })
    }
  }

  tagInputOnChange(v, i) {
    let newTags = this.state.tags
    newTags[i] = v
    this.setState({ 'tag': newTags }, () => console.log(this.state.tags))
  }

  titleOnChange(e) {
    console.log(e.target.value)
    this.setState({ 'editedTitle': e.target.value })
  }
  
  openToggle() {
    this.setState({'open': !this.state.open})
  }
  
  render() {
    return (
      <div className={this.state.open ? 'EditCourse open' : 'EditCourse close'}>
        <div className="header">
          <img className='header-icon' src={imgBack} onClick={this.openToggle}/>
          <span>Edit Course</span>
        </div>
        
        <input type="text" value={this.state.editedTitle} onChange={this.titleOnChange}/>
        
        <TextEditor editor='EditCourse'/>

        <div>Courses Tags <img onClick={this.newTag} src="https://img.icons8.com/flat_round/64/000000/plus.png"/></div>
        <ul>
          { this.state.tags.map((t, index) => 
            <li>
              <input type='text' className='tag-input' value={t} maxLength='15' onChange={e => this.tagInputOnChange(e.target.value, index)}/>

              { index !== 0 ? <img src="https://img.icons8.com/flat_round/64/000000/minus.png" onClick={() => this.popTag(index)}/> : null }
            </li>
          ) }
        </ul>
        <button onClick={this.submitEditedCourse}>Submit Edited Course</button>
      </div>
    )
  }
}

