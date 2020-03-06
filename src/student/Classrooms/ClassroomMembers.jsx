import React from 'react'
import { Link, withRouter } from 'react-router-dom'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

class ClassroomMembers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'ClassroomMembers': [],
      'permission': false
    }
    this.loadClassroomMembers = this.loadClassroomMembers.bind(this)
    this.checkPermission = this.checkPermission.bind(this)
    this.inviteMember = this.inviteMember.bind(this)
    this.kickFromClassroom = this.kickFromClassroom.bind(this)
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
            this.setState({ 'permission': true },() => this.loadClassroomMembers())
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
  
  loadClassroomMembers() {
    console.log(this.props)
    if (this.state.permission) {
      fetch('/api/classroom_members?c='+this.props.match.params.class).then(res => {
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
  }

  inviteMember(e) {
    e.preventDefault()
    let form = document.forms.form_inviteMember
    if (form.user.value && form.user.value > 0) {
      fetch('/api/classroom_members?c='+this.props.match.params.class+'&i='+form.user.value, {method: 'POST'}).then(res => {
        if (res.ok) {
          res.json().then(result => {
            console.log(result)
            this.loadClassroomMembers()
          })
        }
      })
    } else {
      alert('Please fill in a valid ID.')
    }
  }

  kickFromClassroom(u) {
    fetch('/api/classroom_members?c='+this.props.match.params.class+'&i='+u, {method: 'DELETE'}).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.loadClassroomMembers()
        })
      }
    })
  }

  render() {
    return (
      <div className="ClassroomMembers content">
        <div className="header">
          <img className='header-icon' src={imgBack} onClick={this.props.history.goBack}/>
          <span>Classroom Members</span>
        </div>
        {this.state.permission ? 
          <div>
            <div>{this.state.classroom ? this.state.classroom.name : null}: Member List</div>
            <form onSubmit={this.inviteMember} name="form_inviteMember">Invite Member: <input type="number" name="user" required/> <input type="submit"/> </form>
            <ul>
              {this.state.ClassroomMembers.map(member => 
                <li>
                  <div>ID: {member.user_id}</div>
                  <div>{member.fullname.toUpperCase()} {member.nickname}</div>
                  <div>Type: {member.user_type}</div>
                  <div>Join Date: {member.join_date}</div>
                  {member.user_type === 'student' && this.props.user_type === 'teacher' ? <button onClick={() => this.kickFromClassroom(member.user_id)}>Kick</button> : null}
                </li>
              )}
            </ul>
          </div>
        : <div>Please Wait...</div>}
      </div>
    )
  }
}

export default withRouter(ClassroomMembers)
