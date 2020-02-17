import React from 'react'
import { Link } from 'react-router-dom'

import TextEditor from '../TextEditor.jsx'

export default class CreateQuestions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'success_page': false
    }
    this.output = this.output.bind(this)
  }

  output() {
    let title = document.querySelector('.CreateQuestions > input').value
    let content = TextField.document.body.innerHTML
    if (content !== '', title !== '') {
      fetch('/api/question', { 
        method: 'POST' ,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'create_question': 
          {
            'title': title,
            'content': content
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
      alert('Plase fill in Title and Detail.')
    }
  }

  render() {
    return (
      <div className="CreateQuestions content">
        { this.state.success_page ? 
          <div style={{top: '0', left: '0', position: 'absolute', width: '100%', height: '100vh', background: 'white'}}>
            <div>Success!</div>
            <Link to='/questions'>
              <div>Back to Questions Page</div>
            </Link>
          </div>
        : null }
        <input type='text' placeholder='Question Title' required/>
        <TextEditor/>
        <button className='submit' onClick={this.output}>Ask!</button>
      </div>
    )
  }
}
