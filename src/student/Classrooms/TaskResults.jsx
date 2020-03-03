import React from 'react'
import { Link, withRouter } from 'react-router-dom'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

class TaskResults extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'permission': false,
      'title': '', 'create_date': '', 'deadline': '', 'question_count': 0,
      'student_answers': [], 'performance_category': [], 'performance_question': []
    }
    this.loadTaskResults = this.loadTaskResults.bind(this)
  }

  componentDidMount() {
    this.setState({'permission': true})
    this.loadTaskResults()
  }

  loadTaskResults() {
    let params = this.props.match.params
    fetch(`/api/task_results?c=${params.class}&t=${params.task}`).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 
            'title': result.task_results.title,
            'create_date': result.task_results.create_date,
            'deadline': result.task_results.deadline,
            'question_count': result.task_results.question_count,
            'student_answers': result.task_results.student_answers,
            'performance_category': result.task_results.performance_category,
            'performance_question': result.task_results.performance_question,
          })
        })
      }
    })
  }

  render() {
    return (
      <div className="TaskResults content">
        <div className="header">
          <Link className="header-icon" to={'/classrooms/'+this.props.match.params.class+'/tasks/'+this.props.match.params.task}>
            <img className='header-icon' src={imgBack}/>
          </Link>
          <span>Task Results</span>
        </div>
        {this.state.permission ? 
          <div>
            <div>Task Title: {this.state.title}</div>
            <div>Create Date: {this.state.create_date}</div>
            <div>Deadline: {this.state.deadline}</div>
            <div>Total Question: {this.state.question_count}</div>
            <ul>
              <li>
                Correct Rate (By question)
                {this.state.performance_question.map(p => 
                  <div>{p.question_num}: {Number(p.correct/this.state.question_count*100).toFixed(2)}%({p.correct}/{this.state.question_count})</div>
                )}
              </li>
              <li>
                Correct Rate (By category)
                {this.state.performance_category.map(p => 
                  <div>{p.category ? p.category : 'Others'}: {p.correct}/{this.state.question_count}</div>
                )}
              </li>
            </ul>
            <div>Student Answers:</div>
            <ul>
              {this.state.student_answers.map(s => 
                <Link to={this.props.match.url+'/'+parseInt(s.student)}>
                  <li>
                    <div>ID: {s.student}</div>
                    <div>Name: {s.name}</div>
                    <div>Correct Rate: {Number(s.correct/this.state.question_count*100).toFixed(2)}%({s.correct}/{this.state.question_count})</div>
                  </li>
                </Link>
              )}
            </ul>
          </div>
        : <div>Please Wait...</div>}
      </div>
    )
  }
}

export default withRouter(TaskResults)
