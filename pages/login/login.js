import Fetch from '../../utils/services'
//获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {},
    utypeIndex: 0,
    uTypes: [
      '教练',
      '学员'
    ]
  },
  changeUtype(e) {
      this.setData({ utypeIndex: e.detail.value})
  },
  login() {
    const that = this
    app.getUserInfo((userInfo) => {
      Fetch('/wechat/wx/', 'POST', userInfo)
      .then(res => {
        const data = res.data
        wx.setStorageSync('token', data.token)
        wx.setStorageSync('self', data.user_id)
        wx.setStorageSync('u_type', data.u_type)
        if (~data.u_type) {
          wx.redirectTo({
            url: '/pages/fitahol/fitahol'
          })
        }
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    })
  },
  onLoad() {
    console.log('onLoad')
    //调用应用实例的方法获取全局数据
    this.login()
  }
})
