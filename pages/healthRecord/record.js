//logs.js
import { formatTime } from '../../utils/util'
import Fetch from '../../utils/services.js'

Page({
	data: {
		recordList: [],
		userID: ''
	},
	delRecord(e) {
		let recordId = e.target.dataset.record
		let userID = this.data.userID
		wx.showModal({
			title: '删除记录',
			content: '是否确认删除？',
			success: function(res) {
				if (res.confirm) {
					Fetch(`/fitness/goal_record/${recordId}/?user_id=${userID}`, "DELETE").then(res => {
						console.log("delRecord", res.data)
						wx.redirectTo({
							url: `/pages/memberHealth/health?user_id=${userID}`
						})
					})
				}
			}
		})
	},
	onLoad(options) {
		let that = this
		let userID = options.user_id
		let fitGoalID = options.fit_goal_id
		Fetch(`/fitness/goal_record/?user_id=${userID}&fit_goal_id=${fitGoalID}`).then(res => {
			that.setData({
				recordList: res.data,
				userID: userID
			})
		})
	}
})
