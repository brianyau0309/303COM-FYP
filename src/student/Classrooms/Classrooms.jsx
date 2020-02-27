import React from 'react'
import { Link } from 'react-router-dom'

export default class Classrooms extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'createToggle': false,
      'classrooms': []
    }
    this.loadClassrooms = this.loadClassrooms.bind(this)
    this.createToggle = this.createToggle.bind(this)
    this.createClassroom = this.createClassroom.bind(this)
  }

  componentDidMount() {
    this.loadClassrooms()
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
      <div className="Classrooms content">
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
    )
  }
}

