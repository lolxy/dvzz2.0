// pages/self/piclist/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    currenttab: 0,
    CurrentType: '',
    CurrentCode: '',
    piclist: [],
    num:0,
    maxpage:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.Type == 1) {
      wx.setNavigationBarTitle({
        title: '家装案例',
      })
    }else{
      wx.setNavigationBarTitle({
        title: '全屋定制',
      })
    }
    if (options.Type==1){
      this.setData({
        CurrentType: options.Type,
        CurrentCode: 'SM0401'
      })
    }else {
      this.setData({
        CurrentType: options.Type,
        CurrentCode: 'A01'
      })
    }
    this.GetItemType()
  },
  
  //切换tabs
  TabsChange: function (e) {
    this.setData({
      currenttab: e.currentTarget.dataset.index,
      CurrentCode: e.currentTarget.dataset.fcode,
      num: 0
    })
    this.GetDataList()
  },
  /**
     * 页面相关事件处理函数--获取tabs项目
     */
  GetItemType: function () {
    var that = this
    wx.request({
      url: app.globalData.posturl + 'app/data/queryCustomized.do', //url 不能出现端口号
      data: {
        type: that.data.CurrentType
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.data.length > 0) {
          that.setData({
            tabs: res.data.data,
            CurrentCode: res.data.data[that.data.currenttab].fCode
          })
          that.GetDataList()
        }
      },
      method: 'GET'
    });
  },
  /**
   * 页面相关事件处理函数--获取data列表
   */
  GetDataList: function () {
    var that = this
    wx.request({
      url: app.globalData.posturl + 'app/picture/queryPic.do', //url 不能出现端口号
      data: {
        type: that.data.CurrentType,
        fCode: that.data.CurrentCode,
        num: that.data.num
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (that.data.num > 0){
          let n = that.data.piclist.length
          for (let i = 0; i < res.data.data.length; i++) {
            let item = 'piclist[' + (i + n) + ']'
            that.setData({
              [item]: res.data.data[i],
              maxpage: res.data.totalPage
            })
          }
        }else {
          that.setData({
            piclist: res.data.data,
            maxpage: res.data.totalPage
          })
        }
      },
      method: 'GET'
    });
  },
  /**
   * 页面相关事件处理函数--点击查看图片
   */
  PicView: function(e){
    var that = this
    wx.previewImage({
      //current: '', // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.url]// 需要预览的图片http链接列表
    })
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
