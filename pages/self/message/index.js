// pages/self/message/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      fType: '个人消息',
      flag: '2',
    },{
      fType: '活动消息',
      flag: '3',
    },{
      fType: '系统消息',
      flag: '1',
    }],
    CurrentTab: 0,//默认显示个人消息
    Currentflag: 2,//默认显示个人消息
    num: 0,//默认显示第一页
    msglist:[],
    maxpage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '消息中心',
    })
    this.GetMessageInfo()
  },
  
  /**
   * 页面相关事件处理函数--切换tabs
   */
  ChangeTabs: function (e) {
    var that = this
    if (e.currentTarget.dataset.index === that.data.CurrentTab) {
      that.setData({ num: 0 })
    } else {
      that.setData({
        CurrentTab: e.currentTarget.dataset.index,
        Currentflag: e.currentTarget.dataset.flag,
        num: 0
      })
    }
    that.GetMessageInfo()
  },
  GetMessageInfo: function () {
    var that = this
    var APPUserInfo = wx.getStorageSync('APPUserInfo') || {}
    wx.request({
      url: app.globalData.posturl + 'wx/personalcenter/queryMessage.do', //url 不能出现端口号
      data: {
        flag: that.data.Currentflag,
        fUserID: APPUserInfo.fUserID,
        page: that.data.num
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (that.data.num>0){
          var n = that.data.msglist.length
          var item = new Array()
          item=that.data.msglist
          for (let i = 0; i < res.data.data.length; i++){
            item[i+n] = res.data.data[i]
          }
          that.setData({
            msglist: item,
            maxpage: res.data.totalPage
          })
        }else {
          that.setData({
            msglist: res.data.data,
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
  onPullDownRefresh: function (){
    const that = this
    that.setData({
      num: 0
    })
    that.GetOrderInfo()
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
      that.GetOrderInfo()
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
