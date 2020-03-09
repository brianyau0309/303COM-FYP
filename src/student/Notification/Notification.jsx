import React from 'react'

export default class Notification extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 'notice': [] }
    this.loadNotice = this.loadNotice.bind(this)
    this.collectionToggle = this.collectionToggle.bind(this)
  }

  componentDidMount() {
    this.loadNotice()
  }

  loadNotice() {
    fetch('/api/notification').then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.setState({ 'notice': result.notification })
        })
      }
    })
  }

  collectionToggle(id, m) {
    fetch('/api/course_collection?c='+id, {method: m}).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.loadNotice()
        })
      }
    })
  }

  render() {
    return (
      <ul className="Notification content">
          {this.state.notice.map(n => 
            <li>
              <div>{n.nickname} create a new Course:</div>
              <div>{n.title}</div>
              { n.collection ? 
                 <div onClick={() => this.collectionToggle(n.course_id, 'DELETE')}>Remove from Collection</div>
              :  <div onClick={() => this.collectionToggle(n.course_id, 'POST')}>Add to Collection</div> }
            </li>
          )}
      </ul>
    )
  }
}


