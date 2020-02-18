import React from 'react'

export default class Classrooms extends React.Component {
  constructor(props) {
    super(props)
    this.stats = {}
  }
  render() {
    return (
      <div className="Classrooms content">
        <button>Join Classroom</button>
        <h3>My Classrooms</h3>
        <ul>
          <li>classroom 1</li>
        </ul>
      </div>
    )
  }
}

