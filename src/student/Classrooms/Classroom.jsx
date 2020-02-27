import React from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom'

class Classroom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'permission': false,
      'classroom_id': '', 'name': '', 'description': '', 'create_by': '', 'nickname': '', 'create_date': ''
    }
    this.loadClassroom = this.loadClassroom.bind(this)
  }

  componentDidMount() {
    this.loadClassroom()
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params !== this.props.match.params) {
      this.loadClassroom()
    }     
  }
  
  loadClassroom() {
    console.log(this.props)
    fetch('/api/classroom?c='+this.props.match.params.id).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          if (result.classroom !== 'Error') {
            this.setState({
              'permission': true,
              'classroom_id': result.classroom.classroom_id,
              'name': result.classroom.name,
              'description': result.classroom.description,
              'create_by': result.classroom.create_by,
              'nickname': result.classroom.nickname,
              'create_date': result.classroom.create_date
            })
          } else {
            this.props.history.goBack()
          }
        })
      }
    })
  }

  render() {
    return (
      <div className="Classroom content">
        {this.state.permission ? 
          <div>
            <div>
              <div>{this.state.name}</div>
              <div>{this.state.nickname}</div>
              <div>{this.state.create_date}</div>
            </div>
            <ul>
              <Link to={'/classrooms/'+this.state.classroom_id+'/members'}><li>Members</li></Link>
              <Link to=''><li>Task</li></Link>
              <Link to=''><li>Create Task</li></Link>
              <Link to=''><li>Calendar</li></Link>
              <Link to=''><li>Chatroom</li></Link>
            </ul>
          </div>
          : <div>Please Wait...</div>}
      </div>
    )
  }
}

export default withRouter(Classroom)
