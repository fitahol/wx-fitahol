//index.js
//获取应用实例
import Fetch from '../../utils/services'
import $storage from '../../utils/storage'
import { formatDate, toDou, parseDate } from '../../utils/util'

const app = getApp()
Page({
	data: {
		userID: '',
		self: '',
		startDate: '',
		startTime: '08:00',
		endDate: '',
		endTime: '08:00',
		ruleInfo: [], // 重复规则
		ruleResult: '一次',
		ruleIndex: 0,
		hasClickRepeatRule: false,
		endRepeatDate: '',
		repeatTimes: 0,
		chooseWeekInfo: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
		enWeekCustom: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],
		enWeekCustomClass: [],
		chooseWeekIndex: [],
		courseDesc: ''
	},
	// 开始日期
	bindStartDateChange(e) {
		this.setData({
			startDate: formatDate(e.detail.value)
		})
	},
	bindStartTimeChange(e) {
		this.setData({
			startTime: e.detail.value
		})
	},
	// 结束日期
	bindEndDateChange(e) {
		this.setData({
			endDate: formatDate(e.detail.value)
		})
	},
	bindEndTimeChange(e) {
		this.setData({
			endTime: e.detail.value
		})
	},
	// 结束重复日期
	endRepeatDateChange(e) {
		this.setData({
			endRepeatDate: formatDate(e.detail.value)
		})
	},
	// 重复规则
	getRuleInfo() {
		const that = this
		const data = this.data
		Fetch(`/schedule/rule/?user_id=${data.self}`)
		.then((res) => {
			res.data.unshift({
				id: 0,
				name: '一次'
			})
			that.setData({ ruleInfo: res.data })
		})
	},
	handleClickRule() {
		this.setData({
			hasClickRepeatRule: !this.data.hasClickRepeatRule
		})
	},
	handleRuleItem(e) {
		this.setData({
			ruleIndex: +e.target.dataset.rule,
			ruleResult: this.data.ruleInfo[e.target.dataset.rule].name
		})
		this.handleClickRule()
	},
	changeRepeatTimes(e) {
		this.setData({
			repeatTimes: e.detail.value
		})
	},
	// 重复星期
	chooseWeekRepeat(e) {
		const data = this.data
		const chooseWeek = e.target.dataset.week || ''
		let chooseIndexResult = data.chooseWeekIndex
		const chooseIndex = data.enWeekCustom.indexOf(chooseWeek)
		if (!~chooseIndexResult.indexOf(chooseIndex)) {
			chooseIndexResult = chooseIndexResult.concat(chooseIndex)
			chooseIndexResult.sort()
		} else {
			chooseIndexResult = chooseIndexResult.filter((item) => {
				return item !== chooseIndex
			})
		}
		let enWeekCustomClass = data.enWeekCustomClass || []
		data.enWeekCustom.forEach((item, index) => {
			enWeekCustomClass[index] = 'cancel-btn'
		})
		chooseIndexResult.forEach((item) => {
			enWeekCustomClass[item] = 'confirm-btn'
		})
		this.setData({
			chooseWeekIndex: chooseIndexResult,
			enWeekCustomClass
		})
	},
	// 课程文字说明
	handleCourseDesc(e) {
		this.setData({
			courseDesc: e.detail.value
		})
	},
	// 新建课程提交
	buildCourseConfirm() {
		const that = this
		const data = that.data
		function formatPostDate(info) {
			let result = info.replace(/年|月/g, '-')
			result = result.replace(/日/g, '')
			return result
		}
		let custom = ''
		data.chooseWeekIndex.forEach((item) => {
			custom += `,${data.enWeekCustom[item]}`
		})
		// 新建课程校验
		const start = `${formatPostDate(data.startDate)} ${data.startTime}:00`
		const end = `${formatPostDate(data.endDate)} ${data.endTime}:00`
		const timesArea = +(parseDate(end) - parseDate(start)) / 3600000
		console.log("timesArea", timesArea)
		const numberR = /^\d+$/

		if (!~['00', '30'].indexOf(data.startTime.split(':')[1])) {
			wx.showModal({
				title: '课程开始时间请重新选择半点或整点',
				showCancel: false
			})
			return
		} else if (!numberR.test(timesArea)) {
			wx.showModal({
				title: '请选择1-3小时整数课时',
				showCancel: false
			})
			return
		} else if (!~['00', '30'].indexOf(data.endTime.split(':')[1])) {
			wx.showModal({
				title: '课程结束时间请重新选择半点或整点',
				showCancel: false
			})
			return
		} else if (data.ruleIndex && !data.repeatTimes && !data.endRepeatDate) {
			wx.showModal({
				title: '请选择重复日期或者重复次数',
				showCancel: false
			})
			return
		}

		const params = {
			user_id: 0,
			rule_id: data.ruleIndex || 0,
			coach: data.self,
			start,
			end,
			times: data.repeatTimes,
			calendar_slug: 'rest',
			description: data.courseDesc,
			color_event: '#000000',
			end_recurring_period: `${formatPostDate(data.endRepeatDate)}`,
			custom
		}
		Fetch(
			'/schedule/event/',
			'POST',
			params
		)
		.then((res) => {
			if (res.statusCode >= 200 && res.statusCode < 300) {
				$storage.async.set('event_change', '1')
				// wx.navigateTo({ url: '/pages/fitahol/fitahol' })
				wx.navigateBack({delta: 0})
			}
		})
	},
	// 重置数据状态
	resetData() {
		this.setData({
			hasClickRepeatRule: false
		})
	},
	onLoad() {
		const that = this
		const data = this.data
		let enWeekCustomClass = data.enWeekCustomClass
		data.enWeekCustom.forEach((item, index) => {
			enWeekCustomClass[index] = 'cancel-btn'
		})
		this.setData({ enWeekCustomClass })
		this.resetData()
		const self = wx.getStorageSync('self')
		const nowDateInfo = wx.getStorageSync('nowDateInfo')
		console.log(nowDateInfo)
		that.setData({ self })
		// 调用应用实例的方法获取全局数据
		// 获取新建课程日期或本地
		const year = +nowDateInfo.year
		const month = +nowDateInfo.month
		const day = +nowDateInfo.day
		const hour = +nowDateInfo.hour
		const date = `${year}年${month}月${day}日`
		// const endRepeatDate = `${year}年${month + 1}月${day}日`
		const startTime = `${toDou(hour)}:00`
		const endTime = `${toDou(hour + 1)}:00`
		that.setData({
			startDate: date,
			startTime,
			endDate: date,
			endTime
			// endRepeatDate
		})
		this.getRuleInfo()
		$storage.async.remove('event_change')
	}
})
