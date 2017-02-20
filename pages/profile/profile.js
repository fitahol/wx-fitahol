//index.js
//获取应用实例
import Fetch from '../../utils/services.js'

// const app = getApp()
Page({
	data: {
		profile: {},
		genders: ["男性", "女性", "未知"],
		genderIndex: 1,
		primaryField: [],
		province: [],
		provinceList: [],
		provinceIndex: 0,
		city: [],
		cityList: [],
		cityIndex: 0,
		district: [],
		districtList: [],
		districtIndex: 0,
		gym: [],
		gymList: [],
		gymIndex: 0
	},
	bindGenderChange(e) {
		this.setData({
			genderIndex: +e.detail.value + 1
		})
	},
	getProvince() {
		const that = this
		const defaultGym = this.data.profile.gym || {}
		const area_info = defaultGym.city_info || {}
		let province = []
		let provinceList = []
		Fetch('/central/province/')
		.then((res) => {
			province = res.data
			province.forEach((item, index) => {
				provinceList.push(item.fullname)
				if (item.code === area_info.province.code) {
					that.setData({ provinceIndex: index})
				}
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
		const defaultGym = this.data.profile.gym || {}
		const area_info = defaultGym.city_info || {}
		let city = []
		let cityList = []
		Fetch(`/central/city/${provinceCode}`)
		.then((res) => {
			city = res.data
			city.forEach((item, index) => {
				cityList.push(item.fullname)
				if (item.code === area_info.city.code) {
					that.setData({ cityIndex: index})
				}
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
		const defaultGym = this.data.profile.gym || {}
		const area_info = defaultGym.city_info || {}
		let district = []
		let districtList = []
		Fetch(`/central/district/${cityCode}`)
		.then((res) => {
			district = res.data
			district.forEach((item, index) => {
				districtList.push(item.fullname)
				if (item.code === area_info.district.code) {
					that.setData({ districtIndex: index})
				}
			})
			that.setData({ district, districtList })
		})
		.then(() => {
			const districtIndex = this.data.districtIndex
			that.getGym(district[districtIndex].code)
		})
	},
	getGym(districtCode) {
		//  获取健身房信息
		const that = this
		const defaultGym = this.data.profile.gym || {}
		let gym = []
		let gymList = []
		Fetch(`/central/gym/?district_code=${districtCode}`).then((res) => {
			gym = res.data || []
			gym.forEach((item, index) => {
				gymList.push(item.name)
				if (item.id === defaultGym.id) {
					that.setData({ gymIndex: index})
				}
			})
			this.setData({ gym, gymList })
		})
	},
	getPrimaryField() {
		// 获取擅长领域
		const that = this
		const defaultTags = this.data.profile.expert_tags || {}
		Fetch('/fitness/expert_tag/public/').then((res) => {
			const primaryField = res.data || []
			if (!primaryField.length) {
				return
			}
			primaryField.forEach((item) => {
				if (defaultTags.length) {
					defaultTags.forEach((childItem) => {
						if (childItem.id === item.id) {
							item.choose = true
						}
					})
				}
			})
			this.setData({ primaryField })
		})
	},
	changeFeild(e) {
		const dataset = e.target.dataset
		const id = e.target.dataset.id
		const index = e.target.dataset.index
		let primaryField = this.data.primaryField
		if (primaryField[index].choose) {
			primaryField[index].choose = false
		} else {
			primaryField[index].choose = true
		}
		this.setData({ primaryField })
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
		this.getGym(districtCode)
	},
	changeGym(e) {
		const gymIndex = e.detail.value
		// const gymCode = this.data.gym[gymIndex].code
		this.setData({ gymIndex })
	},
	formSubmit(e) {
		// gender (int) – 性别, 0未知,1男性,2女性
		// gym_id (int) – 健身房ID，如果不存在需要引导用户创建
		// expert_tags (string) – 擅长领域IDs，多个数据以,间隔：”1,23,12,34”
		const that = this
		const self = wx.getStorageSync('self')
		const gym = this.data.gym || []
		const gymIndex = this.data.gymIndex || 0
		const params = e.detail.value || {}
		params.gender = +params.gender + 1
		if (!gym.length) {
			wx.showModal({
				title: '提示',
				content: "您所选区域暂未添加健身房",
				confirmText: '去添加',
				cancelText: '取消',
				success: (res) => {
					if(res.confirm) {
						wx.navigateTo({ url: '/pages/gym/add' })
					}
				}
			})
			return
		}
		params.gym_id = gym[gymIndex].id
		const primaryField = this.data.primaryField
		let tags = []
		primaryField.forEach((item) => {
			if (item.choose) {
				tags.push(item.id)
			}
		})
		params.expert_tags = tags.join(',')
		Fetch(`/account/profile/${self}/`, 'PUT', params).then(res => {
			that.setData({
				profile: res.data,
				genderIndex: res.data.gender
			})
			wx.showModal({
				title: '提示',
				content: "修改成功",
				showCancel: false,
				success: (res) => {
					if (res.confirm) {
						that.getInit(self)
					}
				}
			})
		})
	},
	getInit(id) {
		const that = this
		const self = id || wx.getStorageSync('self')
		Fetch(`/account/profile/${self}/`).then(res => {
			const profile = res.data || {}
			console.log("profile.gender", profile.gender)
			that.setData({
				profile,
				genderIndex: profile.gender,
			})
			this.getProvince()
			this.getPrimaryField()
		})
	},
	onLoad() {
		const self = wx.getStorageSync('self')
		this.getInit(self)
	}
})
