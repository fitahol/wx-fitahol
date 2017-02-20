//index.js
//获取应用实例
import Fetch from '../../utils/services.js'
Page({
	data: {
		province: [],
		provinceList: [],
		provinceIndex: 0,
		city: [],
		cityList: [],
		cityIndex: 0,
		district: [],
		districtList: [],
		districtIndex: 0,
	},
	getProvince() {
		const that = this
		let province = []
		let provinceList = []
		Fetch('/central/province/')
		.then((res) => {
			province = res.data
			province.forEach((item) => {
				provinceList.push(item.fullname)
			})
			that.setData({ province, provinceList })
		})
		.then(() => {
			const provinceIndex = this.data.provinceIndex
			that.getCity(province[provinceIndex].code)
		})
	},
	getCity(provinceCode) {
		const that = this
		let city = []
		let cityList = []
		Fetch(`/central/city/${provinceCode}`)
		.then((res) => {
			city = res.data
			city.forEach((item) => {
				cityList.push(item.fullname)
			})
			that.setData({ city, cityList })
		})
		.then(() => {
			const cityIndex = this.data.cityIndex
			that.getDistrict(city[cityIndex].code)
		})
	},
	getDistrict(cityCode) {
		const that = this
		let district = []
		let districtList = []
		Fetch(`/central/district/${cityCode}`)
		.then((res) => {
			district = res.data
			district.forEach((item) => {
				districtList.push(item.fullname)
			})
			that.setData({ district, districtList })
		})
	},
	changeProvince(e) {
		const provinceIndex = e.detail.value
		const provinceCode = this.data.province[provinceIndex].code
		this.setData({ provinceIndex })
		this.getCity(provinceCode)
	},
	changeCity(e) {
		const cityIndex = e.detail.value
		const cityCode = this.data.city[cityIndex].code
		this.setData({ cityIndex })
		this.getDistrict(cityCode)
	},
	changeDistrict(e) {
		const districtIndex = e.detail.value
		const districtCode = this.data.district[districtIndex].code
		this.setData({ districtIndex })
	},
	formSubmit(e){
		// name (string) – 名称
		// address (string) – 地址
		// telephone (int) – 电话
		// lat (float) – 地理位置,纬度; 可无
		// lng (float) – 地理位置, 经度; 可无
		// district_code (int) – 县/区code
		// city_code (int) – 城市code, 如果县区上传, 城市可不传
		const that = this
		const data = this.data
		const self = wx.getStorageSync('self')
		const params = e.detail.value || {}
		const textR = /^\s+$/
		const phoneR = /^1[3-8]\d{9}$/
		console.log(params)
		if (textR.test(params.name) || !params.name) {
			wx.showModal({
				title: '请输入健身房名称',
				showCancel: false
			})
			return
		} else if (!phoneR.test(params.telephone) || !params.telephone) {
			wx.showModal({
				title: '请输入正确的手机号码',
				showCancel: false
			})
			return
		} else if (textR.test(params.address) || !params.address) {
			wx.showModal({
				title: '请输入健身房详细地址',
				showCancel: false
			})
			return
		}
		params.city_code = data.city[data.cityIndex].code
		params.district_code = data.district[data.districtIndex].code
		Fetch(`/central/gym/`, 'POST', params).then(res => {
			that.setData({
				profile: res.data,
				genderIndex: res.data.gender
			})
			wx.showModal({
				title: '提示',
				content: "创建成功",
				showCancel: false,
				success: (res) => {
					if (res.confirm) {
						wx.redirectTo({ url: '/pages/profile/profile' })
					}
				}
			})
		})
	},
	onLoad() {
		const that = this
		const self = wx.getStorageSync('self')
		this.getProvince()
	}
})
