import React from 'react'
import TextEditor from '../TextEditor.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

export default class Question extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'open': false, 'answerField': false, 'canAnswer': false,
      'question_id': '', 'title': '', 'creater': '', 'detail': '',
      'answers': []
    }
    this.checkCanAnswer = this.checkCanAnswer.bind(this)
    this.loadQuestion = this.loadQuestion.bind(this)
    this.loadAnswer = this.loadAnswer.bind(this)
    this.openToggle = this.openToggle.bind(this)
    this.answerFieldToggle = this.answerFieldToggle.bind(this)
    this.submitAnswer = this.submitAnswer.bind(this)
  }

  checkCanAnswer(id) {
    fetch('/api/check_can_answer/'+id).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({'canAnswer': result.canAnswer})
        })
      }
    })
  }

  loadAnswer(id) {
    fetch('/api/answers/'+id).then(res => {
      if (res.ok) {
        res.json().then(result => {
          this.setState({'answers': result.answers})
        })
      }
    })
  }

  loadQuestion(id) {
    fetch('/api/question/'+id).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result.question)
          this.setState({ 
            'answerField': false,
            'question_id': result.question.question_id,
            'title': result.question.title, 
            'creater': result.question.nickname,
            'detail': result.question.detail
          })
        })
      }
    })
  }

  submitAnswer() {
    let answer = TextField.document.body.innerHTML
    console.log(answer)
    fetch('/api/submit_answer',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'submit_answer': 
        {
          'question': this.state.question_id,
          'answer': answer
        }
      })
    }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.checkCanAnswer(this.state.question_id)
        })
      }
    })
  }

  openToggle() {
    this.setState({ 'open': !this.state.open })
  }
  
  answerFieldToggle() {
    this.setState({ 'answerField': !this.state.answerField })
  }
  
  render() {
    let imgLink = window.location.origin + "/static/images/"
    return (
      <div className={this.state.open ? 'Question open' : 'Question close'}>
        <div className="header">
          <img className='header-icon' src={imgBack} onClick={this.openToggle}/>
        </div>
        
        <div className="Question-detail">
          <div>{this.state.title}</div>
          <div>{this.state.creater}</div>
          <div className="question_detail" dangerouslySetInnerHTML={{__html: this.state.detail}}></div>
          <div>Answer</div>

          {this.state.canAnswer ? <div onClick={this.answerFieldToggle}>I want to answer!</div> : null}
          {this.state.answerField ? <div><TextEditor/><button onClick={this.submitAnswer}>Submit</button></div> : null}

          {this.state.answers.map(a => 
            <div>
              <div dangerouslySetInnerHTML={{__html: a.answer}}></div>
              <div>{a.nickname}</div>
              <div>{a.create_date}</div>
              {this.props.user_id === a.creater ? <div>change</div> : null}
            </div>
          )}
        </div>

      </div>
    )
  }
}

