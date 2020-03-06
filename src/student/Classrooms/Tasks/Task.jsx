import React from 'react'
import { Link, withRouter } from 'react-router-dom'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

class Task extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'title': '', 'create_date': '', 'deadline': '', 'task_answers': [], 'forceClose': false,
      'permission': false, 'success_page': false
    }
    this.loadTask = this.loadTask.bind(this)
    this.loadAnswer = this.loadAnswer.bind(this)
    this.checkPermission = this.checkPermission.bind(this)
    this.forceClose = this.forceClose.bind(this)
    this.deleteTask = this.deleteTask.bind(this)
  }

  componentDidMount() {
    this.checkPermission()
    this.loadAnswer()
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
            this.setState({ 'permission': true },() => this.loadTask())
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
  
  loadTask() {
    if (this.state.permission) {
      fetch('/api/task?c='+this.props.match.params.class+'&t='+this.props.match.params.task).then(res => {
        if (res.ok) {
          res.json().then(result => {
            console.log(result)
            if (result.task !== 'Error' && result.task != null) {
              this.setState({
                'classroom': result.classroom,
                'title': result.task.title,
                'create_date': result.task.create_date,
                'deadline': result.task.deadline,
                'forceClose': result.task.force_close
              })
            } else {
              this.props.history.goBack()
            }
          })
        }
      })
    }
  }

  loadAnswer() {
    fetch('/api/task_answers?c='+this.props.match.params.class+'&t='+this.props.match.params.task).then(res => {
      if (res.ok) {
        res.json().then(result => {
          this.setState({'task_answers': result.task_answers})
        })
      }
    })
  }

  forceClose() {
    fetch('/api/task?c='+this.props.match.params.class+'&t='+this.props.match.params.task, {method: 'PATCH'}).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.loadTask()
        })
      }
    })
  }

  deleteTask() {
    fetch('/api/task?c='+this.props.match.params.class+'&t='+this.props.match.params.task, {method: 'DELETE'}).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({'success_page': true})
        })
      }
    })
  }

  render() {
    return (
      <div className="Task content">
        <div className="header">
          <Link className="header-icon" to={'/classrooms/'+this.props.match.params.class+'/tasks'}>
            <img className='header-icon' src={imgBack}/>
          </Link>
          <span>Classroom Task</span>
        </div>
        {this.state.permission ? 
          <div>
            { this.state.success_page ? 
              <div style={{top: '0', left: '0', position: 'absolute', width: '100%', height: '100vh', background: 'white'}}>
                <div>Delete Success!</div>
                <Link to={'/classrooms/'+this.props.match.params.class+'/tasks'}>
                  <div>Back to Tasks Page</div>
                </Link>
              </div>
            : null }
            <div>Task Title: {this.state.title}</div>
            <div>{this.state.create_date}</div>
            <div>{this.state.deadline}</div>

            { this.props.user_type === 'teacher' ?
                new Date() > new Date(this.state.deadline) || this.state.forceClose ?
                  <Link to={this.props.location.pathname+'/results'}><button>Result</button></Link>
                :
                  <div>
                    <Link to={this.props.location.pathname+'/edit'}><button>Edit</button></Link>
                    <br/><button onClick={this.forceClose}>Force Close</button>
                    <br/><button onClick={this.deleteTask}>Delete</button>
                  </div>
            : new Date() > new Date(this.state.deadline) || this.state.forceClose  ?
                <Link to={this.props.location.pathname+'/results/'+this.props.user_id}><button>Result</button></Link>
              : 
                this.state.task_answers.length > 0 ? 
                  <Link to={this.props.location.pathname+'/edit_answer/'+this.props.user_id}><button>Edit Answer</button></Link>
                : <Link to={this.props.location.pathname+'/answer'}><button>Answer</button></Link>}

          </div>
        : <div>Please Wait...</div>}
      </div>
    )
  }
}

export default withRouter(Task)
