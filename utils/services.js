const URI = 'https://api.fitahol.com'
import Promise from '../libs/promise'

function codeHandle(code, data) {
	if (code >= 500) {
		wx.showModal({
			title: '提示',
			content: '服务器出现故障,请耐心等待',
			showCancel: false
		})
	} else if (code === 400) {
		wx.showModal({
			title: '提示',
			content: data.detail || '请求参数错误',
			showCancel: false
		})
	} else if (code === 401) {
		wx.showModal({
			title: '提示',
			content: data.detail || '身份登录异常',
			showCancel: false,
			success(res) {
				if (res.confirm) {
					console.log(res.confirm)
				}
			}
		})
	} else if (code === 403) {
		wx.showModal({
			title: '提示',
			content: data.detail || '用户权限不足',
			showCancel: false
		})
	}  else if (code === 404) {
		wx.showModal({
			title: '提示',
			content: data.detail || '访问资源不存在',
			showCancel: false
		})
	} else if (code === 410) {
		wx.showModal({
			title: '提示',
			content: data.detail || '资源丢失',
			showCancel: false,
			success(res) {
				if (res.confirm) {
					console.log(res.confirm)
					// 需刷新处理
					// wx.navigateTo({
					//   url: '../fitahol/fitahol'
					// })
				}
			}
		})
	} else {
		if (data.detail) {
			wx.showModal({
				title: '提示',
				content: data.detail,
				showCancel: false
			})
		}
	}
}

export default function fetch(url, method, data) {
	return new Promise((resolve, reject) => {
		let customHeaders = {
			'Accept': 'application/json',
			'content-type': 'application/json'
		}
		const token = wx.getStorageSync('token')
		if (token) {
			customHeaders.Authorization = `Token ${token}`
		}
		data = data || {}
		const self = wx.getStorageSync('self')
		if (self) { data.self = self }
		// const user_id = wx.getStorageSync('user_id')
		// if (user_id) { data.user_id = user_id }
		let reqUrl = `${URI}${url}`
		if ( url.indexOf("http") >= 0) {
			reqUrl = url
		}
		wx.request({
			url: reqUrl,
			method: method || "GET",
			data,
			header: customHeaders,
			success: (res) => {
				const statusCode = res.statusCode
				if (statusCode < 200 || statusCode > 300) {
					codeHandle(statusCode, res.data)
					return
				}
				resolve(res)
			},
			fail: reject
		})
	})
}
