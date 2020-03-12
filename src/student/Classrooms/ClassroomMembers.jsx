import React from 'react'
import { Link, withRouter } from 'react-router-dom'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

class ClassroomMembers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'ClassroomMembers': [],
      'permission': false, 'inviteToggle': false
    }
    this.loadClassroomMembers = this.loadClassroomMembers.bind(this)
    this.checkPermission = this.checkPermission.bind(this)
    this.inviteMember = this.inviteMember.bind(this)
    this.kickFromClassroom = this.kickFromClassroom.bind(this)
    this.inviteToggle = this.inviteToggle.bind(this)
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
            if (result.invite_member !== "Error") {
              this.loadClassroomMembers()
              form.user.value = ''
            } else {
              alert('Please fill in a valid ID.')
            }
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

  imgOnError(e) {
    e.target.src = "https://briyana.ddns.net/static/images/icons/icon-128x128.png"
  }

  inviteToggle() {
    this.setState({"inviteToggle": !this.state.inviteToggle})
  }

  render() {
    return (
      <div className="ClassroomMembers content">
        <div className="header sticky-top">
          <img className='header-icon' src={imgBack} onClick={this.props.history.goBack}/>
          <span>Classroom Members</span>
        </div>
        {this.state.permission ? 
          <div>
            <div className="block form">{this.state.classroom ? this.state.classroom.name : null}</div>
            {this.props.user_type === 'teacher' ? 
              <div>
                <div className="block" style={{background: 'lightgreen', marginBottom: '0'}} onClick={this.inviteToggle}>Invite Member</div>
                {this.state.inviteToggle &&
                  <form className="block form" style={{background: 'lightgreen', margin: '0 auto'}} onSubmit={this.inviteMember} name="form_inviteMember">
                    <input type="number" name="user" placeholde="Student ID" required/>
                    <input type="submit"/>
                  </form>
                }
              </div>
            : null}
            <ul className="member-list">
              {this.state.ClassroomMembers.map(member => 
                <li>
                  <img src={window.location.origin+'/static/images/user_icons/'+Number(member.user_id)+'.png'} onError={this.imgOnError}/>
                  <div onClick={() => this.props.userInfoToggle(Number(member.user_id))}>ID: {member.user_id}</div>
                  <div onClick={() => this.props.userInfoToggle(Number(member.user_id))}>{member.fullname.toUpperCase()} {member.nickname}</div>
                  <div>Type: {member.user_type}</div>
                  <div>Join: {new Date(member.join_date).toISOString().split('T')[0]} {new Date(member.join_date).toISOString().split('T')[1].split('.')[0]}</div>
                  <div className="kick">
                    &nbsp;
                    {member.user_type === 'student' && this.props.user_type === 'teacher' ? <span onClick={() => this.kickFromClassroom(member.user_id)}>Kick</span> : null}
                  </div>
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
