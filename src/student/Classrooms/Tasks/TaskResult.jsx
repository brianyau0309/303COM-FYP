import React from 'react'
import { withRouter } from 'react-router-dom'

import BarChart from '../../../CanvasJS/BarChart.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

class TaskResult extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'permission': false,
      'title': '', 'create_date': '', 'deadline': '', 'question_count': 0, 'student_result': null,
      'performance_category': [], 'student_answers': [],
      'categoryGraph': []
    }
    this.loadTaskResult = this.loadTaskResult.bind(this)
    this.categoryToggle = this.categoryToggle.bind(this)
  }

  componentDidMount() {
    this.loadTaskResult()
  }

  loadTaskResult() {
    let params = this.props.match.params
    fetch(`/api/task_result?c=${params.class}&t=${params.task}&s=${params.student}`).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          if (result.task !== 'Error' && ((new Date() > new Date(result.task_results.deadline)) || result.task_results.force_close)) {
            this.setState({ 
              'permission': true,
              'title': result.task_results.title,
              'create_date': result.task_results.create_date,
              'deadline': result.task_results.deadline,
              'question_count': result.task_results.question_count,
              'performance_category': result.task_results.performance_category,
              'student_result': result.task_results.student_result,
              'student_answers': result.task_results.student_answers,
            }, () => {
              let categoryGraph = this.state.performance_category.map(p => ({y:Number(p.correct/p.category_count*100), label: p.category}))
              this.setState({'categoryGraph': categoryGraph})
            })
          } else {
            this.props.history.goBack()
          }
        })
      }
    })
  }

  categoryToggle() {
    this.setState({'categoryToggle': !this.state.categoryToggle})
  }

  render() {
    return (
      <div className="TaskResult content part">
        <div className="header sticky-top">
          <img className='header-icon' src={imgBack} onClick={this.props.history.goBack}/>
          <span>Task Result</span>
        </div>
        {this.state.permission ? 
          <div>
            <div className="task-basic block">
              <div>Title: {this.state.title}</div>
              <div className="date">Created: {this.state.create_date !== '' && new Date(this.state.create_date).toISOString().split('T')[0]}</div>
              <div className="date">Deadline: {this.state.deadline !== '' && new Date(this.state.deadline).toISOString().split('T')[0]}</div>
            </div>

            <div className="task-basic block sub">
              <div>Total Question: {this.state.question_count}</div>
              {this.state.student_result != null ? 
                <div onClick={() => this.props.userInfoToggle(this.state.student_result.student)}>
                    <div>Student ID: {this.state.student_result.student}</div>
                    <div>Student Name: {this.state.student_result.name}</div>
                    <div>Correct Rate: {Number(this.state.student_result.correct/this.state.question_count*100).toFixed(2)}%({this.state.student_result.correct}/{this.state.question_count})</div>
                </div>
              :null}
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

            <div className="task-basic block" style={{textAlign: 'center'}}>Qusetion Results</div>

            {this.state.student_answers.map(a => 
              <div className="task-basic block answer">
                <div>Q{a.question_num}.</div>
                <div><pre>{a.question}</pre></div>
                <div>Category: {a.category}</div>
                <div>Your answer: <span style={a.student_answer === a.answer ? {color: 'green'} : {color: 'red'}}>{a.student_answer}</span></div>
                {a.student_answer !== a.answer ? <div>Correct answer: <span style={{color: 'green'}}>{a.answer}</span></div>: null}
              </div>
            )}
          </div>
        : <div>Please Wait...</div>}
      </div>
    )
  }
}

export default withRouter(TaskResult)

