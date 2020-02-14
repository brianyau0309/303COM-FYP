import React from 'react'

const imgBold = 'https://img.icons8.com/metro/26/000000/bold.png'
const imgItalic = 'https://img.icons8.com/metro/26/000000/italic.png'
const imgUnderline = 'https://img.icons8.com/metro/26/000000/underline.png'
const imgStrike = 'https://img.icons8.com/metro/26/000000/strikethrough.png'
const imgJL = 'https://img.icons8.com/metro/26/000000/align-left.png'
const imgJC = 'https://img.icons8.com/metro/26/000000/align-center.png'
const imgJR = 'https://img.icons8.com/metro/26/000000/align-right.png'
const imgSub = 'https://img.icons8.com/ios-glyphs/30/000000/subscript.png'
const imgSup = 'https://img.icons8.com/ios-glyphs/30/000000/superscript.png'
const imgNList = 'https://img.icons8.com/material-sharp/24/000000/list.png'
const imgOList = 'https://img.icons8.com/metro/26/000000/numbered-list.png'

export default class TextEditor extends React.Component {
  constructor(props) {
    super(props)
    this.btnClick = this.btnClick.bind(this)
  }
  componentDidMount() {
    TextField.document.designMode = 'on'
    TextField.document.execCommand("enableObjectResizing", false, false)
  }
  btnClick(event) {
    let n = null
    if (event === 'InsertOrderedList' || event === 'InsertUnorderedList') n = Math.random() * 1000
    TextField.document.execCommand(event, false, n)
  }

  render() {
    return(
      <div className='TextEditor'>
        <div className='EditorPanel'>
          <button id="btnBold" title="Bold" onClick={() => this.btnClick('Bold')}><img src={imgBold}/></button>
          <button id="btnItalic" title="Italic" onClick={() => this.btnClick('Italic')}><img src={imgItalic}/></button>
          <button id="btnUnderln" title="Underline" onClick={() => this.btnClick('Underline')}><img src={imgUnderline}/></button>
          <button id="btnStrike" title="Strike" onClick={() => this.btnClick('Strikethrough')}><img src={imgStrike}/></button>
          <button id="btnJLeft" title="Justisfy left" onClick={() => this.btnClick('JustifyLeft')}><img src={imgJL}/></button>
          <button id="btnJCenter" title="Justisfy center" onClick={() => this.btnClick('JustifyCenter')}><img src={imgJC}/></button>
          <button id="btnJRight" title="Justisfy right" onClick={() => this.btnClick('JustifyRight')}><img src={imgJR}/></button>
          <button id="btnOList" title="Ordered list" onClick={() => this.btnClick('InsertOrderedList')}><img src={imgOList}/></button>
          <button id="btnUList" title="Unorder list" onClick={() => this.btnClick('InsertUnorderedList')}><img src={imgNList}/></button>
          <button id="btnSup" title="Superscript" onClick={() => this.btnClick('Superscript')}><img src={imgSup}/></button>
          <button id="btnSub" title="Subscript" onClick={() => this.btnClick('Subscript')}><img src={imgSub}/></button>
        </div>

        <iframe marginwidth="15" marginheight="10" name="TextField" id="TextField" onKeyUp={this.counting}></iframe>
      </div>
    )
  }
}
