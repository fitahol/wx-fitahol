import { formatTime } from '../../utils/util'
import Charts from '../../libs/wxcharts'
import Fetch from '../../utils/services'
import $storage from '../../utils/storage'

Page({
	data: {
		chartData: {},
		dataX: []
	},
	getRecordList(userID) {
		const that = this
		Fetch(`/schedule/event/analytics/?user_id=${userID}`)
		.then(res => {
			that.setData({
				chartData: res.data
			})
			let weekdayReportList = res.data.weekday_report || []
			let dataX = []
			weekdayReportList.forEach(
				element => {
					dataX.push(`${element.cdate},${element.count}`)
			})
			that.setData({ dataX })
			that.drawCourseChart(dataX, res.data)
		})
	},
	drawCourseChart(X, DATA) {
		const data = this.data
		const dataX = X || data.dataX
		const chartData = DATA || data.chartData
		chartData.event_use = chartData.event_total - chartData.event_remain
		const bMargin = 375 / (dataX.length * 2) + 3
		new Charts({
					type: 'bar',
					data: dataX,
					nodataBgcolor: '#edf0f5',
					bgColors: "#f7604f",
					cHeight: 100,//表格高度
					cWidth: "100%",//表格宽度
					bWidth: 20,//柱子宽度
					bMargin: bMargin,//柱子间距
					showYAxis: false,//是否显示Y轴
					xCaption: '',
					yCaption: '',
					canvasId: 'report_data'
		})
		new Charts({
				type: "ring",
				data: [chartData.event_use, chartData.event_remain],
				colors: ["#7158ec", "#fec312"],
				canvasId: 'course_data',
				point: {
						x: 100,
						y: 100
				},
				radius : 50
		})
	},
	onLoad(options) {
		const that = this
		const data = this.data
		let self = wx.getStorageSync('self')
		that.getRecordList(self)
	}
})
