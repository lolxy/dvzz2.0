// pages/mine/wdqb/info/index.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fAmount:0,
    Cash_Icon:'../../../../image/mine/default-img.png',
    nocash:1,
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的钱包',
    }) 
  },

  onShow:function() {
    this.GetData()
  },

  //获取余额
  GetData: function () {
    var that = this
    wx.request({
      url: app.globalData.posturl + 'wx/personalcenter/wallet.do', //url 不能出现端口号
      data: {
        fCustomerID: app.globalData.fCustomerID,
        fUserID: app.globalData.userInfo.fUserID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.data.fAmount || res.data.data.fAmount == 0){
          that.setData({
            fAmount: res.data.data.fAmount,
            nocash: 1
          })
        }else {
          that.setData({
            nocash:0
          })
        }
      },
      method: 'GET'
    });
  },
  /**
   * 充值跳转
   */
  ToRecharge: function (e) {
    if (app.globalData.userInfo.fBindUserID === app.globalData.userInfo.fUserID){
      wx.navigateTo({
        url: '../recharge/index'
      })
    }else{
      wx.showToast({
        title: '您暂无权限充值，请联系客服！',
        icon:'none'
      })
    }
  },

  /**
   * 消费账单跳转
   */
  ToBill: function (e) {
    var that=this
    wx.navigateTo({
      url: '../bill/index?fUserID=' + app.globalData.userInfo.fUserID +'&num='+0
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
