import React from 'react'
import { Link, withRouter } from 'react-router-dom'

class ClassroomMembers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'ClassroomMembers': []
    }
    this.loadClassroomMembers = this.loadClassroomMembers.bind(this)
  }

  componentDidMount() {
    this.loadClassroomMembers()
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params !== this.props.match.params) {
      this.loadClassroomMembers()
    }     
  }
  
  loadClassroomMembers() {
    console.log(this.props)
    fetch('/api/classroom_members?c='+this.props.match.params.id).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          if (result.classroom_members !== 'Error') {
            this.setState({
              'classroom': result.classroom,
              'ClassroomMembers': result.classroom_members
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
      <div className="ClassroomMembers content">
        <div>{this.state.classroom ? this.state.classroom.name : null}: Member List</div>
        <ul>
          {this.state.ClassroomMembers.map(member => 
            <li>
              <div>{member.nickname}</div>
              <div>{member.user_type}</div>
            </li>
          )}
        </ul>
      </div>
    )
  }
}

export default withRouter(ClassroomMembers)
