//index.js
//获取应用实例
import Fetch from '../../utils/services.js'

var app = getApp()
Page({
	data: {
		profile: {}
	},
	//事件处理函数
	bindViewTap() {
		wx.navigateTo({
			url: '/pages/profile/profile'
		})
	},
	onShow() {
		const that = this
		const self = wx.getStorageSync("self")
		Fetch(`/account/profile/${self}/`).then(res => {
			that.setData({
				profile: res.data
			})
		})
	}
})
