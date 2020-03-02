import React from 'react'
import { Link, withRouter } from 'react-router-dom'

import Classroom from './Classroom.jsx'
import ClassroomMembers from './ClassroomMembers.jsx'
import CreateTask from './CreateTask.jsx'
import Tasks from './Tasks.jsx'
import Task from './Task.jsx'
import EditTask from './EditTask.jsx'

class Classrooms extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'createToggle': false,
      'classrooms': [],
      'part': ''
    }
    this.loadClassrooms = this.loadClassrooms.bind(this)
    this.createToggle = this.createToggle.bind(this)
    this.createClassroom = this.createClassroom.bind(this)
  }

  componentDidMount() {
    this.loadClassrooms()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match !== this.props.match) {
      console.log(this.props)
      if (this.props.match.path === "/classrooms/:class/members") {this.setState({'part': 'classMembers'})}
      else if (this.props.match.path === "/classrooms/:class/create_task") {this.setState({'part': 'createTask'})}
      else if (this.props.match.path === "/classrooms/:class/tasks") {this.setState({'part': 'tasks'})}
      else if (this.props.match.path === "/classrooms/:class/tasks/:task") {this.setState({'part': 'task'})}
      else if (this.props.match.path === "/classrooms/:class/tasks/:task/edit") {this.setState({'part': 'editTask'})}
      else if (this.props.match.path === "/classrooms/:class") {this.setState({'part': 'class'})}     
      else {this.setState({'part': ''})}
    }
  }

  loadClassrooms() {
    fetch('/api/classrooms').then(res => {
      if (res.ok) {
        res.json().then(result => {
          this.setState({ 'classrooms': result.classrooms })
        })
      }
    })
  }

  createToggle() {
    this.setState({ 'createToggle': !this.state.createToggle })
  }

  createClassroom(e) {
    e.preventDefault()
    let form = document.forms.form_createClassroom

    if (form.classroom_name.value !== '') {
      fetch('/api/classroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'createClassroom': {
            'name': form.classroom_name.value,
            'description': form.classroom_description.value
          }
        })
      }).then(res => {
        if (res.ok) {
          res.json().then(result => {
            console.log(result)
            form.classroom_name.value = ''
            form.classroom_description.value = ''
            this.loadClassrooms()
            this.createToggle()
          })
        }
      })
    } else {
      alert('Please at least fill in the name of the classroom.')
    }
  }


  render() {
    return (
      <div className="content">
        <div className="Classrooms">
          {this.props.user_type === 'teacher' ? 
            <div>
              <button onClick={this.createToggle}>Create Classrooms</button>
              {this.state.createToggle ? 
                <form name='form_createClassroom'>
                  <input type="text" name="classroom_name" placeholder="Name of the Classroom" required/>
                  <textarea name="classroom_description" placeholder="Desceibe the Classroom here..." required/>
                  <input type="submit" onClick={this.createClassroom}/>
                </form>
              : null }
            </div>
          : null}

          <h3>My Classrooms</h3>
          <ul>
            {this.state.classrooms.map(c => 
              <Link to={'/classrooms/'+c.classroom_id}>
                <li>
                  <div>{c.name}</div>
                  <div>{c.description}</div>
                  <div>{c.create_date}</div>
                </li>
              </Link>
            )}
          </ul>
        </div>

        {this.state.part === 'class' ? <Classroom reload={this.loadClassrooms}/> : null}
        {this.state.part === 'classMembers' ? <ClassroomMembers/> : null}
        {this.state.part === 'createTask' ? <CreateTask/> : null}
        {this.state.part === 'tasks' ? <Tasks/> : null}
        {this.state.part === 'task' ? <Task user_type={this.props.user_type}/> : null}
        {this.state.part === 'editTask' && this.props.user_type === 'teacher' ? <EditTask/> : null}
      </div>
    )
  }
}

export default withRouter(Classrooms)
