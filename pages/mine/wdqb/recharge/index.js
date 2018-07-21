// pages/mine/wdqb/recharge/index.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fAmount: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '充值',
    })
  },
  
  /**
   * 支付接口
   */
  ToPay: function(options) {
    var that = this
    var openid = app.globalData.fOpenID
    wx.request({
      url: app.globalData.posturl + 'zzsc/wxPay.do', //url 不能出现端口号
      data:{
        fAmount: that.data.fAmount,
        fCustomerID: app.globalData.userInfo.fCustomerID,
        fUserID: app.globalData.userInfo.fUserID,
        openId: app.globalData.fOpenID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.requestPayment(
          {
            'appId': res.data.data.appId,
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': res.data.data.signType,
            'paySign': res.data.data.paySign,
            'success': function (res2) { 
              wx.request({
                url: app.globalData.posturl + 'app/home/pay/success.do', //url 不能出现端口号
                data:{
                  fAmount: that.data.fAmount,
                  flag: 1,
                  fUserID: app.globalData.userInfo.fUserID
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  wx.showToast({
                    title: '充值成功',
                    icon: 'success',
                    duration: 1000
                  })
                  wx.navigateBack()
                },
                method: 'GET'
              });
            },
            'fail': function (res2) {
              
            },
            'complete': function (res2) { }
          })
      },
      method: 'GET'
    });
    
  },
 
  InputChange: function (e) {
    this.setData({
      fAmount:e.detail.value
    })  
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