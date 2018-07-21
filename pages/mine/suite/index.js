// pages/mine/suite/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SuiteList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的套房',
    })
    this.getorderinfo()
  },

  //请求订单列表轮播
  getorderinfo: function (e) {
    var that = this
    //请求订单列表
    wx.request({
      url: app.globalData.posturl + 'wx/personalcenter/queryByCustomer.do', //url 不能出现端口号
      data: {
        fUserID: app.globalData.userInfo.fUserID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          SuiteList: res.data.data
        })
      },
      method: 'GET'
    });
  },

  ChangeCustomer: function (e) {
    var that = this
    wx.request({
      url: app.globalData.posturl + 'wx/personalcenter/setDefaultCustomer.do', //url 不能出现端口号
      data: {
        fCustomerID: e.currentTarget.dataset.fcustid,
        fUserID: app.globalData.userInfo.fUserID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.changelogin()
      },
      method: 'POST'
    });
  },

  changelogin: function(){
    var that = this
    wx.request({
      url: app.globalData.posturl + 'wx/personalcenter/queryUserInfo.do', //url 不能出现端口号
      data: { fOpenID: app.globalData.fOpenID },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 1) {
          app.globalData.userInfo = res.data.data
          app.globalData.fSelectMatID = res.data.data.fSelectMatID
          app.globalData.fCustomerID = res.data.data.fCustomerID
          app.globalData.fCustomerName = res.data.data.fCustomerName
          // wx.switchTab({
          //   url: 'index',
          // })
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
