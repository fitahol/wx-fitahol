//course.js
// import { formatTime } from '../../utils/util'
import Fetch from '../../utils/services.js'
import $storage from '../../utils/storage'

Page({
	data: {
		user_id: '',
		event_id: '',
		event_state: '',
		eventData: {},
		courseRecord: [],
		lastInfo: {},
		healthURL: '',
		purchasedData: {},
		editorWeight: 0,
		editorTimes: 0,
		editorId: -1
	},
	handleWeightChange(e) {
		if (editorWeight < 0) {
			wx.showToast({
				title: '不能更少了哦',
				icon: 'warn',
				duration: 1000
			})
			return
		}
		const editorWeight = e.detail.value
		const editorTimes = e.target.dataset.times
		this.setData({
			editorId: e.target.dataset.id,
			editorWeight,
			editorTimes
		})
	},
	reduceWeight(e) {
		const weight = this.data.editorWeight || +e.target.dataset.weight
		if (weight < 1) {
			wx.showToast({
				title: '不能更少了哦',
				icon: 'warn',
				duration: 1000
			})
			return
		}
		this.setData({
			editorId: e.target.dataset.id,
			editorWeight: weight - 1,
			editorTimes: e.target.dataset.times
		})
	},
	addWeight(e) {
		const weight = this.data.editorWeight || +e.target.dataset.weight
		this.setData({
			editorId: e.target.dataset.id,
			editorWeight: weight + 1,
			editorTimes: e.target.dataset.times
		})
	},
	handleTimesChange(e) {
		this.setData({
			editorId: e.target.dataset.id,
			editorWeight: e.target.dataset.weight,
			editorTimes: e.detail.value
		})
	},
	reduceTimes(e) {
		const times = this.data.editorTimes || +e.target.dataset.times
		if (times < 1) {
			wx.showToast({
				title: '不能更少了哦',
				icon: 'warn',
				duration: 1000
			})
			return
		}
		this.setData({
			editorId: e.target.dataset.id,
			editorWeight: e.target.dataset.weight,
			editorTimes: times -1
		})
	},
	addTimes(e) {
		const times = this.data.editorTimes || +e.target.dataset.times
		this.setData({
			editorId: e.target.dataset.id,
			editorWeight: e.target.dataset.weight,
			editorTimes: times - 1
		})
	},
	resetModify() {
		this.setData({
			editorId: -1,
			editorTimes: 0,
			editorWeight: 0
		})
	},
	confirmModify() {
		const userID = this.data.user_id
		const eventID = this.data.event_id
		const id = this.data.editorId
		const weight = this.data.editorWeight
		const times = this.data.editorTimes
		Fetch(
			`/fitness/exercise_record/${id}/?user_id=${userID}&event_id=${eventID}`,
			'PUT',
			{
				number: weight,
				value: times
			}
		).then((res) => {
			console.log('confirmModify',res.data)
		})
		this.resetModify()
	},
	cancelModify() {
		this.resetModify()
	},
	deleteItemAction(e) {
		const that = this
		const user_id = this.data.user_id
		const event_id = this.data.event_id
		const id = e.target.dataset.id || this.data.editorId
		function confirmDelete() {
			Fetch(
				`/fitness/exercise_record/${id}/?user_id=${user_id}&event_id=${event_id}`,
				'DELETE'
			).then((res) => {
				if (res.statusCode >= 200 && res.statusCode < 300) {
					that.getExerciseList(user_id, event_id)
				}
			})
		}
		wx.showModal({
			title: '提示',
			content: '是否确认删除此动作',
			success(res) {
				if (res.confirm) {
					confirmDelete()
				}
			}
		})
	},
	redirectHistory(e){
		wx.navigateTo(
			{ url: `/pages/courseRecord/course?user_id=${this.data.user_id}` }
		)
	},
	addCourse(e) {
		wx.navigateTo(
			{ url: `/pages/addCourse/course?user_id=${this.data.user_id}&remain=${this.data.purchasedData.remain}&&amount=${this.data.purchasedData.amount}` }
		)
	},
	getExerciseList(user_id, event_id) {
		// 课程列表
		const that = this
		Fetch(
			`/fitness/exercise_record/?user_id=${user_id}`,
			'GET',
			{ event_id }
		).then((res) => {
			that.setData({
				courseRecord: res.data
			})
		})
	},
	confirmDelete(eventID) {
		Fetch(`/schedule/event/${eventID}/`, 'DELETE')
		.then((res) => {
			$storage.async.set('event_change', '1')
			wx.navigateBack({delta: 0})
			// wx.navigateTo({"url": "/pages/fitahol/fitahol"})
		})
	},
	deleteCourse(e) {
		const that = this
		const eventID = e.target.dataset.id
		wx.showModal({
			title: '提示',
			content: "确认删除？",
			success: function(res) {
				if (res.confirm) {
					that.confirmDelete(eventID)
				}
			}
		})
	},
	finishCourse(e){
		const that = this
		const eventID = e.target.dataset.id
		Fetch(`/schedule/event/${eventID}/state/`, "PUT", {"state": 1})
		.then((res) => {
			that.setData({
				event_state: "1"
			})
			wx.showModal({
				title: '提示',
				content: "结课成功",
				showCancel: false,
				success: function(res) {
					$storage.async.set('event_change', '1')
					// wx.navigateTo({"url": "/pages/fitahol/fitahol"})
					wx.navigateBack({delta: 0})
				}
			})
		})
	},
	onLoad(options) {
		const that = this
		const user_id = options.user_id || wx.getStorageSync('user_id')
		const event_id = options.event_id || wx.getStorageSync('event_id')
		const event_state = options.event_state || wx.getStorageSync('event_state')
		const healthURL = `/pages/memberHealth/health?user_id=${user_id}`
		Fetch(`/schedule/event/${event_id}/`,)
		.then((res) => {
			that.setData({ eventData: res.data })
		})
		this.setData({ user_id, event_id, event_state })
		// 课程列表
		this.getExerciseList(user_id, event_id)
		// 最近健身记录
		Fetch(`/fitness/fit_goal/last/?user_id=${user_id}`,)
		.then((res) => {
			res.data.healthURL = healthURL
			that.setData({
				lastInfo: res.data
			})
		})
		// 已购课程记录
		Fetch(`/schedule/course/purchased/?user_id=${user_id}`,)
		.then((res) => {
			const purchasedData = res.data
			purchasedData.alreadyCourse = purchasedData.amount - purchasedData.remain
			that.setData({ purchasedData })
		})
	},
	onReady(){
		const start = this.data.eventData.start.substr(5, 11) || ''
		const end = this.data.eventData.end.substr(11, 5) || ''
		wx.setNavigationBarTitle({
			title: `课程: ${start}至${end}`
		})
	},
	onShow(){
		const that = this
		const data = this.data
		const user_id = this.data.user_id || wx.getStorageSync('user_id')
		const event_id = this.data.event_id || wx.getStorageSync('event_id')
		wx.getStorage({
			key: 'change_exercise_record',
			success: (res) => {
				this.getExerciseList(user_id, event_id)
				$storage.async.remove('change_exercise_record')
			}
		})
	}
})
