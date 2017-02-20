//health.js
import Fetch from '../../utils/services.js'
import $storage from '../../utils/storage'

Page({
	data: {
		remain: 0,
		userID: ""
	},
	onLoad(options) {
		let that = this
		this.setData({
			remain: options.remain || 0,
			amount: options.amount || 0,
			userID: options.user_id
		})
	},
	changeCourse(e) {
		this.setData({
			remain: e.detail.value
		})
	},
	confirmForm(e){
		let that = this
		const submitInfo =  e.detail.value
		submitInfo.user_id = this.data.userID
		let event_id = wx.getStorageSync("event_id")
		let event_state = wx.getStorageSync("event_state")
		Fetch('/schedule/course/', "POST", e.detail.value)
		.then(res => {
			if (res.statusCode >= 200 && res.statusCode < 300) {
				wx.redirectTo({
				url: `/pages/memberCourse/course?user_id=${this.data.userID}&event_id=${event_id}&event_state=${event_state}`
				})
			}
		})
	}
})
