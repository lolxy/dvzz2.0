// pages/mine/step/index.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    fCaptcha: '',
    requestimg: '',
    currentContent:'获取验证码',
    time:60,
    OpenID: '',
    IsNeed: 0,
    IsShow: 0,
    isVisible:false,
    isTap:false,
    logopic: '../../../image/mine/logo.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '绑定手机号',
    })
    this.setData({
      phone: options.fphone,
      OpenID: options.OpenID
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getcheckimg()
  },
  getcheckimg: function () {
    var that = this
    var item = 'https://api.dovzs.com/APPDWERP/wx/captcha/getCaptcha.do?fPhoneNo=' + that.data.phone + '&fOpenID=' + that.data.OpenID + '&' + Math.random()
    that.setData({
      requestimg: item,
      IsNeed: 1
    })
  },
  toback: function () {
    wx.navigateBack()
  },
  checkimg: function (e) {
    var that = this
    if (e.detail.value.length == 4) {
      that.setData({
        isVisible:true,
        fCaptcha:e.detail.value
      })
    }else{
      that.setData({
        isVisible: false
      })
    }
  },
  checkedimg: function (e) {
    var that = this
    if (e.detail.value.length != 4) {
      wx.showToast({
        title: '请输入4位的图片验证码',
        icon: 'none',
        duration: 1000
      })
      that.setData({
        isVisible: false,
        fCaptcha: ''
      })
    }
  },
  getyzm:function(e){
    var that = this
    wx.showToast({
      title: '已提交验证，请稍后查看短信验证码',
      icon: 'none',
      duration: 1000
    })
    wx.request({
      url: app.globalData.posturl + 'wx/personalcenter/checkCode.do', //url 不能出现端口号
      data: {
        fPhoneNo: that.data.phone,
        fCaptcha: that.data.fCaptcha,
        fOpenID: that.data.OpenID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete: function (res) {
        let resjson = (typeof res.data === 'object') ? res.data : JSON.parse(res.data)
        wx.showToast({
          title: resjson.msg,
          icon:'none',
          duration: 2000
        })
        if (resjson.code == 1){
          that.setData({
            isTap: true,
            isVisible: false
          })
          that.countdown()
        }
      },
      method: 'GET'
    });
  },
  // 倒计时
  countdown: function () {
    var that = this
    var time = that.data.time
    var total_micro_second = time
    if (total_micro_second <= 0) {
      total_micro_second = 60   
      that.getcheckimg()
      that.setData({
        time:60,
        isTap: false,
        isVisible:true
      });
      // timeout则跳出递归
      return;
    }
    setTimeout(function () {
      total_micro_second -= 1;
      that.setData({
        time: total_micro_second,
        currentContent: `${total_micro_second}秒后获取`
      })
      that.countdown();
    },1000)
  },
  formSubmit: function (e) {
    var that = this
    wx.request({
      url: app.globalData.posturl + 'wx/personalcenter/bindAccount.do', //url 不能出现端口号
      data: {
        fPhoneNo: that.data.phone,
        fCaptcha: e.detail.value.fVerifyCode,
        fOpenID: that.data.OpenID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res2) {
        that.GetBindsta()
      },
      method: 'GET'
    });
  },
  
  //点击完成
  phonein: function (e) {
    var that=this
    that.setData({
      fVerifyCode: e.detail.value
    })
    var myreg = /^(\d{6})$/;
    if (e.detail.value.length != 6 || (!myreg.test(e.detail.value)) ){
      wx.showToast({
        title: '请输入6位数字验证码',
        icon: 'none',
        duration: 1000
      })
      that.setData({ IsShow: 0 })
    } else {
      that.setData({ IsShow:1})
    }
  },
  //点击完成
  phonein1: function (e) {
    var that = this
    var myreg = /^(\d{6})$/;
    if (e.detail.value.length != 6 || e.detail.value == '') {
      that.setData({
        IsShow: 0
      })
    } else if (!myreg.test(e.detail.value)) {
      that.setData({
        IsShow: 0
      })
    } else {
      that.setData({
        IsShow: 1
      })
    }
  },
  GetBindsta: function () {
    var that = this
    wx.request({
      url: app.globalData.posturl + 'wx/personalcenter/queryUserInfo.do', //url 不能出现端口号
      data: { fOpenID: that.data.OpenID },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 1 ) {
          app.globalData.userInfo = res.data.data
          app.globalData.fSelectMatID = res.data.data.fSelectMatID
          app.globalData.fCustomerID = res.data.data.fCustomerID
          app.globalData.fCustomerName = res.data.data.fCustomerName
          wx.showModal({
            title: '提示',
            content: '绑定成功',
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/mine/index/index',
                })
              } else if (res.cancel) {

              }
            }
          })
        }else {
          wx.showModal({
            title: '提示',
            content: '绑定失败,请退出登录后重试绑定',
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: 'index',
                })
              } else if (res.cancel) {

              }
            }
          })
        }
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
