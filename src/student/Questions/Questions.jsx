import React from 'react'
import { NavLink } from 'react-router-dom'

import Question from './Question.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

export default class Questions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'new': [], 'hot': [],
      'search_mode': false, 'search_query': '', 'search_result': []
    }
    this.child = React.createRef()
    this.loadQuestions = this.loadQuestions.bind(this)
    this.loadQuestionSearch = this.loadQuestionSearch.bind(this)
    this.callQuestion = this.callQuestion.bind(this)
    this.inputOnChange = this.inputOnChange.bind(this)
    this.inputKeyDown = this.inputKeyDown.bind(this)
    this.back =  this.back.bind(this)
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

  loadQuestionSearch() {
    fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'search_query': this.state.search_query })
    }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          this.setState({ 'search_result': result.search_result }, () => console.log(this.state))
          this.setState({ 'search_mode': true })
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

  inputOnChange(event) {
    this.setState({ 'search_query': event.target.value })
  }

  inputKeyDown(event) {
    if (event.key === 'Enter') this.loadQuestionSearch()
  }
  
  back() {
    this.loadQuestions()
    this.setState({ 'search_mode': false, 'search_query': '' })
  }

  render() {
    return (
      <div className="Questions content">
        <input className="search" type='text' placeholder='Search Questions Here!' value={this.state.search_query} onChange={this.inputOnChange} onKeyDown={this.inputKeyDown}/>
        <button className="search" onClick={this.loadQuestionSearch}>Search</button>
        {this.state.search_mode ? 
          <div>
            <h1 className="title"><img src={imgBack} onClick={this.back}/>Search Results</h1>
            <ul className="question-list">
              {this.state.search_result.map(q => 
                <li onClick={() => this.callQuestion(q.question_id)}>
                  <h4>{q.title}</h4>
                  <h6>Ask By: {q.nickname} <span>{new Date(q.create_date).toISOString().split('T')[0]} {new Date(q.create_date).toISOString().split('T')[1].split('.')[0]}</span></h6>
                  {q.solved_by ? <h6 className="solved">Solved</h6> : <h6 className="not-solved">Not Solved</h6> }
                </li>
              )}
            </ul>
          </div>
        : <div>
            <NavLink to='/questions/create' className="option"><div>Ask Questions</div></NavLink>
            <NavLink to='/questions/my' className="option"><div>My Questions</div></NavLink>
            <NavLink to='/questions/collection' className="option"><div>My Collection</div></NavLink>
            <h1 className="title">New</h1>
            <ul className="question-list">
              {this.state.new.map(q => 
                <li onClick={() => this.callQuestion(q.question_id)}>
                  <h4>{q.title}</h4>
                  <h6>Ask By: {q.nickname} <span>{new Date(q.create_date).toISOString().split('T')[0]} {new Date(q.create_date).toISOString().split('T')[1].split('.')[0]}</span></h6>
                  {q.solved_by ? <h6 className="solved">Solved</h6> : <h6 className="not-solved">Not Solved</h6> }
                </li>
              )}
            </ul>
            <h1 className="title">Hotest</h1>
            <ul className="question-list">
              {this.state.hot.map(q => 
                <li onClick={() => this.callQuestion(q.question_id)}>
                  <h4>{q.title}</h4>
                  <h6>Ask By: {q.nickname} <span>{new Date(q.create_date).toISOString().split('T')[0]} {new Date(q.create_date).toISOString().split('T')[1].split('.')[0]}</span></h6>
                  {q.solved_by ? <h6 className="solved">Solved</h6> : <h6 className="not-solved">Not Solved</h6> }
                </li>
              )}
            </ul>
          </div>
          }

        <div style={{textAlign: 'center'}}>--- Bottom ---</div>
        <Question ref={this.child} user_id={this.props.user_id} loadQuestions={this.loadQuestions} userInfoToggle={this.props.userInfoToggle}/>
      </div>
    )
  }
}

