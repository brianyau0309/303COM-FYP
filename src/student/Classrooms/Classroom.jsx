import React from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

class Classroom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'permission': false, 'editToggle': false, 'success_page': false,
      'classroom_id': '', 'name': '', 'description': '', 'create_by': '', 'nickname': '', 'create_date': '',
      'newName': '', 'newDescription': ''
    }
    this.loadClassroom = this.loadClassroom.bind(this)
    this.editClassroom = this.editClassroom.bind(this)
    this.editToggle = this.editToggle.bind(this)
    this.deleteClassroom = this.deleteClassroom.bind(this)
  }

  componentDidMount() {
    this.loadClassroom()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params !== this.props.match.params && prevProps.match.path === this.props.match.path) {
      this.loadClassroom()
    }     
  }
  
  loadClassroom() {
    console.log(this.props)
    fetch('/api/classroom?c='+this.props.match.params.class).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          if (result.classroom !== 'Error') {
            this.setState({
              'permission': true,
              'classroom_id': result.classroom.classroom_id,
              'name': result.classroom.name,
              'newName': result.classroom.name,
              'description': result.classroom.description,
              'newDescription': result.classroom.description,
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

  newNameInputOnChange(value) {
    this.setState({ 'newName': value })
  }

  newDescriptionOnChange(value) {
    this.setState({ 'newDescription': value })
  }

  editClassroom(e) {
    e.preventDefault()
    let form = document.forms.form_editClassroom

    if (form.classroom_name.value !== '') {
      fetch('/api/classroom?c='+this.props.match.params.class, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'editClassroom': {
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
            this.editToggle()
            this.loadClassroom()
            this.props.reload()
          })
        }
      })
    } else {
      alert('Please at least fill in the name of the classroom.')
    }
  }

  editToggle() {
    this.setState({'editToggle': !this.state.editToggle})
  }

  deleteClassroom() {
    fetch('/api/classroom?c='+this.props.match.params.class, {method: 'DELETE'}).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({'success_page': true})
          this.props.reload()
        })
      }
    })
  }

  render() {
    return (
      <div className="Classroom content part">
        <div className="header sticky-top hidden">
          <Link className="header-icon" to={'/classrooms'}>
            <img className='header-icon' src={imgBack}/>
          </Link>
          <span>Classroom</span>
        </div>
        {this.state.permission ? 
          <div>
            { this.state.success_page ? 
              <div className="success_page">
                <div>Delete Success!</div>
                <Link to='/classrooms'>
                  <div className="btn">Back to Classrooms</div>
                </Link>
              </div>
            : null }
            <div className="block classroom">
              <div className="name">{this.state.name}</div>
              <div className="nickname" onClick={() => this.props.userInfoToggle(this.state.create_by)}>Teacher: {this.state.nickname}</div>
              <div className="description"><pre style={{fontFamily: 'inherit'}}>{this.state.description}</pre></div>
              <div className="date">&nbsp;<span>{new Date(this.state.create_date).toISOString().split('T')[0]} {new Date(this.state.create_date).toISOString().split('T')[1].split('.')[0]}</span></div>
            </div>
            <ul className="classroom-item">
              { this.props.user_type === 'teacher' ?
                <li onClick={this.editToggle} className="edit">Edit Classroom</li>
                : null}
              {this.state.editToggle && this.props.user_type === 'teacher' ? 
                <li className="edit">
                  <form name='form_editClassroom' onSubmit={this.editClassroom}>
                    <input type="text" name="classroom_name" placeholder="Name of the Classroom" value={this.state.newName} onChange={e => this.newNameInputOnChange(e.target.value)} required/>
                    <textarea name="classroom_description" placeholder="Desceibe the Classroom here..." value={this.state.newDescription} onChange={e => this.newDescriptionOnChange(e.target.value)} required/>
                    <input type="submit"/>
                  </form>
                </li>
              : null }
              <Link to={'/classrooms/'+this.state.classroom_id+'/members'}><li>Members</li></Link>
              <Link to={'/classrooms/'+this.state.classroom_id+'/tasks'}><li>Tasks</li></Link>
              {this.props.user_type === 'teacher' ? <Link to={'/classrooms/'+this.state.classroom_id+'/create_task'}><li>Create Task</li></Link> : null}
              <Link to={'/classrooms/'+this.state.classroom_id+'/calendar'}><li>Calendar</li></Link>
              <Link to={'/classrooms/'+this.state.classroom_id+'/chat'}><li>Chatroom</li></Link>

              {this.props.user_id === this.state.create_by ? <li className="delete" onClick={this.deleteClassroom}>Delete Classroom</li> : null}
            </ul>
          </div>
          : <div>Please Wait...</div>}
      </div>
    )
  }
}

export default withRouter(Classroom)
