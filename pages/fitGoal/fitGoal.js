//logs.js
import { formatTime } from '../../utils/util'
import Fetch from '../../utils/services.js'

Page({
	data: {
		fitGoal: {},
		goalID: '',
		userID: ''
	},
	delFitGoal(e) {
		const data = this.data
		let fitGoalID = e.target.dataset.fitgoalid
		wx.showModal({
			title: '提示',
			content: "确认删除？",
			showCancel: false,
			success: function() {
				Fetch(`/fitness/fit_goal/${fitGoalID}?user_id=${data.userID}`, "DELETE").then(res => {
					wx.redirectTo({
						url: `/pages/memberHealth/health?user_id=${this.data.userID}`
					})
				})
			}
		})
	},
	formSubmit(e) {
		const data = this.data
		const fitGoal = data.fitGoal
		let methoadInfo = 'POST'
		let APIURL = '/fitness/fit_goal/'
		if (data.goalID) {
			methoadInfo = 'PUT'
			APIURL = `/fitness/fit_goal/${this.data.goalID}/`
		}
		const req_data = e.detail.value
		req_data.name = req_data.name || fitGoal.name
		req_data.measure = req_data.measure || fitGoal.measure
		req_data.goal = req_data.goal || fitGoal.goal
		req_data.desc = req_data.desc || fitGoal.desc
		const user_id = data.userID
		req_data.user_id = user_id
		const nameRem = /^[\u4e00-\u9fa5]+$/
		const number = /^\d+$/
		// const letter = /^[a-z]+|[\u4e00-\u9fa5]+$/i
		if (!nameRem.test(req_data.name)) {
			wx.showModal({
				title: '目标名称输入有误',
				showCancel: false
			})
			return
		} else if (!number.test(req_data.goal)) {
			wx.showModal({
				title: '目标数值输入有误',
				showCancel: false
			})
			return
		}
		Fetch(APIURL, methoadInfo, req_data).then(res => {
			wx.redirectTo({
				url: `/pages/memberHealth/health?user_id=${data.userID}&fit_goal_id=${data.goalID}`
			})
			// wx.showModal({
			// 	title: '提示',
			// 	content: "修改成功",
			// 	showCancel: false
			// })
		})
	},
	onLoad(options) {
		let that = this
		let userID = options.user_id
		let goalID = options.fit_goal_id
		if (userID) {
			that.setData({ userID })
		}
		if (goalID) {
			Fetch(`/fitness/fit_goal/${goalID}/?user_id=${userID}`).then(res => {
				that.setData({
					fitGoal: res.data,
					goalID
				})
			})
		}
	}
})
