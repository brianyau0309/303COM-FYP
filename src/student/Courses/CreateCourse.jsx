import React from 'react'
import { Link } from 'react-router-dom'

import TextEditor from '../../TextEditor.jsx'

export default class CreateCourse extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'success_page': false,
      'tags': [''],
    }
    this.output = this.output.bind(this)
    this.newTag = this.newTag.bind(this)
    this.popTag = this.popTag.bind(this)
    this.tagInputOnChange = this.tagInputOnChange.bind(this)
  }

  output() {
    let title = document.querySelector('.CreateCourses > input').value
    let description = window.frames['CreateCourse'].document.body.innerHTML
    if (description !== '' && title !== '' && !this.state.tags.includes('')) {
      fetch('/api/course', { 
        method: 'POST' ,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'create_course': 
          {
            'title': title,
            'description': description,
            'tags': this.state.tags
          } 
        })
      }).then(res => {
        if (res.ok) {
          res.json().then(result => {
            console.log(result)
            this.setState({'success_page': true})
          })
        }
      })  
    } else {
      alert('Plase fill in Title, Detail and Tag(s).')
    }
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

  render() {
    return (
      <div className="CreateCourses content">
        { this.state.success_page ? 
          <div className="success_page create">
            <div>Success!</div>
            <Link to='/courses'>
              <div>Back to Courses Page</div>
            </Link>
          </div>
        : null }
        <input type='text' placeholder='Courses Title' required maxLength='40'/>
        <div style={{fontSize: '2.5vh', width: '95%', margin: 'auto'}}>Course Description:</div>        
        <TextEditor editor='CreateCourse'/>

        <div>Courses Tags <img className="add" onClick={this.newTag} src="https://img.icons8.com/flat_round/64/000000/plus.png"/></div>
        <ol>
          { this.state.tags.map((t, index) => 
            <li>
              <input type='text' className='tag-input' value={t} maxLength='15' onChange={e => this.tagInputOnChange(e.target.value, index)}/>

              { index !== 0 ? <img className="minus" src="https://img.icons8.com/flat_round/64/000000/minus.png" onClick={() => this.popTag(index)}/> : null }
            </li>
          ) }
        </ol>

        <button style={{display: 'block'}} className='submit' onClick={this.output}>Create</button>
      </div>
    )
  }
}

