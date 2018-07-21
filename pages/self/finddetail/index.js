// pages/self/finddetail/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    discript:'',
    uphoto:'../../../image/zhibo.png'
  },

  contact:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.fEmployName,
    })
    var discript = options.fIntroduce.replace(/<p>/g, '').replace(/<\/p>/g, '')
    this.setData({
      detail: options,
      discript: discript
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