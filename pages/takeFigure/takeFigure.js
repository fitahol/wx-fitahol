import Fetch from '../../utils/services'
import $storage from '../../utils/storage'

Page({
	data: {
		userID: '',
		cdate: '',
		fileSrc: '',
		backPage: ''
	},
	chooseImage() {
		const that = this
		const data = this.data
		wx.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				const tempFilePaths = res.tempFilePaths
				that.setData({
					fileSrc: tempFilePaths[0]
				})
			}
		})
	},
	previewImage(e) {
		wx.previewImage({
			 current: e.currentTarget.id, // 当前显示图片的http链接
			 urls: this.data.fileList // 需要预览的图片http链接列表
	 })
	},
	changeCdate(e) {
		this.setData({
			cdate: e.detail.value
		})
	},
	formSubmit(e) {
		const that = this
		const desc = e.detail.value.desc
		const data = this.data
		const fileSrc = data.fileSrc
		const token = wx.getStorageSync('token')
		const URI = 'https://api.fitahol.com'

		if (!data.cdate) {
			wx.showModal({
				title: '提示',
				content: '请选择记录日期',
				showCancel: false
			})
			return
		} else if (!fileSrc) {
			wx.showModal({
				title: '提示',
				content: '请选择所需上传的图片',
				showCancel: false
			})
			return
		}

		wx.uploadFile({
			url: `${URI}/account/figure/`,
			filePath: fileSrc,
			header: {
				'Authorization': `Token ${token}`
			},
			name: 'figure_file',
			formData:{
				user_id: data.userID,
				figure_file: fileSrc,
				cdate: data.cdate,
				desc
			},
			success: (res) => {
				$storage.async.set('change_record', 1)
				wx.navigateBack()
			},
			fail: (res) => {
				console.log('fail', res)
			}
		})
	},
	onLoad(options) {
		const that = this
		const backPage = options.pagename
		const userID = options.user_id
		const data = this.data
		const self = wx.getStorageSync('self')
		const cdate = new Date().toISOString().slice(0, 10)
		this.setData({ self, userID, cdate, backPage})
	}
})
