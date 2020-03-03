import React from 'react'
import { withRouter } from 'react-router-dom'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

class TaskResult extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'permission': false,
      'title': '', 'create_date': '', 'deadline': '', 'question_count': 0,
      'performance_category': []
    }
    this.loadTaskResult = this.loadTaskResult.bind(this)
  }

  componentDidMount() {
    this.setState({'permission': true})
  }

  loadTaskResult() {
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
            'performance_category': result.task_results.performance_category,
          })
        })
      }
    })
  }

  render() {
    return (
      <div className="TaskResult content">
        <div className="header">
          <img className='header-icon' src={imgBack} onClick={this.props.history.goBack}/>
          <span>Task Result</span>
        </div>
        {this.state.permission ? 
          <div>
            <div>Task Title: {this.state.title}</div>
            <div>Create Date: {this.state.create_date}</div>
            <div>Deadline: {this.state.deadline}</div>
            <div>Total Question: {this.state.question_count}</div>
            <ul>
              <li>
                Correct Rate: {}%({})
              </li>
              <li>
                Correct Rate (By category)
                {this.state.performance_category.map(p => 
                  <div>{p.category ? p.category : 'Others'}: {p.correct}/{this.state.question_count}</div>
                )}
              </li>
            </ul>
            <div>Question Result:</div>
          </div>
        : <div>Please Wait...</div>}
      </div>
    )
  }
}

export default withRouter(TaskResult)

