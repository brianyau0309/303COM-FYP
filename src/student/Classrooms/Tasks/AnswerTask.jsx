import React from 'react'
import { Link, withRouter } from 'react-router-dom'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

class AnswerTask extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'questions': [],
      'permission': false, 'success_page': false
    }
    this.checkPermission = this.checkPermission.bind(this)
    this.loadTaskQuestions = this.loadTaskQuestions.bind(this)
    this.answerTask = this.answerTask.bind(this)
    this.answerInputOnChange = this.answerInputOnChange.bind(this)
    this.mcAnswerToggle = this.mcAnswerToggle.bind(this)
  }

  componentDidMount() {
    this.checkPermission()
  }

  checkPermission() {
    fetch('/api/classroom_member?c='+this.props.match.params.class).then(res => {
      if (res.ok) {
        res.json().then(result => {
          if (result.member) {
            this.setState({ 'permission': true }, () => this.loadTaskQuestions())
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

  loadTaskQuestions() {
    if (this.state.permission) {
      fetch('/api/student_task_questions?c='+this.props.match.params.class+'&t='+this.props.match.params.task).then(res => {
        if (res.ok) {
          res.json().then(result => {
            console.log(result)
            if (result.task !== 'Error' && !(new Date() > new Date(result.task.deadline)) && !result.task.force_close) {
              this.setState({
                'questions': result.task.task_questions
              })
            } else {
              this.props.history.goBack()
            }
          })
        }
      })
    }
  }

  answerTask() {
    let questions = this.state.questions.slice(), fail = false
    questions.forEach(q => {
      if (q.answer === '') {
        fail = true
      }
    })
    if (!fail) {
      fetch('/api/task_answers?c='+this.props.match.params.class+'&t='+this.props.match.params.task, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'answer_task': {
          'questions': this.state.questions
        }})
      }).then(res => {
        if (res.ok) {
          res.json().then(result => {
            console.log(result)
            this.setState({'success_page': true})
            document.querySelector('.AnswerTask').scrollTop = 0
          })
        }
      })
    } else {
      alert('Please Answer All the Questions')
    }
  }

  answerInputOnChange(value, question_index) {
    let temp = this.state.questions.slice()
    temp[question_index].answer = value
    this.setState({ 'questions': temp })
  }

  mcAnswerToggle(question_index, answer) {
    let temp = this.state.questions.slice()
    temp[question_index].answer = temp.slice()[question_index].choice[answer]
    this.setState({ 'questions': temp })
  }

  render() {
    return (
      <div className="AnswerTask content part">
        <div className="header">
          <img className='header-icon' src={imgBack} onClick={this.props.history.goBack}/>
          <span>Answer Task</span>
        </div>
        {this.state.permission ? 
          <div>
            { this.state.success_page ? 
              <div className="success_page">
                <div>Success!</div>
                <Link to={this.props.match.url.replace('/answer', '')}>
                  <div className="btn">Back to Task Page</div>
                </Link>
              </div>
            :
            
              <div>
                <div className="block title">Questions</div>
                {this.state.questions.map((q, qi) => 
                  <div className="block answer">
                    <div className="type">Q. {q.question_num}</div>
                    <div><pre style={{fontFamily: 'inherit'}}>{q.question}</pre></div>
                      <ul>
                        {q.type.toUpperCase() == 'MC' ? 
                          q.choice.map((c, ci) =>
                            <li> 
                              <div className={c === q.answer ? 'task_answer_toggle yes' : 'task_answer_toggle no'} onClick={() => this.mcAnswerToggle(qi, ci)}>
                                {ci+1}. {c}
                              </div>
                            </li>
                          ) 
                        :
                          <li>Answer: <input type="text" value={q.answer} onChange={e => this.answerInputOnChange(e.target.value, qi)} /></li>}
                      </ul>
                  </div>
                )}

                <button className="submit" onClick={this.answerTask}>Answer Task</button>

              </div>}

          </div>
        : <div>Please Wait...</div>}
      </div>
    )
  }
}

export default withRouter(AnswerTask)
