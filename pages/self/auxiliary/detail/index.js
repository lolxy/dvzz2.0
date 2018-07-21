// pages/self/auxiliary/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultimg: '../../../../image/loadimg.png',
    infodata:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '辅料详情',
    })
    this.setData({
      infodata: options
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
