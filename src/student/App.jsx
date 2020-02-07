import React from 'react'
import ReactDOM from 'react-dom'

const insertNode = document.querySelector("#node")

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.click = this.click.bind(this)
  }
  click() {
    fetch('/api/testing').then(res => {
      if (res.ok) {
        res.json().then(result => console.log(result))
      }
    })
  }
  render() {
    return (
      <h1 onClick={this.click}>Hello world!</h1>
    );
  }
}

ReactDOM.render(<Main />, insertNode)
