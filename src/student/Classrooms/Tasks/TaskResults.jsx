import React from 'react'
import { Link, withRouter } from 'react-router-dom'

import BarChart from '../../../CanvasJS/BarChart.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

class TaskResults extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'permission': false, 'questionToggle': false, 'categoryToggle': false,
      'title': '', 'create_date': '', 'deadline': '', 'question_count': 0, 'submited': 0,
      'student_answers': [], 'performance_category': [], 'performance_question': [],
      'questionGraph': [], 'categoryGraph': []
    }
    this.loadTaskResults = this.loadTaskResults.bind(this)
    this.questionToggle = this.questionToggle.bind(this)
    this.categoryToggle = this.categoryToggle.bind(this)
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
          if (result.task !== 'Error' && ((new Date() > new Date(result.task_results.deadline)) || result.task_results.force_close)) {
            this.setState({ 
              'title': result.task_results.title,
              'create_date': result.task_results.create_date,
              'deadline': result.task_results.deadline,
              'submitted': result.task_results.submitted,
              'question_count': result.task_results.question_count,
              'student_answers': result.task_results.student_answers,
              'performance_category': result.task_results.performance_category,
              'performance_question': result.task_results.performance_question,
            }, () => {
              let questionGraph = this.state.performance_question.map(p => ({y:Number(p.correct/this.state.question_count*100), label: p.question_num}))
              let categoryGraph = this.state.performance_category.map(p => ({y:Number(p.correct/p.category_count*100), label: p.category}))
              this.setState({'questionGraph': questionGraph, 'categoryGraph': categoryGraph})
            })
          } else {
            this.props.history.goBack()
          }
        })
      }
    })
  }

  questionToggle() {
    this.setState({'questionToggle': !this.state.questionToggle})
  }

  categoryToggle() {
    this.setState({'categoryToggle': !this.state.categoryToggle})
  }

  render() {
    return (
      <div className="TaskResults content part">
        <div className="header sticky-top" style={{zIndex: '1'}}>
          <Link className="header-icon" to={'/classrooms/'+this.props.match.params.class+'/tasks/'+this.props.match.params.task}>
            <img className='header-icon' src={imgBack}/>
          </Link>
          <span>Task Results</span>
        </div>
        {this.state.permission ? 
          <div>
            <div className="task-basic block">
              <div>Title: {this.state.title}</div>
              <div className="date">Created: {this.state.create_date !== '' && new Date(this.state.create_date).toISOString().split('T')[0]}</div>
              <div className="date">Deadline: {this.state.deadline !== '' && new Date(this.state.deadline).toISOString().split('T')[0]}</div>
            </div>
            
            <div className="task-basic block sub">
              <div>Submitted: {this.state.submitted}</div>
              <div>Total Questions: {this.state.question_count}</div>
            </div>

            <div className="task-basic block btn">
              <span onClick={this.questionToggle}>Correct Rate (By question)</span>
              {this.state.questionToggle ? 
                <div style={{padding: '2vh 0'}}>
                  <BarChart title='Correct Rate by Question' title_X='Questions' title_Y='Correct Rate (%)' data={this.state.questionGraph}/>
                  {this.state.performance_question.map(p => 
                    <div>Q{p.question_num}. {Number(p.correct/this.state.question_count*100).toFixed(2)}%({p.correct}/{this.state.question_count})</div>
                  )}
                </div>
              : null}
            </div>
            <div className="task-basic block btn">
              <span onClick={this.categoryToggle}>Correct Rate (By category)</span>
              {this.state.categoryToggle ?  
                <div style={{padding: '2vh 0'}}>
                  <BarChart title='Correct Rate by Category' title_X='Categories' title_Y='Correct Rate (%)' data={this.state.categoryGraph}/>
                  {this.state.performance_category.map(p => 
                    <div>{p.category ? p.category : 'Others'}: {Number(p.correct/p.category_count*100).toFixed(2)}%({p.correct}/{p.category_count})</div>
                  )}
                </div>
              : null}
            </div>

            <div className="task-basic block" style={{textAlign: 'center'}}>Student Answers</div>

            <ul>
              {this.state.student_answers.map(s => 
                <Link to={this.props.match.url+'/'+parseInt(s.student)}>
                  <li className="task-basic block answer btn">
                    <div>Name: {s.name}</div>
                    <div>ID: {s.student}</div>
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
