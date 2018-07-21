Page({

  // 页面的初始数据
  data: {
    mainMenuList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    subMenuList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    currentTab: 0,
    scrollTop:0
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "中骏四季花城15#2802"
    })
  },

  onShow: function () {

  },

  onHide: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /*******************
   **** 自定义方法 *****
   *******************/

  // 点击确认提交后执行的方法
  onSubmitData:function() {
    console.log('点击了提交')
  }
})