import React from 'react'
import { Link, withRouter } from 'react-router-dom'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

class Chatroom extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 'chat': []  }
  }

  componentDidMount() {
		let socket = io.connect(window.location.origin)
    console.log(this.props)
    socket.on('connect', function() {
      socket.send('User has connected!');
      socket.emit('addRoom', {'room': `class`});
    });
    
    socket.on('message', function(msg) {
      console.log(msg);
    });
  }

  render() {
    return (
      <div className="Chatroom content">
        <div className="header">
          <Link className="header-icon" to={'/classrooms'}>
            <img className='header-icon' src={imgBack}/>
          </Link>
          <span>Chatroom</span>
        </div>
        <ul>
        </ul>
      </div>
    )
  }
}

export default withRouter(Chatroom)

