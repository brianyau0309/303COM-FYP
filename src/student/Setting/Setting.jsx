import React from 'react'

export default class Setting extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'icon': `${window.location.origin}/static/images/icons/icon-128x128.png`,
      'info': false,
      'iconChange': false, 'nicknameChange': false, 'passwordChange': false,
    }
    this.loadInfo = this.loadInfo.bind(this)
    this.loadIcon = this.loadIcon.bind(this)
    this.changeIcon = this.changeIcon.bind(this)
    this.deleteIcon = this.deleteIcon.bind(this)
    this.changeNickname = this.changeNickname.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.imgOnError = this.imgOnError.bind(this)
    this.iconToggle = this.iconToggle.bind(this)
    this.nicknameToggle = this.nicknameToggle.bind(this)
    this.passwordToggle = this.passwordToggle.bind(this)
  }

  componentDidMount() {
    this.loadInfo()
    this.loadIcon()
    document.querySelector('title').innerHTML = 'Self - FYP'
  }
  
  loadInfo() {
    fetch(`/api/user_info`).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 'info': result.user_info })
        })
      }
    })
  }

  loadIcon(id) {
    this.setState({ 'icon': `${window.location.origin}/static/images/user_icons/${this.props.user_data.user_id}.png?${new Date().getTime()}` })
  }

  changeIcon(e) {
    e.preventDefault()
    let form = document.forms.form_changeIcon
    let file = form.icon.files[0]
    let filetype = null
    if (file!= undefined) { filetype = file.name.split('.').pop() }
    console.log(file)
    if (filetype === 'png') {
      const send_form = new FormData()
      send_form.append('icon', file)
      fetch(`/api/user_info`, {
        method: 'POST',
        body: send_form
      }).then(res => {
        if (res.ok) {
          res.json().then(result => {
            console.log(result)
            form.icon.value = ''
            this.iconToggle()
            this.loadIcon()
          })
        }
      })
    } else {
      if (filetype === null) {
        alert('Please Choose the file before submit')
      } else {
        alert('Sorry, we only support .png file for Icon')
      }
    }
  }

  deleteIcon() {
    fetch(`/api/user_info`, { method: 'DELETE' }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          document.forms.form_changeIcon.icon.value = ''
          this.iconToggle()
          this.loadIcon()
        })
      }
    })
  }

  changeNickname(e) {
    e.preventDefault()
    let form = document.forms.form_changeNickname
    fetch(`/api/user_data`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "changeNickname": {
        "nickname": form.nickname.value
      } })
    }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          form.nickname.value = ''
          this.nicknameToggle()
          this.props.reload()
          alert('Success! Nickname Changed')
        })
      }
    })
  }

  changePassword(e) {
    e.preventDefault()
    let form = document.forms.form_changePassword
    if (form.password_new.value === form.password_repeat.value) {
      fetch(`/api/user_data`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "changePassword": {
          "password_now": form.password_now.value,
          "password_new": form.password_new.value
        } })
      }).then(res => {
        if (res.ok) {
          res.json().then(result => {
            console.log(result)
            if (result.changePassword !== 'Error') {
              this.passwordToggle()
              form.password_now.value = ''
              form.password_new.value = ''
              form.password_repeat.value = ''
              alert('Success! Password Changed')
            } else {
              alert('Error! Please Check Your Password Is Correct Or Not')
            }
          })
        }
      })
    } else {
      alert('Error! Please Check Your Two New Password Are Same Or Not')
    }
  }

  imgOnError() {
    this.setState({ 'icon': `${window.location.origin}/static/images/icons/icon-128x128.png` })
  }

  iconToggle() {
    this.setState({ 'iconChange': !this.state.iconChange })
  }

  nicknameToggle() {
    this.setState({ 'nicknameChange': !this.state.nicknameChange })
  }

  passwordToggle() {
    this.setState({ 'passwordChange': !this.state.passwordChange })
  }

  render() {
    let user = this.props.user_data
    return (
      <div className="Setting content">
        <div className="block img">
          <img src={this.state.icon} alt="user icon" onError={this.imgOnError}/>
        </div>

        <div className="block basic">
          <div>
            {user.nickname}&nbsp;
            {user.sex === 'f' ?
              <span style={{color: 'deeppink'}}>Female</span>
            : <span style={{color: 'lightblue'}}>Male</span>}
          </div>
          <div>ID: {String(user.user_id).padStart(8,'0')}</div>
          <div>Name: {user.name}</div>
          <div>{user.user_type === 'teacher' ? 'Teacher' : 'Student'} from {user.school}</div>
        </div>

        <div className="flex">
          <div className="block">
            <div>Best Answer</div>
            <div>{ this.state.info ? this.state.info.best_answer ? this.state.info.best_answer : 0 : null }</div>
          </div>
          <div className="block">
            <div>Answer Likes</div>
            <div>{ this.state.info ? this.state.info.answer_likes ? this.state.info.answer_likes : 0 : null }</div>
          </div>
          { user.user_type === 'teacher' && 
            <div className="block">
              <div>Courses Avg. Rate</div>
              <div>{ this.state.info ? this.state.info.course_avg ? this.state.info.course_avg : 0 : null }</div>
            </div>
          }
          { user.user_type === 'teacher' &&
            <div className="block">
              <div>Followers</div>
              <div>{ this.state.info ? this.state.info.follower ? this.state.info.follower : 0 : null }</div>
            </div>
          }
        </div>

        <ul>
          <li className="block btn" onClick={this.iconToggle}>Change Icon</li>
          { this.state.iconChange &&
            <li className="block input">
              <form name="form_changeIcon" onSubmit={this.changeIcon}>
                <input name="icon" type="file" />
                <input type="submit" />
              </form>
              <div className="delete" onClick={this.deleteIcon}>Just delete my icon!</div>
            </li>
          }
          <li className="block btn" onClick={this.nicknameToggle}>Change Nickname</li>
          { this.state.nicknameChange &&
            <li className="block input">
              <form name="form_changeNickname" onSubmit={this.changeNickname}>
                <input placeholder='New Nickname' name="nickname" type="text" />
                <input type="submit" />
              </form>
            </li>
          }
          <li className="block btn" onClick={this.passwordToggle}>Change Password</li>
          { this.state.passwordChange &&
            <li className="block input">
              <form name="form_changePassword" onSubmit={this.changePassword}>
                <input placeholder='Password Now' name="password_now" type="password" />
                <input placeholder='New Password' name="password_new" type="password" />
                <input placeholder='Confirm New Password' name="password_repeat" type="password" />
                <input type="submit" />
              </form>
            </li>
          }
        </ul>
      </div>
    )
  }
}
