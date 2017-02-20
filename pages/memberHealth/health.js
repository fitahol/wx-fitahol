//health.js
import { formatTime } from '../../utils/util'
import Fetch from '../../utils/services.js'
import Charts from '../../libs/wxcharts'
import $storage from '../../utils/storage'

Page({
	data: {
		fitGoal: [],
		userID: '',
		eventURL: '',
		lastCourseInfo: {},
		lastFigure: {}
	},
	bindAddTap(){
		wx.navigateTo({
			url: `/pages/fitGoal/fitGoal?user_id=${this.data.userID}`
		})
	},
	enterTakeFigure() {
		wx.navigateTo({
			url: `/pages/takeFigure/takeFigure?user_id=${this.data.userID}`
		})
	},
	addNewRecord(e){
		let goal_id = e.target.dataset.goal
		wx.navigateTo({
			url: `/pages/addRecord/record?user_id=${this.data.userID}&fit_goal_id=${goal_id}`
		})
	},
	getFigure(userID) {
		const that = this
		const user_id = userID || this.data.userID
		Fetch(`/account/figure/?user_id=${user_id}&page_size=3`).then((res) => {
			const lastFigure = res.data || []
			if (lastFigure.results.length) {
				for (let i = lastFigure.results.length; i < 3; i++) {
					lastFigure.results.push({})
				}
			}
			that.setData({
				lastFigure
			})
		})
	},
	drawCanvas(fitGoal) {
		fitGoal.forEach(item => {
			let dataX = []
			item.goal_record.forEach(each => dataX.push(`${each.cdate},${each.current}`))
			let bwidth = 375 / (item.goal_record.length * 2) + 3
			new Charts({
						 type: 'bar',
						 data: dataX,
						 bgColors: "#f7604f",
						 cHeight: 100,//表格高度
						 cWidth: "100%",//表格宽度
						 bWidth: 20,//柱子宽度
						 bMargin: bwidth,//柱子间距
						 showYAxis: false,//是否显示Y轴
						 xCaption: '',
						 yCaption: '',
						 canvasId: `healthChart_${item.id}`
			})
		})
	},
	getInit(userID) {
		const that = this
		// 获取身体变化数据记录
		Fetch(`/fitness/fit_goal/?user_id=${userID}`).then(res => {
			that.setData({
				fitGoal: res.data
			})
			that.drawCanvas(res.data)
		})
		// 获取最近课程数据
		Fetch(`/schedule/event/last/?user_id=${userID}`).then(res => {
			let eventURL = "/pages/courseRecord/course?user_id=" + userID
			if ( res.data ) {
				eventURL = `/pages/memberCourse/course?user_id=${userID}&event_id=${res.data.id}`
			}
			that.setData({
				lastCourseInfo: res.data,
				eventURL: eventURL
			})
		})
		// 获取照片墙
		this.getFigure(userID)
	},
	onLoad(options) {
		const that = this
		const userID = options.user_id
		that.setData({ userID })
		this.getInit(userID)
	},
	onShow(){
		const that = this
		const data = this.data
		wx.getStorage({
			key: 'change_record',
			success: (res) => {
				that.getInit(data.userID)
				$storage.async.remove('change_record')
			}
		})
	}
})
