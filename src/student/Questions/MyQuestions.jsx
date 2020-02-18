import React from 'react'
import { NavLink } from 'react-router-dom'

import Question from './Question.jsx'

export default class MyQuestions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'my_questions': []
    }
    this.loadMyQuestions = this.loadMyQuestions.bind(this)
    this.callQuestion = this.callQuestion.bind(this)
    this.child = React.createRef()
  }
  
  componentDidMount() {
    this.loadMyQuestions()
  }

  loadMyQuestions() {
    fetch('/api/my_questions').then(res => {
      if (res.ok) {
        res.json().then(result => {
          this.setState({ 'my_questions': result.my_questions }, () => console.log(this.state))
        })
      }
    })
  }

  callQuestion(id) {
    this.child.current.loadQuestion(id)
    this.child.current.loadAnswers(id)
    this.child.current.checkCanAnswer(id)
    this.child.current.checkMyQuestion(id)
    this.child.current.checkIsCollection(id)
    this.child.current.openToggle()
  }

  render() {
    return (
      <div className="MyQuestions content">
        <ul className="question-list">
          {this.state.my_questions.map(q => 
            <li onClick={() => this.callQuestion(q.question_id)}>
              <h4>{q.title}</h4>
              <h6>{q.nickname}</h6>
              <h6>{q.create_date}</h6>
            </li>
          )}
        </ul>
        <div style={{textAlign: 'center'}}>--- Bottom ---</div>
        <Question ref={this.child} user_id={this.props.user_id} loadQuestions={this.loadMyQuestions}/>
      </div>
    )
  }
}

