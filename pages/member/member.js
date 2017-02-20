//logs.js
import { formatTime } from '../../utils/util'
import Fetch from '../../utils/services.js'

Page({
	data: {
		memberList: [],
		new_req_num: 0
	},
	getAddMember() {
		const that = this
		Fetch('/account/member/').then(res => {
			const data = res.data || {}
			const memberList = data.results || []
			const letterData = []
			memberList.forEach((item, index) => {
				if (letterData.indexOf(item.first_letter) !== -1) {
					item.first_letter = ''
				} else {
					letterData.push(item.first_letter)
				}
			})
			that.setData({
				memberList,
				new_req_num: data.new_req_num
			})
		})
	},
	onLoad() {
		const that = this
		wx.getStorage({
			key: 'add_member_success',
			fail: (res) => {
				that.getAddMember()
			}
		})
	},
	onShow(){
		const that = this
		wx.getStorage({
			key: 'add_member_success',
			success: (res) => {
				that.getAddMember()
				wx.removeStorage('add_member_success')
			}
		})
	}
})
