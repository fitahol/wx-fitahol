import $storage from '../../../utils/storage'
import { toDou, parseDate } from '../../../utils/util'
import Fetch from '../../../utils/services'
import moment from '../../../libs/moment/moment'

function getFitaholData(self, startTime, endTime, _this) {
	Fetch(
		`/schedule/event/?self=${self}`,
		'GET',
		{
			interval: 'date_range',
			begin: startTime,
			end: endTime,
			time: Date.now()
		}
	)
	.then(res => {
		const fitaholData = res.data
		const weekTitleInfo = _this.data.weekTitleInfo

		if (fitaholData.length) {
			fitaholData.forEach((item, index) => {
				const startInfo = item.start.split(' ')
				const YMD = startInfo[0]
				const HOUR = startInfo[1].split(':')[0]
				const MINU = startInfo[1].split(':')[1]
				 weekTitleInfo.forEach((childItem, childIndex) => {
					 let childYmd = `${childItem.year}-${childItem.month}-${childItem.day}`
					 if (YMD == childYmd) {
						 childItem.hasSameYmd = true
						 childItem.renderData = childItem.renderData || {}
						 const diffTime = parseDate(item.end) - parseDate(item.start)
						 const timesArea = +(diffTime) / 3600000
						 if (timesArea > 0) {
							 for (let i = 0; i < timesArea; i++) {
								 childItem.renderData[toDou(+HOUR + i)] = {
									 HOUR: toDou(+HOUR + i),
									 MINU,
									 user: item.user,
									 start: item.start,
									 timesArea,
									 end: item.end,
									 id: item.id,
									 calendar_slug: item.calendar_slug,
									 state: item.state
								 }
							 }
						 }
					 }
				 })
			})
		}
		_this.setData({ fitaholData, weekTitleInfo })
	})
}

export function fillDates(currentWeekMount, _this) {
	const tempDate = moment(currentWeekMount)
	let newWeek = []
	_this.data.EnglishWeekArr.forEach((item, index) => {
		const dzien = tempDate.day(index + 1)
		const year = dzien.year()
		const month = toDou(dzien.month() + 1)
		const day = toDou(dzien.date())
		const times = parseDate(`${year}-${month}-${day} 00:00:00`)
		newWeek = newWeek.concat([{
			year,
			month,
			day,
			times
		}])
	})
	const yearInfo = newWeek[0].year
	const monthInfo = newWeek[0].month
	const dayInfo = newWeek[0].day
	_this.setData({
		weekTitleInfo: newWeek,
		year: yearInfo,
		month: monthInfo
	})
	_this.judgBackToday(newWeek)
	$storage.sync.set('year', yearInfo)
	$storage.sync.set('month', monthInfo)
	$storage.sync.set('day', dayInfo)
	// 获取用户data
	wx.getStorage({
		key: 'self',
		success: (res) => {
			const self = res.data
			if (self && newWeek.length) {
				const startTime = newWeek[0]
				const endTime = newWeek[6]
				const startTimeParams = `${startTime.year}-${startTime.month}-${startTime.day}`
				const endTimeParams = `${endTime.year}-${endTime.month}-${endTime.day}`
				getFitaholData(self, startTimeParams, endTimeParams,_this)
			}
			_this.setData({ self })
		},
		fail: (res) => {
			console.log('fail', res)
		}
	})
}

export function houtTitleList() {
	const hourTitleArr = []
	for (let i = 0; i < 24; i++) {
		hourTitleArr.push(toDou(i))
	}
	return hourTitleArr
}
