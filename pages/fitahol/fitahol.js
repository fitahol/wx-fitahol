//index.js
//获取应用实例
const app = getApp()
import moment from '../../libs/moment/moment'
import { fillDates, houtTitleList } from 'weekPicker/index'
import $storage from '../../utils/storage'
import { setDataFormat, toDou, parseDate } from '../../utils/util'
import Fetch from '../../utils/services'

Page({
	data: {
		self: '',
		currentWeekMount: moment(),
		nowDateInfo: '',
		weekTitleInfo: [],
		tapItem: {},
		fitaholData: [],
		EnglishWeekArr: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
		year: 0,
		month: 0,
		animateData: {},
		startX: 0,
		endX: 0,
		startY: 0,
		endY: 0,
		hourTitleInfo: houtTitleList(),
		backTodayStatus: false // 回到今天按钮是否显示
	},
	setYM() {
		const that = this
		$storage.async.get(
			'year',
			 year => {
				that.setData({ year })
			}
		)
		$storage.async.get(
			'month',
			month => {
				that.setData({ month })
			}
		)
	},
	backToday() {
		// 回到当前周
			fillDates(moment(), this)
	},
	judgBackToday(weekTitle) {
		const nowDateInfo = this.data.nowDateInfo
		const weekTitleInfo = weekTitle || this.data.weekTitleInfo
		const backTodayCompare = weekTitleInfo.filter((item) => {
			return item.year == nowDateInfo.year &&  item.month == nowDateInfo.month && item.day == nowDateInfo.day
		})
		if (!backTodayCompare.length) {
			this.setData({
				backTodayStatus: true
			})
		} else {
			this.setData({
				backTodayStatus: false
			})
		}
	},
	handleTouchstart(e) {
		const startX = e.changedTouches[0].clientX
		const startY = e.changedTouches[0].clientY
		this.setData({ startX, startY })
	},
	handleTouchend(e) {
		const endX = e.changedTouches[0].clientX
		const endY = e.changedTouches[0].clientY
		this.setData({ endX, endY })
		this.scheduleDirectionjudg()
	},
	touchAnimation(value) {
		const that = this
		const animation  = wx.createAnimation({
			duration: 700,
			timingFunction: 'ease',
		})
		this.animation = animation
		animation.translateX(value).step({ duration: 500 })
		this.setData({
			animateData: animation.export()
		})
		function animationEnd() {
			that.animation.translateX(0).step({ duration: 10 })
			that.setData({
				animateData: that.animation.export()
			})
		}
		setTimeout(animationEnd, 100)
	},
	scheduleDirectionjudg() {
		const animation = ''
		const distanceX = this.data.endX - this.data.startX
		const distanceY = this.data.endY - this.data.startY
		const angle = Math.atan2(distanceY, distanceX) * 180 / Math.PI
		// 1：向上，2：向下，3：向左，4：向右,0：未滑动
		let direction = 0
		if (Math.abs(distanceX) < 50 && Math.abs(distanceY) < 50) {
			return direction
		}
		if (angle >= -45 && angle < 45) {
			direction = 4
		} else if (angle >= 45 && angle < 135) {
			direction = 1
		} else if (angle >= -135 && angle < -45) {
			if (Math.abs(distanceY) > 150) {
				direction = 2
			}
		} else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
			direction = 3
		}
		if (direction === 4) {
			this.schedulePrev()
			this.touchAnimation(500)
		} else if (direction === 3) {
			this.scheduleNext()
			this.touchAnimation(-500)
		}
	},
	scheduleNext() {
		const data = this.data
		let tmpMoment = data.currentWeekMount
		tmpMoment = moment(tmpMoment).add(7, 'days')
		this.setData({
			currentWeekMount: tmpMoment
		})
		fillDates(tmpMoment, this)
		this.setYM()
	},
	schedulePrev() {
		const data = this.data
		let tmpMoment = data.currentWeekMount
		tmpMoment = moment(tmpMoment).subtract(7, 'days')
		this.setData({
			currentWeekMount: tmpMoment
		})
		fillDates(tmpMoment, this)
		this.setYM()
	},
	handleTapItem(e) {
		const tapItemData = e.target.dataset
		const yearInfo = tapItemData.year
		const monthInfo = tapItemData.month
		const dayInfo = tapItemData.day
		const hourInfo = tapItemData.hour
		$storage.async.set('year', yearInfo)
		$storage.async.set('month', monthInfo)
		$storage.async.set('day', dayInfo)
		$storage.async.set('hour', hourInfo)
		this.setData({
			tapItem: {
				year: yearInfo,
				month: monthInfo,
				day: dayInfo,
				hour: hourInfo
			}
		})
	},
	orderCourse(user, event_id, formId, handlestate) {
		const that = this
		// handlestate 值为1 结课， 值为 -1 拒绝申请，值为0 接受约课
		Fetch(
			`/schedule/event/${event_id}/state/`,
			'PUT',
			{
				state: handlestate,
				user_id: user,
				formId
			}
		).then((res) => {
			fillDates(that.data.currentWeekMount, that)
			// $storage.async.set('event_change', "1")
		})
	},
	enterCourse(e) {
		const that = this
		const user = e.target.dataset.user
		const event_id = e.target.dataset.id
		const event_state = e.target.dataset.state
		const start = e.target.dataset.start
		const end = e.target.dataset.end
		const formId = e.detail.formId
		$storage.async.set('event_id', event_id)
		$storage.async.set('event_state', event_state)
		$storage.async.set('user_id', user)
		if (event_state == 2) {
			wx.showModal({
				title: '学员'+user+'约课申请',
				content: '约课时间：从'+start+'到'+end,
				cancelText: '拒绝',
				confirmText: '接受',
				success(res) {
					if (res.confirm) {
						that.orderCourse(user, event_id, formId, 0)
					} else {
						that.orderCourse(user, event_id, formId, -1)
					}
				}
			})
			return
		}
		wx.navigateTo({ url: `/pages/memberCourse/course?user_id=${user}&event_id=${event_id}&event_state=${event_state}` })
	},
	gymJudg() {
		const gym = app.globalData.gym || {}
		if (!Object.keys(gym).length) {
			wx.showModal({
				title: "未添加健身房信息",
				content: "进入【个人信息】补充健身房资料",
				showCancel: false,
				confirmText: "进入",
				success: (res) => {
					if (res.confirm) {
						// wx.redirectTo({url: "/pages/personalCoach/coach"})
						wx.navigateTo({url: "/pages/profile/profile"})
					}
				}
			})
		}
	},
	onLoad(e) {
		// console.log(getCurrentPages())
		const that = this
		const data = this.data
		const nowDate = new Date()
		const year = nowDate.getFullYear()
		const month = nowDate.getMonth() + 1
		const day = toDou(nowDate.getDate())
		const hour = toDou(nowDate.getHours())
		const times = parseDate(`${year}-${month}-${day} 00:00:00`)
		const nowDateInfo = {
			year,
			month,
			day,
			hour,
			times
		}
		$storage.async.set('nowDateInfo', nowDateInfo)
		that.setData({ nowDateInfo })

		app.getUserInfo((userInfo) => {
			fillDates(data.currentWeekMount, that)
			this.setYM()
			that.gymJudg()
		})
	},
	onShow(){
		const that = this
		const data = this.data
		wx.getStorage({
			key: 'event_change',
			success: (res) => {
				app.getUserInfo((userInfo) => {
					fillDates(data.currentWeekMount, that)
					this.setYM()
					that.gymJudg()
				})
				$storage.async.remove('event_change')
			}
		})
	}
})
