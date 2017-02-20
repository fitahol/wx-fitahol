//health.js
import Fetch from '../../utils/services.js'

Page({
	data: {
		vcodeText: '点击获取',
		second: 60,
		phone: '',
		vcode: '',
		profile: {}
	},
	onLoad(options) {
		let that = this
		let self = wx.getStorageSync('self')
		Fetch(`/account/profile/${self}/`).then(res => {
			that.setData({
				profile: res.data
			})
		})
	},
	countDown() {
		const that = this
		const second = this.data.second
		function getVcodeText() {
			if (second > 0) {
				that.setData({
					vcodeText: `已发送${second - 1}`,
					second: second - 1
				})
				that.countDown()
			} else {
				that.setData({
					vcodeText: '重新获取',
					phone: ''
				})
				clearTimeout(that.timerId)
			}
		}
		this.timerId = setTimeout(getVcodeText, 1000)
	},
	changePhone(e) {
		this.setData({
			phone: e.detail.value
		})
	},
	changeVcode(e) {
		this.setData({
			vcode: e.detail.value
		})
	},
	sendVcode(){
		const that = this
		const phone = that.data.phone
		const phoneR = /^1[3-8]\d{9}$/
		if (!phoneR.test(phone)) {
			wx.showModal({
				title: '提示',
				content: '请输入正确的手机号码',
				showCancel: false
			})
			return
		}
		Fetch(
			'/firmware/valid_code/',
			'GET',
			{account: phone, v_type: "reset_phone"}
		).then(res => {
			if (res.statusCode >= 200 && res.statusCode < 300) {
				that.countDown()
			}
			wx.showModal({
				title: '提示',
				content: res.data.detail,
				showCancel: false
			})
		})
	},
	confirmBind(e){
		let that = this
		const submitInfo =  e.detail.value
		const phoneR = /^1[3-8]\d{9}$/
		const vcodeR = /^\s+$/
		if (!phoneR.test(submitInfo.account)) {
			wx.showModal({
				title: '提示',
				content: '请输入正确的手机号码',
				showCancel: false
			})
			return
		} else if (!this.timerId) {
			wx.showModal({
				title: '提示',
				content: '请先获取验证码',
				showCancel: false
			})
			return
		} else if (vcodeR.test(submitInfo.valid_code) || !submitInfo.valid_code) {
			wx.showModal({
				title: '提示',
				content: '请输入验证码',
				showCancel: false
			})
			return
		}

		Fetch(`/account/reset_phone/`, "POST", e.detail.value)
		.then(res => {
			// wx.showModal({
			// 	title: '提示',
			// 	content: res.data.detail,
			// 	showCancel: false
			// })
			if (res.statusCode >= 200 && res.statusCode < 300) {
				wx.redirectTo({
					url: '/pages/account/account'
				})
			}
		})
	}
})
