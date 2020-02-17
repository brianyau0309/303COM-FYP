import React from 'react'
import { NavLink } from 'react-router-dom'

import Question from './Question.jsx'

export default class Questions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'new': [],
      'hot': []
    }
    this.loadQuestions = this.loadQuestions.bind(this)
    this.callQuestion = this.callQuestion.bind(this)
    this.child = React.createRef()
  }
  
  componentDidMount() {
    this.loadQuestions()
  }

  loadQuestions() {
    fetch('/api/questions').then(res => {
      if (res.ok) {
        res.json().then(result => {
          this.setState({ 
            'new': result.questions.new,
            'hot': result.questions.hot
          }, () => console.log(this.state))
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
      <div className="Questions content">
        <input type='text' placeholder='Search Questions Here!'/>
        <NavLink to='/questions/create'><div>Ask Questions</div></NavLink>
        <NavLink to='/questions/my'><div>My Questions</div></NavLink>
        <NavLink to='/questions/collection'><div>My Collection</div></NavLink>
        <h3>New</h3>
        <ul className="question-list">
          {this.state.new.map(q => 
            <li onClick={() => this.callQuestion(q.question_id)}>
              <h4>{q.title}</h4>
              <h6>{q.nickname}</h6>
              <h6>{q.create_date}</h6>
              <h6>{q.solve}</h6>
            </li>
          )}
        </ul>
        <h3>Hotest</h3>
        <ul className="question-list">
          {this.state.hot.map(q => 
            <li onClick={() => this.callQuestion(q.question_id)}>
              <h4>{q.title}</h4>
              <h6>{q.nickname}</h6>
              <h6>{q.create_date}</h6>
              <h6>{q.solve}</h6>
            </li>
          )}
        </ul>

        <Question ref={this.child} user_id={this.props.user_id} loadQuestions={this.loadQuestions}/>
      </div>
    )
  }
}

