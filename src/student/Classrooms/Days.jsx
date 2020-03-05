import React from 'react'

const day = (n) => <li className="day">
                     <div className="dayHead">{n !== 0 ? n : null}</div>
                     <div className="dayDetail"></div>
                   </li>

const dayList = (date) => {
  let bigMonth = [1,3,5,7,8,10,12], list = [], days = 30, weekday = (new Date(`${date.year}/${date.month}/1`)).getDay()
  if (date.month === 2) {
    let y = date.year
    if ((y%4 === 0 && y%100 != 0)||(y%400 === 0 && y%3200 != 0)) { days = 29 }
    else { days = 28 }
  } else {
    for (let i = 0; i < bigMonth.length; i++) {
      if (date.month === bigMonth[i]) { days = 31 }
    }
  }
  for (let i = 1; i <= weekday; i++) { list.push(day(0)) }
  for (let i = 1; i <= days; i++) { list.push(day(i)) }

  return (<ul className="days">{list}</ul>)
}

export default class Days extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render() {
    console.log(this.props.date)
    let Month = dayList(this.props.date)
    
    return (
      <div className="day-list">
        {Month}
      </div>
    )
  }
} 

