import React from 'react'
import { NavLink } from 'react-router-dom'

import Question from './Question.jsx'

export default class QuestionCollection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'question_collection': []
    }
    this.loadQuestionCollection = this.loadQuestionCollection.bind(this)
    this.callQuestion = this.callQuestion.bind(this)
    this.child = React.createRef()
  }
  
  componentDidMount() {
    this.loadQuestionCollection()
  }

  loadQuestionCollection() {
    fetch('/api/question_collection').then(res => {
      if (res.ok) {
        res.json().then(result => {
          this.setState({ 'question_collection': result.question_collection }, () => console.log(this.state))
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
      <div className="QuestionCollection content">
        <ul className="question-list">
          {this.state.question_collection.map(q => 
            <li onClick={() => this.callQuestion(q.question_id)}>
              <h4>{q.title}</h4>
              <h6>Ask By: {q.nickname} <span>{new Date(q.create_date).toISOString().split('T')[0]} {new Date(q.create_date).toISOString().split('T')[1].split('.')[0]}</span></h6>
              {q.solved_by ? <h6 className="solved">Solved</h6> : <h6 className="not-solved">Not Solved</h6> }
            </li>
          )}
        </ul>
        <div style={{textAlign: 'center'}}>--- Bottom ---</div>
        <Question ref={this.child} user_id={this.props.user_id} loadQuestions={this.loadQuestionCollection} userInfoToggle={this.props.userInfoToggle}/>
      </div>
    )
  }
}

