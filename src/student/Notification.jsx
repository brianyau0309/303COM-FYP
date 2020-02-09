import React from 'react'

export default class Notification extends React.Component {
  constructor(props) {
    super(props)
    this.stats = {}
  }
  render() {
    return (
      <div className="Notification content">
        Notification Here!
      </div>
    )
  }
}


