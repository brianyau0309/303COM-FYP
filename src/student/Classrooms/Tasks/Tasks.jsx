import React from 'react'
import { Link, withRouter } from 'react-router-dom'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

class Tasks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'tasks': [],
      'permission': false
    }
    this.loadTasks = this.loadTasks.bind(this)
    this.checkPermission = this.checkPermission.bind(this)
  }

  componentDidMount() {
    this.checkPermission()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params !== this.props.match.params) {
      this.checkPermission()
    }     
  }

  checkPermission() {
    fetch('/api/classroom_member?c='+this.props.match.params.class).then(res => {
      if (res.ok) {
        res.json().then(result => {
          if (result.member) {
            this.setState({ 'permission': true },() => this.loadTasks())
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
  
  loadTasks() {
    if (this.state.permission) {
      fetch('/api/tasks?c='+this.props.match.params.class).then(res => {
        if (res.ok) {
          res.json().then(result => {
            console.log(result)
            if (result.tasks !== 'Error') {
              this.setState({
                'classroom': result.classroom,
                'tasks': result.tasks
              })
            } else {
              this.props.history.goBack()
            }
          })
        }
      })
    }
  }

  render() {
    return (
      <div className="Tasks content part">
        <div className="header">
          <Link className='header-icon' to={'/classrooms/'+this.props.match.params.class}>
            <img className='header-icon' src={imgBack}/>
          </Link>
          <span>Classroom Tasks</span>
        </div>
        {this.state.permission ? 
          <div>
            <div className="block form"> Tasks for {this.state.classroom ? this.state.classroom.name : null}</div>
            <ul className="task-list">
              {this.state.tasks.map(task => 
                <Link to={this.props.location.pathname+'/'+task.task_num}>
                  <li>
                    <div>Title: {task.title} {task.force_close ? <span style={{color: 'red'}}>(Closed)</span> : new Date() > new Date(task.deadline) ? <span style={{color: 'red'}}>(End)</span> : null }</div>
                    <div>Deadline: {new Date(task.deadline).toISOString().split('T')[0]}</div>
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

export default withRouter(Tasks)

