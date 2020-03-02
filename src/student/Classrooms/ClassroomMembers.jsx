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
            <ul>
              {this.state.ClassroomMembers.map(member => 
                <li>
                  <div>{member.nickname}</div>
                  <div>{member.user_type}</div>
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
