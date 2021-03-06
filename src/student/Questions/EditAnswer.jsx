import React from 'react'

import TextEditor from '../../TextEditor.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

export default class EditAnswer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'open': false
    }
    this.openToggle = this.openToggle.bind(this)
    this.loadAnswer = this.loadAnswer.bind(this)
    this.submitEditedAnswer = this.submitEditedAnswer.bind(this)
    this.openFalse = this.openFalse.bind(this)
  }

  loadAnswer(a) {
    window.frames['EditAnswer'].document.body.innerHTML = a
  } 

  submitEditedAnswer() {
    let editedAnswer = window.frames['EditAnswer'].document.body.innerHTML
    fetch('/api/submit_answer', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'submit_edited_answer': 
        {
          'question': this.props.question_id,
          'edited_answer': editedAnswer
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

  openToggle() {
    this.setState({'open': !this.state.open})
  }

  openFalse() {
    this.setState({'open': false})
  }
  
  render() {
    return (
      <div className={this.state.open ? 'EditAnswer open' : 'EditAnswer close'}>
        <div className="header">
          <img className='header-icon' src={imgBack} onClick={this.openToggle}/>
          <span>Edit Answer</span>
        </div>
        <TextEditor editor='EditAnswer'/>
        <button className="submit" onClick={this.submitEditedAnswer}>Submit Edited Answer</button>
      </div>
    )
  }
}


