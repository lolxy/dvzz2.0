// pages/address/add/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rightIcon: '../../../images/icon_right.png',
    hiddenComfirmModal: true
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

  switchChange: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },

  // 是否删除
  dellAddress: function () {
    this.setData({
      hiddenComfirmModal: false
    })
  },

  // 执行提示框确认动作
  actionComfirm: function (e) {
    this.setData({
      hiddenComfirmModal: e.detail
    })
  },

  // 执行提示框取消动作
  actionClose: function (e) {
    this.setData({
      hiddenComfirmModal: e.detail
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})