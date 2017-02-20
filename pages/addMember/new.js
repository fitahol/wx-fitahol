import { formatTime } from '../../utils/util'
import Fetch from '../../utils/services.js'
import $storage from '../../utils/storage'

Page({
	data: {
		relationList: {},
		inputShowed: false,
		inputVal: '',
		searchResult: []
	},
	showInput() {
		this.setData({
				inputShowed: true
		});
	},
	hideInput() {
			this.setData({
					inputVal: '',
					inputShowed: false
			})
	},
	clearInput() {
			this.setData({
					inputVal: '',
					searchResult: []
			})
	},
	inputTyping(e) {
			this.setData({
					inputVal: e.detail.value
			})
	},
	getRelation() {
		const that = this
		Fetch('/account/relation/').then(res => {
			that.setData({
				relationList: res.data
			})
		})
	},
	relationConfirm(e) {
		const that = this
		const data = e.target.dataset
		const relation_id = data.relation
		const formId = e.detail.formId
		Fetch(
			`/account/relation/${relation_id}/`,
			"POST",
			{
				status: data.status,
				formId
			}
		).then(res => {
			wx.showModal({
				title: '提示',
				content: res.data.detail,
				showCancel: false,
				success: (res) => {
					if (res.confirm) {
						that.getRelation()
					}
				}
			})
		})
	},
	addRelation(e) {
		const that = this
		const data = e.target.dataset || {}
		const req_user = data.user
		Fetch('/account/relation/', "POST", {user_id: req_user}).then(res => {
			wx.showModal({
				title: '提示',
				content: res.data.detail,
				showCancel: false,
				success: (res) => {
					if (res.confirm) {
						$storage.sync.set('add_member_success', '1')
						that.setData({searchResult: []})
						that.getRelation()
						// wx.navigateTo({
						// 	url: '/pages/member/member'
						// })
						// wx.navigateBack({delta: 0})
					}
				}
			})
		})
	},
	searchSubmit(e) {
		const query = e&&e.detail.value.query
		const that = this
		Fetch(`/account/member/?query=${query}`).then(res => {
			if (res.data.results.length <=0) {
				wx.showModal({
					title: '提示',
					content: "该学员不存在哟〜",
					showCancel: false
				})
			}
			that.setData({
				searchResult: res.data.results
			})
		})
	},
	onLoad() {
		this.getRelation()
	}
})
