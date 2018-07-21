// pages/mine/aftersale/index.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist:[],
    num:0,
    maxpage:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的售后',
    })
    this.GetDataList()
  },
  /**
   * 页面相关事件处理函数--GetData
   */
  GetDataList: function () {
    var that = this
    var APPUserInfo = wx.getStorageSync('APPUserInfo') || {}
    wx.request({
      url: app.globalData.posturl + 'app/order/queryService.do', //url 不能出现端口号
      data: {
        fUserID: APPUserInfo.fCustomerID,
        num: that.data.num,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (that.data.num > 0) {
          let n = that.data.datalist.length
          for (let i = 0; i < res.data.data.length; i++) {
            let item = 'datalist[' + (i + n) + ']'
            that.setData({
              [item]: res.data.data[i],
              maxpage: res.data.totalPage
            })
          }
        } else {
          that.setData({
            datalist: res.data.data,
            maxpage: res.data.totalPage
          })
        }
      },
      method: 'GET'
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    that.setData({
      num: 0
    })
    that.GetDataList() 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (that.data.num == that.data.maxpage) {
      wx.showLoading({
        title: '已经到底了',
        mask: true
      })

      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
    } else {
      that.setData({
        num: that.data.num + 1
      })
      that.GetDataList()
    }
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