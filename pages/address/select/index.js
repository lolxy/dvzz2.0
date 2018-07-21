const app = getApp()
const api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    LocalImage: '../../../images/icon_area.png',
    searchIcon: "../../../images/icon_search.png",
    QRCode: '../../../images/icon_code.png',
    msgIcon: '../../../images/icon_message.png',
    downIcon: "../../../images/icon_down.png",
    citylist: [],
    currentCity: app.globalData.location,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCityList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /*****  省市区选择   *****/
  cityChange: function (e) {
    app.globalData.location = this.data.citylist[e.detail.value].fValue
    app.globalData.cityId = this.data.citylist[e.detail.value].fID
    this.setData({
      currentCity: app.globalData.location
    })
  },
  //获取城市列表
  getCityList: function () {
    var that = this
    //请求banner列表
    wx.request({
      url: app.globalData.posturl + 'wx/personalcenter/queryCityList.do', //url 不能出现端口号
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          citylist: res.data.data
        })
      },
      method: 'GET'
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})