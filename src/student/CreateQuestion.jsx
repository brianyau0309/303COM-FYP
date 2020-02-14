import React from 'react'
import TextEditor from '../TextEditor.jsx'

export default class CreateQuestions extends React.Component {
  constructor(props) {
    super(props)
    this.stats = {}
    this.output = this.output.bind(this)
  }

  output() {
    let title = document.querySelector('.CreateQuestions > input').value
    let content = TextField.document.body.innerHTML
    if (content !== '', title !== '') {
      fetch('/api/create_question', { 
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
        <input type='text' placeholder='Question Title' required/>
        <TextEditor/>
        <button className='submit' onClick={this.output}>Ask!</button>
      </div>
    )
  }
}
