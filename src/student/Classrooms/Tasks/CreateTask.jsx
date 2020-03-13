import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import DayPickerInput from 'react-day-picker/DayPickerInput'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'
let MCQ_format = { 'type': 'MC', 'question': '', 'answer': 1, 'choice': ['','','',''], 'category': ''}
let SQ_format = { 'type': 'SQ', 'question': '', 'answer': '', 'choice': [], 'category': ''}

class CreateTask extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'permission': false,
      'success_page': false,
      'title': '', 'questions': [], 'deadline': undefined
    }
    this.checkPermission = this.checkPermission.bind(this)
    this.create_task = this.create_task.bind(this)
    this.titleOnChange = this.titleOnChange.bind(this)
    this.deadlineOnChange = this.deadlineOnChange.bind(this)
    this.newMCQ = this.newMCQ.bind(this)
    this.newSQ = this.newSQ.bind(this)
    this.popQuestion = this.popQuestion.bind(this)
    this.categoryInputOnChange = this.categoryInputOnChange.bind(this)
    this.answerInputOnChange = this.answerInputOnChange.bind(this)
    this.choiceInputOnChange = this.choiceInputOnChange.bind(this)
    this.textareaOnChange = this.textareaOnChange.bind(this)
    this.answerInputOnChange = this.answerInputOnChange.bind(this)
    this.addChoice = this.addChoice.bind(this)
    this.popChoice = this.popChoice.bind(this)
  }

  componentDidMount() {
    this.checkPermission()
  }

  checkPermission() {
    fetch('/api/classroom_member?c='+this.props.match.params.class).then(res => {
      if (res.ok) {
        res.json().then(result => {
          if (result.member) {
            this.setState({ 'permission': true })
          } else {
            try {
              this.props.history.goBack()
            } catch(err) {
              window.history.back()
            }
          }
        })
      }
    })
  }

  create_task() {
    let questions = this.state.questions.slice(), fail = false
    questions.forEach(q => {
      if (q.question === '' || q.answer === '' || q.choice.includes('')) {
        fail = true
      }
    })
    if (this.state.title !== '' && this.state.deadline !== undefined && questions.length > 0 && !fail) {
      if (new Date(this.state.deadline.toDateString()) > new Date()) {
        fetch('/api/task?c='+this.props.match.params.class, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 'task': {
            'title': this.state.title,
            'deadline': this.state.deadline,
            'questions': this.state.questions
          }})
        }).then(res => {
          if (res.ok) {
            res.json().then(result => {
              console.log(result)
              this.setState({'success_page': true})
              document.querySelector('.CreateTask').scrollTop = 0
            })
          }
        })
      } else {
        alert('Invaild Date of Deadline')
      }
    } else {
      alert('Please fill in all the blank and at least one question')
    }
  }

  titleOnChange(e) {
    this.setState({'title': e.target.value})  
  }

  deadlineOnChange(day) {
    this.setState({'deadline': day})
  }

  newMCQ() {
    let temp = this.state.questions.slice()
    let MCQ = JSON.parse(JSON.stringify(MCQ_format))
    temp.push(MCQ)
    this.setState({'questions': temp})
  }

  newSQ() {
    let temp = this.state.questions.slice()
    let SQ = JSON.parse(JSON.stringify(SQ_format))
    temp.push(SQ)
    this.setState({'questions': temp})
  }

  popQuestion(question_index) {
    let temp = this.state.questions.slice()
    temp.splice(question_index, 1)
    this.setState({'questions': temp})
  }

  categoryInputOnChange(value, question_index) {
    let temp = this.state.questions.slice()
    temp[question_index].category = value
    this.setState({ 'questions': temp })
  }

  choiceInputOnChange(value, question_index, choice_index) {
    let temp = this.state.questions.slice()
    temp[question_index].choice[choice_index] = value
    this.setState({ 'questions': temp })
  }

  answerInputOnChange(value, question_index) {
    let temp = this.state.questions.slice()
    temp[question_index].answer = value
    this.setState({ 'questions': temp })
  }

  textareaOnChange(value, question_index) {
    let temp = this.state.questions.slice()
    temp[question_index].question = value
    this.setState({ 'questions': temp })
  }

  mcAnswerToggle(question_index, answer) {
    let temp = this.state.questions.slice()
    temp[question_index].answer = answer
    this.setState({ 'questions': temp })
  }

  addChoice(question_index) {
    let temp = this.state.questions.slice()
    temp[question_index].choice.push('')
    this.setState({ 'questions': temp })
  }

  popChoice(question_index, choice_index) {
    let temp = this.state.questions.slice()
    temp[question_index].choice.splice(choice_index, 1)
    this.setState({ 'questions': temp })
  }

  render() {
    const { deadline } = this.state
    return (
      <div className="CreateTask content part">
        <div className="header sticky-top">
          <img className='header-icon' src={imgBack} onClick={this.props.history.goBack}/>
          <span>Create Task</span>
        </div>
        {this.state.permission ? 
          <div>
            {this.state.success_page ? 
              <div className="success_page">
                <div>Success!</div>
                <Link to={`/classrooms/${this.props.match.params.class}`}>
                  <div className="btn">Back to Classroom</div>
                </Link>
              </div>
            : 
            <div>
              <div className="block">
                <input maxLength='50' type="text" value={this.state.title} onChange={this.titleOnChange} placeholder='Task Title'/>
                <DayPickerInput onDayChange={this.deadlineOnChange} placeholder="Deadline" inputProps={{readOnly: true}} Format='YYYY-MM-DD'/>
              </div>

              <div className="block title">Questions</div>
              {this.state.questions.map((q, qi) => 
                <div className="block question">
                  <div className="type">
                    {q.type === 'MC' ? 'MC Question' : 'Short Question'}
                    <span className="delete" onClick={() => this.popQuestion(qi)}>Delete</span>
                  </div>
                  
                  <textarea placeholder="Type in your Question Here..." value={q.question} onChange={e => this.textareaOnChange(e.target.value, qi)}/>
                  <input maxLength='30' className="category" type="text" value={q.category} onChange={e => this.categoryInputOnChange(e.target.value, qi)} placeholder='Question Cateory (Optional)'/>

                  <ul>
                    { q.type === 'MC' && q.choice.length < 4 ? 
                      <div>New Choice<img onClick={() => this.addChoice(qi)} src="https://img.icons8.com/flat_round/64/000000/plus.png"/></div>
                    : null }

                    { q.type == 'MC' ? 
                      q.choice.map((c, ci) =>
                        <li>{ci+1}.&nbsp; 
                          <input maxLength='30' type="text" value={c} onChange={e => this.choiceInputOnChange(e.target.value, qi, ci)} placeholder="Multiple Choice"/>
                          <span className={ci+1 === q.answer ? 'task_answer_toggle yes' : 'task_answer_toggle no'} onClick={() => this.mcAnswerToggle(qi, ci+1)}>Ans.</span>
                          { q.choice.length > 2 ? <img src="https://img.icons8.com/flat_round/64/000000/minus.png" onClick={() => this.popChoice(qi, ci)}/> : null }
                        </li>
                      ) 
                    :
                      <li>Answer: <input maxLength='30' type="text" value={q.answer} onChange={e => this.answerInputOnChange(e.target.value, qi)} /></li>}
                  </ul>

                </div>
              )}

              <div className="block flex">
                <div onClick={this.newMCQ}>New MC Question</div>
                <div onClick={this.newSQ}>New Short Question</div>
              </div>

              <div className="sticky-bottom">
                <button className="submit" onClick={this.create_task}>Create Task</button>
              </div>
            </div> }
          </div>
        : <div>Please Wait...</div>}
      </div>
    )
  }
}

export default withRouter(CreateTask)
