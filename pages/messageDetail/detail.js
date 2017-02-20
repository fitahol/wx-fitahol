//health.js
import { formatTime } from '../../utils/util'
import Fetch from '../../utils/services.js'

Page({
	data: {
		messageDetail: {}
	},
	onLoad(options) {
		let that = this
		let messageID = options.message_id
		Fetch(`/notification/${messageID}/`).then(res => {
			that.setData({
				messageDetail: res.data
			})
		})
	}
})
