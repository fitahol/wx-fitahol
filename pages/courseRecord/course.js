//health.js
import { formatTime } from '../../utils/util'
import Fetch from '../../utils/services.js'

Page({
	data: {
		courseList: {}
	},
	onLoad(options) {
		let that = this
		let userID = options.user_id
		Fetch(`/schedule/event/?user_id=${userID}`).then(res => {
			res.data.forEach(each=>{
				each.start = each.start.substr(0, each.start.length - 3) || ''
				each.end = each.end.substr(11, 5) || ''
			})
			that.setData({
				courseList: res.data
			})
		})
	}
})
