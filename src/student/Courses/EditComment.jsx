import React from 'react'

import TextEditor from '../../TextEditor2.jsx'

const imgBack = 'https://img.icons8.com/flat_round/64/000000/back--v1.png'
const imgStar = 'https://img.icons8.com/emoji/48/000000/star-emoji.png'
const imgEmptyStar = 'https://img.icons8.com/color/48/000000/star--v1.png'

export default class EditComment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'open': false,
      'editedRate': 5
    }
    this.loadComment = this.loadComment.bind(this)
    this.submitEditedComment = this.submitEditedComment.bind(this)
    this.rating = this.rating.bind(this)
    this.openToggle = this.openToggle.bind(this)
  }

  loadComment(c, r) {
    TextField2.document.body.innerHTML = c
    this.setState({ 'editedRate': r })
  } 

  submitEditedComment() {
    let editedComment = TextField2.document.body.innerHTML
    fetch('/api/courses_comments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'submit_edited_comment': 
        {
          'course': this.props.course_id,
          'edited_comment': editedComment,
          'edited_rate': this.state.editedRate
        }
      })
    }).then(res => {
      if (res.ok) {
        res.json().then(result => {
          console.log(result)
          this.props.reload()
          this.openToggle()
        })
      }
    })
  }
  
  rating(r) {
    this.setState({ 'editedRate': r })
  }

  openToggle() {
    this.setState({'open': !this.state.open})
  }
  
  render() {
    return (
      <div className={this.state.open ? 'EditComment open' : 'EditComment close'}>
        <div className="header">
          <img className='header-icon' src={imgBack} onClick={this.openToggle}/>
          <span>Edit Comment</span>
        </div>
        {[...Array(5).keys()].map(i => 
          (this.state.editedRate < i+1 ? 
            <img src={imgEmptyStar} onClick={() => this.rating(i+1)}/> 
          :  <img src={imgStar} onClick={() => this.rating(i+1)}/> 
          )
        )}
        <span>{this.state.editedRate}</span>
        <TextEditor/>
        <button onClick={this.submitEditedComment}>Submit Edited Comment</button>
      </div>
    )
  }
}

