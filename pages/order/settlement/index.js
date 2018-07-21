// pages/order/settlement/index.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fAmount: 0,
    nocash: 1,
    userInfo: {},
    cash: 0,
    orderlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fAmount: options.TotleAccont,
      orderlist: options.OIDList
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.GetCashData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  GetCashData:function(){
    var that = this
    wx.request({
      url: app.globalData.posturl + 'wx/personalcenter/wallet.do', //url 不能出现端口号
      data: {
        fCustomerID: app.globalData.fCustomerID,
        fUserID: app.globalData.userInfo.fUserID,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          cash: res.data.data.fAmount ? res.data.data.fAmount : 500   //500为测试数据
        })
      },
      method: 'GET'
    });
  },
  TocashiPay: function () {
    var that= this
    if (that.data.fAmount > that.data.cash) {
      wx.showModal({
        content: '对不起，您的零钱不足，请先充值，或选择其他支付方式',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/mine/wdqb/recharge/index',
              success: function (res) {
              }
            })
          } else if (res.cancel) {

          }
        }
      })
    }else {
      wx.request({
        url: app.globalData.posturl + 'app/home/pay/success.do', //url 不能出现端口号
        data: {
          fSaleOrderID: that.data.orderlist,
          fAmount: that.data.fAmount,
          flag: 0,
          fCustomerID: app.globalData.fCustomerID,
          fUserID: app.globalData.userInfo.fUserID
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {

        },
        method: 'GET'
      });
    }
  },
  TowxPay: function(){
    var openid = app.globalData.fOpenID
    var that = this
    wx.request({
      url: app.globalData.posturl + 'zzsc/wxPay.do', //url 不能出现端口号
      data: {
        fSaleOrderID: that.data.orderlist,
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
            'appId': app.globalData.appid,
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': res.data.data.signType,
            'paySign': res.data.data.paySign,
            'success': function (res2) {
              wx.request({
                url: app.globalData.posturl + 'app/home/pay/success.do', //url 不能出现端口号
                data: {
                  fSaleOrderID: that.data.orderlist,
                  fAmount: that.data.fAmount,
                  flag: 1,
                  fCustomerID: app.globalData.fCustomerID,
                  fUserID: app.globalData.userInfo.fUserID
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 1000
                  })
                  wx.navigateBack({})
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
