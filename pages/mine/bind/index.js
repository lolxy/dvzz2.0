// pages/mine/bind/index.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identifyicon: '',
    IsShow:0,
    IsNeed: 0,
    Isphone: 1,
    phone: '',
    fCaptcha: '',
    requestimg: '',
    OpenID: '',
    logopic: '../../../image/mine/logo.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '绑定手机号',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    that.setData({
      OpenID: app.globalData.fOpenID
    })
  },

  getcheckimg: function () {
    var that = this
    var item = 'https://www.dovzs.com/APPDWERP/wx/captcha/getCaptcha.do?fPhoneNo=' + that.data.phone + '&fOpenID=' + that.data.OpenID + '&' + Math.random()
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
      wx.showToast({
        title: '已提交验证，请稍后查看短信验证码',
        icon: 'none',
        duration: 1000
      })
      wx.request({
        url: app.globalData.posturl + 'wx/personalcenter/checkCode.do', //url 不能出现端口号
        data: {
          fPhoneNo: that.data.phone,
          fCaptcha: e.detail.value,
          fOpenID: that.data.OpenID
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        complete: function (res) {
          wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
          })
        },
        method: 'GET'
      });
    }else {
      wx.showToast({
        title: '请输入4位的图片验证码',
        icon: 'none',
        duration: 1000
      })
    }
  },
  //点击完成
  phonein: function (e) {
    var that=this
    that.setData({
      phone: e.detail.value
    })
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (e.detail.value.length != 11 || e.detail.value == ''){
      wx.showToast({
        title: '请输入完整的手机号',
        icon: 'none',
        duration: 1000
      })
      that.setData({
        Isphone: 1
      })
    } else if (!myreg.test(e.detail.value)) {
      wx.showToast({
        title: '请输入正确的手机号（13、14、18、17开头的11位数字）',
        icon: 'none',
        duration: 1000
      })
      that.setData({
        Isphone: 1
       })
    }else {
      that.setData({
        Isphone:0
      })
    }
  },
  //点击完成
  phonein1: function (e) {
    var that = this
    that.setData({
      phone: e.detail.value
    })
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (e.detail.value.length != 11 || e.detail.value == '') {
      that.setData({
        Isphone: 1
      })
    } else if (!myreg.test(e.detail.value)) {   
      that.setData({
        Isphone: 1
      })
    } else {
      that.setData({
        Isphone: 0
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
                  url: 'index',
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
  tostep2:function(){
    var that=this
    wx.navigateTo({
      url: '../step/index?fphone=' + that.data.phone + '&OpenID=' + that.data.OpenID,
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
