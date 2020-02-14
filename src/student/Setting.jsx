import React from 'react'

export default class Setting extends React.Component {
  constructor(props) {
    super(props)
    this.stats = {}
  }
  render() {
    return (
      <div className="Setting content">
        <div>
          <span>{this.props.user_data.nickname}</span>
        </div>
      </div>
    )
  }
}
