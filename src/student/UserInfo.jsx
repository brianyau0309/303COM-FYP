import React from 'react'

export default class UserInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      'target': 0,
      'targetInfo': false,
      'icon': `${window.location.origin}/static/images/icons/icon-128x128.png`,
    }
    this.loadUserInfo = this.loadUserInfo.bind(this)
    this.loadIcon = this.loadIcon.bind(this)
    this.imgOnError = this.imgOnError.bind(this)
    this.followToggle = this.followToggle.bind(this)
  }

  loadUserInfo(target) {
    this.setState({"target": target}, () => {
      fetch(`/api/user_info?target=${this.state.target}`).then(res => {
        if (res.ok) {
          res.json().then(result => {
            console.log(result)
            this.setState({ 'targetInfo': result.target_info })
            this.loadIcon(this.state.target)
          })
        }
      })
    })
  }
  
  loadIcon(target) {
    this.setState({ 'icon': `${window.location.origin}/static/images/user_icons/${target}.png?${new Date().getTime()}` })
  }

  imgOnError() {
    this.setState({ 'icon': `${window.location.origin}/static/images/icons/icon-128x128.png` })
  }

  followToggle() {
    fetch(`/api/user_follow?target=${this.state.target}`, { method: 'POST' }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.loadUserInfo(this.state.target)
        })
      }
    })
  }

  render() {
    const { targetInfo } = this.state
    return (
      <div className="UserInfo">
        <div className="UserInfo-bg" onClick={this.props.openToggle}></div>
        {targetInfo && 
          <div className="UserInfo-main">
            <img src={this.state.icon} alt="target icon" onError={this.imgOnError}/>
            <div>{targetInfo.nickname}</div>
            <div>User Id: {String(targetInfo.user_id).padStart(8,'0')}</div>
            <div>{targetInfo.user_type === 'teacher' ? 'Teacher' : 'Student'} from {targetInfo.school}</div>
            <div>
              <div>
                <div>Best Answer</div>
                <div>{ targetInfo.best_answer ? targetInfo.best_answer : 0 }</div>
              </div>
              <div>
                <div>Answer Likes</div>
                <div>{ targetInfo.answer_likes ? targetInfo.answer_likes : 0 }</div>
              </div>
              { targetInfo.user_type === 'teacher' && 
                <div>
                  <div>Course Average Rate</div>
                  <div>{ targetInfo.course_num ? targetInfo.course_num : 0 }</div>
                </div>
              }
              { targetInfo.user_type === 'teacher' &&
                <div>
                  <div>Followers</div>
                  <div>{ targetInfo.follower ? targetInfo.follower : 0 }</div>
                </div>
              }
              { targetInfo.user_id !== this.props.user_id && targetInfo.user_type === 'teacher' ? 
                  targetInfo.following ?
                    <div onClick={this.followToggle}>Unfollow</div>
                  : <div onClick={this.followToggle}>Follow</div>
              : null }
            </div>
          </div>
        }
      </div>
    )
  }
}
