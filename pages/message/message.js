//health.js
import { formatTime } from '../../utils/util'
import Fetch from '../../utils/services.js'

Page({
	data: {
		messageList: {}
	},
	onShow(options) {
		let that = this
		Fetch('/notification/').then(res => {
			that.setData({
				messageList: res.data
			})
		})
	}
})
