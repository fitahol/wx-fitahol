import Fetch from '../../utils/services.js'

Page({
	data: {
		fitGoal: {},
		fitGoalID: '',
		cdate: '',
		userID: ''
	},
	bindDateChange(e) {
		this.setData({
			cdate: e.detail.value
		})
	},
	formSubmit(e) {
		let req_data = e.detail.value
		req_data.user = this.data.userID
		req_data.fit_goal = this.data.fitGoalID
		Fetch(`/fitness/goal_record/`, "POST", req_data).then(res => {
			wx.redirectTo({
				url: `/pages/memberHealth/health?user_id=${this.data.userID}&fit_goal_id=${this.data.goalID}`
			})
			// wx.showModal({
			// 	title: '提示',
			// 	content: "添加成功",
			// 	showCancel: false
			// })
		})
	},
	onLoad(options) {
		let cdate = new Date()
		let that = this
		let userID = options.user_id
		let fitGoalID = options.fit_goal_id
		Fetch(`/fitness/fit_goal/${fitGoalID}/?user_id=${userID}`).then(res => {
			that.setData({
				fitGoal: res.data,
				fitGoalID: fitGoalID,
				userID: userID,
				cdate: cdate.toISOString().substring(0, 10)
			})
		})
	}
})
