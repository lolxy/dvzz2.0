// pages/mine/drawing/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ImgList: [{}],
    curretimg:0,
    totleimage: 3,
    TouchOrigin: 0,
    TouchMove: 0, 
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '我的图纸',
    })
    wx.getStorage({
      key: 'APPUserInfo',
      success: function (res) {
        if (res.data) {
          that.setData({
            userInfo: res.data
          })
        }
      },
      complete: function (res) {
        that.GetData()
      }
    })
  },
  /**
   * 页面相关事件处理函数--StartF
   */
  StartF: function (e) {
    var that = this
    that.setData({
      TouchOrigin: e.touches[0].pageX,
    })
  },
  /**
   * 页面相关事件处理函数--EndF
   */
  EndF: function (e) {
    var that = this
    that.setData({
      TouchMove: e.changedTouches[0].pageX,
    })
    if (that.data.TouchOrigin - that.data.TouchMove <= -40 && that.data.curretimg > 0 ) {
      that.setData({
        curretimg: that.data.curretimg - 1
      })
    } else if (that.data.TouchOrigin - that.data.TouchMove > 40 && that.data.curretimg < that.data.ImgList.length -1){
      that.setData({
        curretimg: that.data.curretimg + 1
      })
    }
  },
  //获取图片
  GetData: function () {
    var that = this
    wx.request({
      url: app.globalData.posturl + 'wx/personalcenter/myDrawings.do', //url 不能出现端口号
      data: {
        fCustomerID: app.globalData.fCustomerID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          ImgList: res.data.data,
          totleimage: res.data.data.length
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