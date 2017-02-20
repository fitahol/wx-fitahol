//addAction.js
import Fetch from '../../utils/services.js'
import $storage from '../../utils/storage'

Page({
	data: {
		user_id: '',
		event_id: '',
		categoryList: [],
		categoryChildList: [],
		editorItem: {}, //  子分类正在编辑项
		category_id: 1, //主分类id
		drawerAnimation: {},
		editorWeight: '',
		editorTimes: ''
	},
	getCategoryChildList(e) {
		const that = this
		const category_id = e && e.target.dataset.categoryid || 1
		this.setData({ category_id })
		Fetch(`/fitness/exercise/?category_id=${category_id}`)
		.then((res) => {
			const categoryChildList = res.data
			const letterData = []
			categoryChildList.forEach((item) => {
				if (letterData.indexOf(item.first_letter) !== -1) {
					item.first_letter = ''
				} else {
					letterData.push(item.first_letter)
				}
			})
			that.setData({ categoryChildList })
		})
		this.toggleDrawer(0)
	},
	toggleDrawer(dis) {
		const animation = wx.createAnimation({
			duration: 700,
			timingFunction: 'ease',
		})
		this.animation = animation

		animation.translate(dis, 0).step()

		this.setData({
			drawerAnimation: animation.export()
		})
	},
	showDrawer() {
		this.toggleDrawer('-100%')
	},
	hideDrawer(e) {
		const editorstatus = e && e.target.dataset.editorstatus
		editorstatus && this.toggleDrawer(0)
	},
	showChangeAction(e) {
		const editorItem = e.target.dataset
		this.setData({ editorItem })
		this.showDrawer()
	},
	changeWeight(e) {
		const editorWeight = e.detail.value
		this.setData({ editorWeight })
	},
	changeTimes(e) {
		const editorTimes = e.detail.value
		this.setData({ editorTimes })
	},
	addAction() {
		const data = this.data
		const editorWeight = data.editorWeight
		const editorTimes = data.editorTimes
		if (!editorWeight) {
			wx.showToast({
				title: '请补全重量哟!',
				icon: 'warn',
				duration: 1000
			})
			return
		} else if (!editorTimes) {
			wx.showToast({
				title: '次数未补全哟！',
				icon: 'warn',
				duration: 1000
			})
			return
		}
		Fetch(
			'/fitness/exercise_record/',
			'POST',
			{
				user_id: data.user_id,
				exercise_id: data.editorItem.actionid,
				event_id: data.event_id,
				value: editorWeight,
				number: editorTimes
			}
		)
		.then((res) => {
			if (res.statusCode >= 200 && res.statusCode < 300) {
				$storage.async.set('change_exercise_record', "1")
				wx.showToast({
					title: '添加成功',
					icon: "success",
					duration: 2000
				})
			}
		})
	},
	onLoad(options) {
		const that = this
		const user_id = options.user_id || wx.getStorageSync('user_id')
		const event_id = options.event_id || wx.getStorageSync('event_id')
		this.setData({ user_id, event_id })

		Fetch(`/fitness/category/?user_id=${user_id}`)
		.then((res) => {
			that.setData({ categoryList: res.data })
		})
		this.getCategoryChildList()
	}
})
