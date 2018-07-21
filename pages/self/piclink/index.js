// pages/self/piclink/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemlist:[{
      picurl: '../../../image/jzal.png',
      link: '../piclist/index'
    },{
      picurl: '../../../image/qwdz.png',
      link: '../piclist/index'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '装修图库',
    })
  },

  /**
     * 页面相关事件处理函数--跳转到列表页
     */
  ToPicList: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.href + '?Type=' + e.currentTarget.dataset.index
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
