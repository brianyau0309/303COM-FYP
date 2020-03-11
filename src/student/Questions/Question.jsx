import React from 'react'
import { Link } from 'react-router-dom'

import EditAnswer from './EditAnswer.jsx'
import TextEditor from '../../TextEditor.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

export default class Question extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'open': false, 'answerField': false, 'deleteQuestion': false,
      'canAnswer': false, 'myQuestion': false, 'isCollection': false,
      'question_id': '', 'title': '', 'create_by': '', 'nickname': '', 'detail': '', 'solved_by': 0,
      'answers': []
    }
    this.child = React.createRef()
    this.checkCanAnswer = this.checkCanAnswer.bind(this)
    this.checkMyQuestion = this.checkMyQuestion.bind(this)
    this.checkIsCollection = this.checkIsCollection.bind(this)
    this.loadQuestion = this.loadQuestion.bind(this)
    this.loadAnswers = this.loadAnswers.bind(this)
    this.deleteQuestion = this.deleteQuestion.bind(this)
    this.solveQuestion = this.solveQuestion.bind(this)
    this.collectionToggle = this.collectionToggle.bind(this)
    this.submitAnswer = this.submitAnswer.bind(this)
    this.editAnswer = this.editAnswer.bind(this)
    this.deleteAnswer = this.deleteAnswer.bind(this)
    this.likeAnswer = this.likeAnswer.bind(this)
    this.reload = this.reload.bind(this)
    this.openToggle = this.openToggle.bind(this)
    this.openTrue = this.openTrue.bind(this)
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

  checkMyQuestion(id) {
    fetch('/api/my_questions?q='+id).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 'myQuestion': result.myQuestion }, () => console.log(this.state))
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

  loadQuestion(id) {
    fetch('/api/question?q='+id).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result.question)
          this.setState({ 
            'answerField': false,
            'deleteQuestion': false,
            'question_id': result.question.question_id,
            'title': result.question.title, 
            'create_by': result.question.create_by,
            'nickname': result.question.nickname,
            'detail': result.question.detail,
            'create_date': result.question.create_date,
            'solved_by': result.question.solved_by
          })
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

  deleteQuestion() {
    fetch('/api/question?q='+this.state.question_id, { method: 'PATCH' }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 'deleteQuestion': true })
          this.props.loadQuestions()
        })
      }
    })
  }

  solveQuestion(user_id) {
    console.log(user_id)
    fetch('/api/solve_question', { 
      method: 'DELETE',
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'solve_question': 
        { 
          'question': this.state.question_id,
          'solved_by': user_id
        }
      })
    }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.loadQuestion(this.state.question_id)
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
          this.props.loadQuestions()
        })
      }
    })
  }

  submitAnswer() {
    let answer = QuestionComment.document.body.innerHTML
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
          this.reload()
        })
      }
    })
  }

  editAnswer(a) {
    this.child.current.loadAnswer(a)
    this.child.current.openToggle()
    document.querySelector('.Question').scrollTo(0,0)
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
        res.json().then(result => {
          console.log(result)
          this.reload()
        })
      }
    })
  }

  likeAnswer(create_by, m) {
    fetch('/api/answer_likes?q='+this.state.question_id+'&c='+create_by, { method: m }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.loadAnswers(this.state.question_id)
        })
      }
    })
  }

  reload() {
    this.checkCanAnswer(this.state.question_id)
    this.loadAnswers(this.state.question_id)
  }

  openToggle() {
    this.setState({ 'open': !this.state.open })
  }
  
  openTrue() {
    this.setState({ 'open': true })
    if (this.child.current) this.child.current.openFalse()
  }
  
  answerFieldToggle() {
    this.setState({ 'answerField': !this.state.answerField })
  }
  
  render() {
    let imgLink = window.location.origin + "/static/images/"
    return (
      <div className={this.state.open ? 'Question open' : 'Question close'}>
        { this.state.deleteQuestion ? 
          <div className="success_page">
            <div>Delete Question Success!</div>
            <div className="btn" onClick={this.openToggle}>Back to Questions Page</div>
          </div>
        : null }
        
        <div className="header sticky-top hidden">
          <img className='header-icon' src={imgBack} onClick={this.openToggle}/>
          <span>Question</span>
        </div>
        
        <div className="Question-detail">
          <div className="question-basic">
            <div className="question-title">{this.state.title}</div>
            <div className="create_by" onClick={() => this.props.userInfoToggle(this.state.create_by)}>
              {this.state.nickname} {this.state.create_date ? 
                <span>{new Date(this.state.create_date).toISOString().split('T')[0]} {new Date(this.state.create_date).toISOString().split('T')[1].split('.')[0]}</span>
              : null}
            </div>
          </div>
          <div className="question-detail" dangerouslySetInnerHTML={{__html: this.state.detail}}></div>

          {this.state.myQuestion ? 
            <div className="delete" onClick={this.deleteQuestion}>Delete Question</div>
          : null}

          {this.state.isCollection ? 
             <div className="collection remove" onClick={() => this.collectionToggle(this.state.question_id, 'DELETE')}>Remove from Collection</div>
          :  <div className="collection add" onClick={() => this.collectionToggle(this.state.question_id, 'POST')}>Add to Collection</div> }

          <h3 className="question-header">Answer</h3>

          {this.state.solved_by !== null ?
            this.state.answers.map(a => {
              if (a.create_by === this.state.solved_by) {
                return(
                  <div>
                    <div className="best-answer-header">Best Answer</div>

                    <div className="answer-basic create_by" onClick={() => this.props.userInfoToggle(a.create_by)}>
                      {a.nickname} {a.create_date ? 
                        <span>{new Date(this.state.create_date).toISOString().split('T')[0]} {new Date(this.state.create_date).toISOString().split('T')[1].split('.')[0]}</span>
                      : null}
                    </div>
                    <div className="answer-detail"dangerouslySetInnerHTML={{__html: a.answer}}></div>
                    { a.user_liked ? 
                      <div className="collection remove" onClick={() => this.likeAnswer(a.create_by, 'DELETE')}>Unlike (Like: {a.likes ? a.likes : 0})</div>
                    : <div className="collection add" onClick={() => this.likeAnswer(a.create_by, 'POST')}>Like (Like: {a.likes ? a.likes : 0})</div>}
                  </div>
                )
              }
            })
          : null}
          
          {this.state.solved_by !== null && this.state.myQuestion ? 
            <div className="delete cancel" onClick={() => this.solveQuestion(0)}>Cancel Solved</div>
          : null}

          {this.state.canAnswer ? 
            <div className="question-header">
              <div onClick={this.answerFieldToggle}>I want to answer!</div> 
              {this.state.answerField ? 
                <div>
                  <TextEditor editor='QuestionComment'/>
                  <button onClick={this.submitAnswer}>Submit</button>
                </div> 
              : null}
            </div>
           : null}

           {this.state.answers.map(a => {
             if (a.create_by !== this.state.solved_by) {
               return(
                 <div>
                    <div className="answer-basic create_by" onClick={() => this.props.userInfoToggle(a.create_by)}>
                      {a.nickname} {a.create_date ? 
                        <span>{new Date(this.state.create_date).toISOString().split('T')[0]} {new Date(this.state.create_date).toISOString().split('T')[1].split('.')[0]}</span>
                      : null}
                    </div>
                    <div className="answer-detail"dangerouslySetInnerHTML={{__html: a.answer}}></div>
                    { a.user_liked ? 
                      <div className="collection remove" onClick={() => this.likeAnswer(a.create_by, 'DELETE')}>Unlike (Like: {a.likes ? a.likes : 0})</div>
                    : <div className="collection add" onClick={() => this.likeAnswer(a.create_by, 'POST')}>Like (Like: {a.likes ? a.likes : 0})</div>}
                   {this.props.user_id === a.create_by ? 
                     <div>
                       <div className="delete cancel" onClick={() => this.editAnswer(a.answer)}>Edit</div>
                       <div className="delete" onClick={this.deleteAnswer}>Delete</div>
                     </div>
                   : null}
                   {(this.state.solved_by === 0 || this.state.solved_by === null) && this.state.myQuestion ? 
                     <div className="collection add" onClick={() => this.solveQuestion(a.create_by)}>This Answer Solve My Question!</div>
                   : null}
                 </div>
               )
             }
           })}
        </div>

        <EditAnswer ref={this.child} question_id={this.state.question_id} reload={this.reload}/>
      </div>
    )
  }
}

