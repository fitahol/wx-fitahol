//app.js
import Fetch from 'utils/services.js'

function wxlogin(that, cb){
	wx.login({
		success(res) {
			const code = res.code
			wx.getUserInfo({
				success(res) {
					that.globalData.userInfo = res.userInfo
					res.userInfo.code = code
					res.userInfo.u_type = 1
					let data = res.userInfo
					Fetch('/wechat/wx/', 'POST', data)
					.then(res => {
						wx.setStorageSync('token', res.data.token)
						that.globalData.token = res.data.token
						wx.setStorageSync('self', res.data.user_id)
						that.globalData.self = res.data.user_id
						that.globalData.gym = res.data.gym || ''
						wx.setStorageSync('gym', res.data.gym || '')
						typeof cb == 'function' && cb(that.globalData.userInfo)
					})
				}
			})
		},
		fail(res) {
			console.log('fail', res)
		}
	})
}

App({
	onLaunch() {
		console.log('app Launching ...')
		// if(!this.globalData.token) {
		// 	wxlogin(this)
		// }
	},
	getUserInfo(cb) {
		const that = this
		// wxlogin(that, cb)
		if(this.globalData.userInfo) {
			typeof cb == 'function' && cb(this.globalData.userInfo)
		} else {
			//调用登录接口
			wxlogin(that, cb)
		}
	},
	globalData: {
		userInfo: null
	}
})
