
export default {
	async: {
		// 异步
		get(key, cb) {
			wx.getStorage({
				key,
				success: (res) => {
					if (res.data && cb) cb(res.data)
				}
			})
		},
		set(key, value) {
			wx.setStorage({
				key,
				data: value
			})
		},
		remove(key) {
			wx.removeStorage({
				key,
				success: (res) => {
					return res.data
				}
			})
		}
	},
	sync: {
		// 同步
		get(key, cb) {
			try {
				const value = wx.getStorageSync(key)
				if (value && cb) cb(value)
			} catch (e) {
				console.log('sync get error', e)
			}
		},
		set(key, value) {
			try {
				wx.setStorageSync(key, value)
			} catch (e) {
				console.log('sync set error', e)
			}
		},
		remove(key) {
			try {
				wx.removeStorageSync('key')
			} catch (e) {
				console.log('sync remove error', e)
			}
		}
	}
}
