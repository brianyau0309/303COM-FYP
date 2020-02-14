import React from 'react'

export default class Courses extends React.Component {
  constructor(props) {
    super(props)
    this.stats = {}
  }
  render() {
    return (
      <div className="Courses content">
        <select>
          <option>Title</option>
          <option>Tag</option>
          <option>Author</option>
        </select>
        <input type='text' placeholder='Search Courses Here!'/>
        <button>My Collection</button>
        <button>My Courses</button>
        <button>Create Course</button>
        <h3>Hotest</h3>
        <ul>1</ul>
        <h3>Recommand</h3>
        <ul>2</ul>
      </div>
    )
  }
}
