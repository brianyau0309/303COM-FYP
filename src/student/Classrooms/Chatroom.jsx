import React from 'react'
import { Link, withRouter } from 'react-router-dom'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'

class Chatroom extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 'messages': [], 'input': '', 'socket': '' }
    this.loadMessage = this.loadMessage.bind(this)
    this.inputOnChange = this.inputOnChange.bind(this)
    this.inputKeyDown = this.inputKeyDown.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.leaveRoom = this.leaveRoom.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }

  componentDidMount() {
    this.loadMessage()
    
		let socket = io.connect(window.location.origin),
      classroom = this.props.match.params.class
    this.setState({'socket': socket})

    socket.on('connect', () => {
      // socket.send('User has connected!');
      socket.emit('addRoom', {'room': `class${classroom}`});
    })
    
    // socket.on('message', function(msg) {
      // console.log(msg);
    // })

    let reloadMessage = this.loadMessage
    socket.on('reloadMessage', (msg) => {
      console.log(msg)
      reloadMessage()
    })
  }

  loadMessage() {
    fetch(`/api/chatroom?class=${this.props.match.params.class}`).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 'messages': result.chatroom.messages }, () => this.scrollToBottom())
        })
      }
    })
  }
  
  inputOnChange(e) {
    this.setState({ "input": e.target.value })
  }

  inputKeyDown(e) {
    if (e.key === 'Enter') this.sendMessage()
  }

  sendMessage() {
    if (this.state.input != "") {
      fetch(`/api/chatroom?class=${this.props.match.params.class}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'message': this.state.input })
      }).then(res => {
        if (res.ok) {
          res.json().then(result => {
            console.log(result)
            this.setState({'input': ''})
          })
        }
      })
    } else {
      alert('Please fill in at least one word.')
    }
  }

  leaveRoom() {
    let socket = this.state.socket
    socket.emit('leaveRoom', {'room': `class${this.props.match.params.class}`})
  }

  scrollToBottom() {
    let chatList = document.querySelector('.Chatroom ul.chat-list') 
    chatList.scrollTop = chatList.scrollHeight
  }

  render() {
    return (
      <div className="Chatroom content">
        <div className="header">
          <Link className="header-icon" to={`/classrooms/${this.props.match.params.class}`} onClick={this.leaveRoom}>
            <img className='header-icon' src={imgBack}/>
          </Link>
          <span>Chatroom</span>
        </div>
        <ul className="chat-list">
          {this.state.messages.map(message => 
            <li onClick={() => this.props.userInfoToggle(message.member)}>
              <div className="name">
                {message.user_type === 'teacher' ? "Teacher" : "Student"} {message.nickname}
                <span>{message.date ? new Date(message.date).toISOString().split('T')[0] : null} {message.date ? new Date(message.date).toISOString().split('T')[1].split('.')[0] : null}</span>
              </div>
              <div className="message">{message.message}</div>
            </li>
          )}
        </ul>
        <div className="input-field">
          <input type="text" placeholder="Input What You Want!" value={this.state.input} onKeyDown={this.inputKeyDown} onChange={this.inputOnChange}/><button onClick={this.sendMessage}>Send</button>
        </div>
      </div>
    )
  }
}

export default withRouter(Chatroom)

