//index.js
//获取应用实例
import Fetch from '../../utils/services.js'

var app = getApp()
Page({
	data: {
	},
	formSubmit(e){
		let that = this
		let self = wx.getStorageSync("self")
		let data = e.detail.value
		data.user_id = self
		Fetch(`/firmware/feedback/`, "POST", data).then(res => {
			wx.showModal({
				title: '提示',
				content: "提交成功",
				showCancel: false,
				success: function() {
					wx.navigateBack()
				}
			})
		})
	},
	onLoad: function () {
		let that = this
		let self = wx.getStorageSync("self")
		Fetch(`/account/profile/${self}/`).then(res => {
			that.setData({
				profile: res.data,
				genderIndex: res.data.gender
			})
		})
	}
})
