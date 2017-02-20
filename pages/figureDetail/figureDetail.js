import Fetch from '../../utils/services'
import $storage from '../../utils/storage'

Page({
	data: {
		userID: '',
		self: '',
		figureDetail: {}
	},
	getFigureDetail(userID, url) {
		const figureDetailReults = this.data.figureDetail.results || []
		const user_id = userID || this.data.userID
		const fetchUrl = url || `/account/figure/?user_id=${userID}&page_size=6`
		//  获取照片详情
		Fetch(fetchUrl).then((res) => {
			const figureDetail = res.data
			figureDetail.results = figureDetailReults.concat(res.data.results)
			this.setData({ figureDetail })
		})
	},
	upper(e) {
		const figureDetail = this.data.figureDetail
		const previous = figureDetail.previous
		// if (previous) {
		// 	this.getFigureDetail(this.data.userID, figureDetail.previous)
		// }
	},
	lower(e) {
		const figureDetail = this.data.figureDetail
		const next = figureDetail.next
		if (next) {
			this.getFigureDetail(this.data.userID, figureDetail.next)
		}
	},
	delete(userID, figureId) {
		const that = this
		this.setData({figureDetail: []})
		Fetch(`/account/figure/${figureId}/`, 'DELETE', {'user_id': userID})
		.then((res) => {
			that.getFigureDetail(userID)
		})
	},
	deleteFigure(e) {
		const that = this
		const userID = that.data.userID
		const figureId = e.target.dataset.id
		wx.showModal({
			title: '提示',
			content: '确认删除这张照片吗？',
			success: (res) => {
				if (res.confirm) {
					$storage.async.set('change_record', 1)
					that.delete(userID, figureId)
				}
			}
		})
	},
	onLoad(options) {
		const that = this
		const userID = options.user_id
		const data = this.data
		const self = wx.getStorageSync('self')
		this.setData({ self, userID})
		this.getFigureDetail(userID)
	},
	onShow(){
		const that = this
		const data = this.data
		this.setData({figureDetail: []})
		wx.getStorage({
			key: 'change_record',
			success: (res) => {
				this.getFigureDetail(data.userID)
				wx.removeStorageSync("change_record")
			}
		})
	}
})
