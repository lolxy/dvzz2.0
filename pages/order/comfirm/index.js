// pages/order/comfirm/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addIcon:'../../../images/add.png',
    closeIcon:'../../../images/icon_close.png',
    top: '100%'
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

  // 加入购物车
  submitOrder: function () {
    this.setData({
      top: 0
    })
  },

  // 关闭弹出层
  closeActionSheet: function () {
    this.setData({
      top: '100%'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})