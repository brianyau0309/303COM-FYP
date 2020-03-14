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
          {this.state.notice.length === 0 ? <li style={{textAlign: 'center', marginTop: '3vh', fontSize: '2.5vh'}}>No Notification</li> : null}
          {this.state.notice.map(n => 
            <li className="block">
              <div>{n.nickname} created a new Course:</div>
              <div className="title">{n.title}</div>
              <div className="date">{new Date(n.create_date).toISOString().split('T')[0]} {new Date(n.create_date).toISOString().split('T')[1].split('.')[0]}</div>
              { n.collection ? 
                 <div className="remove" onClick={() => this.collectionToggle(n.course_id, 'DELETE')}>Remove from Collection</div>
              :  <div className="add" onClick={() => this.collectionToggle(n.course_id, 'POST')}>Add to Collection</div> }
            </li>
          )}
      </ul>
    )
  }
}


