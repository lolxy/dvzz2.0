// pages/mine/login/index.js
var app = getApp()
const api = require('../../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logopic: '../../../image/mine/logopic.png',
    phone: '',
    OpenID: '',
    loged: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '登录',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    if (that.data.loged==1){
      that.GetBindsta()
    }
  },

  //点击登录
  WXLogin: function() {
    var that = this

    wx.login({
      success: function (res) {
        if (res.code) {
        //发起网络请求微信授权
          api.getOpenID({
            data: {
              appid: app.globalData.appid,
              js_code: res.code,
              grant_type: 'authorization_code'
            },
            success: function (res2) {
              if (res2.data.data.openid) {
                app.globalData.fOpenID = res2.data.data.openid
                wx.setStorage({
                  key: "fOpenID",
                  data: res2.data.data.openid
                })
                that.setData({
                  OpenID: res2.data.data.openid,
                  loged: 1
                })
                that.GetBindsta()
              } else {
                wx.showToast({
                  title: '获取用户信息出错了！',
                  icon: 'none'
                })
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  // 手机号登陆
  // phlogin:function(){
  //   wx.navigateTo({
  //     url: '../bind/index'
  //   })
  // },

  //请求绑定信息 （只有登录之后才能获取绑定状态所以能调用时openID一定存在）
  GetBindsta: function () {
    var that = this
    wx.request({
      url: app.globalData.posturl + 'wx/personalcenter/queryUserInfo.do', //url 不能出现端口号
      data: { fOpenID: that.data.OpenID },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        app.globalData.fBindStatus = true
        if (res.data.code == 1) {
          app.globalData.userInfo = res.data.data
          app.globalData.fSelectMatID = res.data.data.fSelectMatID
          app.globalData.fCustomerID = res.data.data.fCustomerID
          app.globalData.fCustomerName = res.data.data.fCustomerName
          wx.setStorage({
            key: "userInfo",
            data: res.data.data
          })
          wx.navigateBack({})
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '暂未查询到您的绑定信息，‘确定’将为您跳转到绑定页面，暂不绑定请点击取消',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../bind/index',
                })
              } else if (res.cancel) {
                wx.navigateBack({})
              }
            }
          })
        }
      },
      method: 'GET'
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '多维自装商城',
      desc: '免费介绍工人，装修辅材配送，专为自装服务',
      path: '/pages/self/index/index'
    }
  }
})
