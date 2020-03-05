import React from 'react'
import CanvasJSReact from './CanvasJS.jsx'
const CanvasJSChart = CanvasJSReact.CanvasJSChart
 
class BarChart extends React.Component {
	render() {
		const options = {
			animationEnabled: true,
			title:{
				text: this.props.title
			},
			axisX: {
				title: this.props.title_X,
				reversed: true,
			},
			axisY: {
				title: this.props.title_Y,
        maximum: 100
			},
			data: [{
				type: "bar",
				dataPoints: this.props.data
			}]
		}
		
		return (
			<div>
				<CanvasJSChart options={options}/>
			</div>
		)
	}
}

export default BarChart
