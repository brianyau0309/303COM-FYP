import React from 'react'

import EditAnswer from './EditAnswer.jsx'
import TextEditor from '../TextEditor.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

export default class Question extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'open': false, 'answerField': false,
      'canAnswer': false, 'isCollection': false,
      'question_id': '', 'title': '', 'creater': '', 'detail': '',
      'answers': []
    }
    this.child = React.createRef()
    this.checkCanAnswer = this.checkCanAnswer.bind(this)
    this.loadAnswers = this.loadAnswers.bind(this)
    this.loadQuestion = this.loadQuestion.bind(this)
    this.checkIsCollection = this.checkIsCollection.bind(this)
    this.collectionToggle = this.collectionToggle.bind(this)
    this.submitAnswer = this.submitAnswer.bind(this)
    this.editAnswer = this.editAnswer.bind(this)
    this.deleteAnswer = this.deleteAnswer.bind(this)
    this.openToggle = this.openToggle.bind(this)
    this.answerFieldToggle = this.answerFieldToggle.bind(this)
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

  loadAnswers(id) {
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

  checkIsCollection(id) {
    fetch('/api/question_collection?q='+id).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 'isCollection': result.isCollection }, () => console.log(this.state))
        })
      }
    })
  }

  collectionToggle(id, m) {
    fetch('/api/question_collection?q='+id, {method: m}).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.checkIsCollection(this.state.question_id)
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

  editAnswer(a) {
    this.child.current.loadAnswer(a)
    this.child.current.openToggle()
  }

  deleteAnswer() {
    fetch('/api/submit_answer', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'delete_answer': 
        {
          'question': this.state.question_id
        }
      })
    }).then(res => {
      if (res.ok) {
        res.json().then(result => {console.log(result)})
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
          <span>Question</span>
        </div>
        
        <div className="Question-detail">
          <div>{this.state.title}</div>
          <div>{this.state.creater}</div>
          <div className="question_detail" dangerouslySetInnerHTML={{__html: this.state.detail}}></div>
          
          {this.state.isCollection ? 
             <div onClick={() => this.collectionToggle(this.state.question_id, 'DELETE')}>Remove from Collection</div>
          :  <div onClick={() => this.collectionToggle(this.state.question_id, 'POST')}>Add to Collection</div>
          }

          <h3>Answer</h3>

          {this.state.canAnswer ? 
            <div onClick={this.answerFieldToggle}>I want to answer!</div> 
           : null}
          
          {this.state.answerField ? 
            <div>
              <TextEditor/>
              <button onClick={this.submitAnswer}>Submit</button>
            </div> 
           : null}

          {this.state.answers.map(a => 
            <div>
              <div dangerouslySetInnerHTML={{__html: a.answer}}></div>
              <div>{a.nickname}</div>
              <div>{a.create_date}</div>
              {this.props.user_id === a.creater ? 
                <div>
                  <div onClick={() => this.editAnswer(a.answer)}>Edit</div>
                  <div onClick={this.deleteAnswer}>Delete</div>
                </div>
               : null}
            </div>)}

        </div>

        <EditAnswer ref={this.child} question_id={this.state.question_id}/>

      </div>
    )
  }
}

