//index.js
//获取应用实例
const app = getApp()
const api = require('../../../utils/api.js');

Page({
  data: {
    indicatorDots: false,
    autoplay: true, //banner  是否自动播放
    interval: 5000,//banner1 切换间隔
    duration: 500,//切换动画持续时间
    circular: true,//是否采用衔接滑动
    currentCity: app.globalData.location,
    localImage:"../../../image/local.png",
    qRCode: "../../../image/qrimg.png",
    phoneIcon: "../../../image/phone_icon.png",
    userIcon: "../../../image/usr_icon.png",
    downIcon:"../../../image/downicon.png",
    shopIcon:"../../../image/shopicon.png",
    banner: [],
    menuList: [],
    recommonList:[],
    cityList:[],
    hiddenModal: true,
    latitude: app.globalData.area.latitude,
    longitude: app.globalData.area.longitude,
    num:0,
    totalPage:1,
    lanmu:{
      "lanmu1":"../../../image/lanmu1.png",
      "lanmu2": "../../../image/lanmu2.png",
      "lanmu3": "../../../image/lanmu3.png"
    }
  },

  // 页面渲染后 执行
  onLoad: function () {
    this.init()
  },

  onShow: function () {
    this.setData({
      currentCity: app.globalData.location
    })
  },

  onHide:function(){
    this.setData({
      hiddenModal: true
    })
  },

  //banner跳转
  toOutLink: function (e){
    if (e.currentTarget.dataset.burl && e.currentTarget.dataset.burl.indexOf('dovzs') > -1) {
      wx.navigateTo({
        url: `/pages/outlink/index?url=${e.currentTarget.dataset.burl}`
      })
    }
  },

  //选择地区城市
  cityChange: function (e) {
    app.globalData.location = this.data.citylist[e.detail.value].fValue
    app.globalData.cityId = this.data.citylist[e.detail.value].fID
    this.setData({
      currentCity: app.globalData.location
    })
    this.getHomeRecommonList()
  },

  //获取城市列表
  getCityList: function (){
    api.getCityList({
      success:(res)=>{
        this.setData({
          citylist: res.data.data
        })
      }
    })
  },

  // 跳转分类页面
  goToPage: function(e) {
    if (e.currentTarget.dataset.index == 3){
      wx.navigateTo({
        url: `/pages/main/list/index?code1=${e.currentTarget.dataset.furl.replace(/(^\s*)|(\s*$)/g, "")}&fShopCityID=ff8080816165d3c6016168d1502f0236&fCityID=${app.globalData.cityId}&catname=${e.currentTarget.dataset.title}`
      })
    }else{
      wx.navigateTo({
        url: `/pages/main/list/index?code1=${e.currentTarget.dataset.furl.replace(/(^\s*)|(\s*$)/g, "")}&fCityID=${app.globalData.cityId}&catname=${e.currentTarget.dataset.title}`
      })
    }
  },

  // 获取广告轮播图
  getMallBanner: function(){
    api.getMallBanner({
      data:{
        type:6
      },
      success: (res) => {
       this.setData({
         banner:res.data.data
       })
      }
    });
  },

  // 获取菜单信息
  getMallMenu:function(){
    api.getMallMenu({
      data:{
        flag:2
      },
      success: (res) => {
        this.setData({
          menuList: res.data.data
        })
      }
    });
  },

  // 获取首页推荐商品
  getHomeRecommonList: function () {
    api.getHomeRecommonList({
      data: {
        fCityID: app.globalData.cityId,
        lat: this.data.latitude,
        lng: this.data.longitude,
        num: this.data.num
      },
      success: (res) => {
        this.setData({
          totalPage: res.data.totalPage,
          recommonList: this.data.recommonList.concat(res.data.data)
        })
      }
    });
  },

  // 拨打联系电话
  callPhone:function(){
    wx.makePhoneCall({
      phoneNumber: '0595-85865088'
    })
  },

  // 跳转我的消息
  gotoMessage:function(){
    wx.navigateTo({
      url:'/pages/self/message/index'
    })
  },

  // 扫码功能
  scanCode: function () {
    wx.scanCode({
      success: function (res) {
        if (res.result) {
          api.getScanCode({
            data:{
              fMatCode: res.result
            },
            success:(res)=>{
              if (res.data.data.fMatID){
                wx.navigateTo({
                  url: `/pages/main/detail/index?id=${res.data.data.fMatID}`
                })
              }else{
                wx.showToast({
                  title: '扫码有误，请重新扫码！',
                  icon:'none'
                })
              }
            }
          })
        }
      }
    })
  },

  // 初始化数据
  init(){
    this.getMallBanner()
    this.getMallMenu()
    this.getCityList()
    if (this.data.latitude && this.data.longitude){
      this.getHomeRecommonList()
    }else{
      app.getLocationInfo().then(res => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        this.getHomeRecommonList()
      });
    }
  },

  // 获取游客信息
  getTouristExpInfo: function () {
    const self = this
    if (app.globalData.fOpenID){
      api.getTouristExpInfo({
        data: {
          fOpenID: app.globalData.fOpenID
        },
        success: (res) => {
          if (res.data.code == 1) {
            app.globalData.fSelectMatID = res.data.data.fSelectMatID
            app.globalData.fCustomerID = res.data.data.fCustomerID
            wx.navigateTo({
              url: '/pages/main/budget/index/index',
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
    }else{
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求微信授权
            api.getOpenID({
              data:{
                appid: app.globalData.appid,
                js_code: res.code,
                grant_type: 'authorization_code'
              },
              success: function (res2) {
                if (res2.data.data.openid) {
                  app.globalData.fOpenID = res2.data.data.openid
                  wx.setStorage({
                    key: "fOpenID",
                    data: res2.data.data.openid
                  })
                  self.getTouristExpInfo()
                } else {
                  wx.showToast({
                    title: '获取用户信息出错了！',
                    icon: 'none'
                  })
                }
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
  },

  // 判断是否已登录以及获取对应的选材数据
  goToselectMatPage: function (e) {
    if (e.currentTarget.dataset.type === 'virtual') {
      app.globalData.fSelectMatType = 'virtual'
      this.getTouristExpInfo()
    } else {
      app.globalData.fSelectMatType = 'my'
      let appUserInfo = app.globalData.userInfo || {}
      if (!appUserInfo.fUserID) {
        wx.showModal({
          title: '温馨提示',
          content: '您还没有登录，请先登录，',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/mine/login/index',
              })
            }
          }
        })
      } else {
        if (appUserInfo.fSelectMatID && appUserInfo.fCustomerID){
          app.globalData.fSelectMatID = appUserInfo.fSelectMatID
          app.globalData.fCustomerID = appUserInfo.fCustomerID
          wx.navigateTo({
            url: '/pages/main/budget/index/index',
          })
        }else{
          this.setData({
            hiddenModal: false
          })
        }
      }
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const that = this
    that.setData({
      num:0,
      recommonList:[]
    })
    that.getHomeRecommonList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (that.data.num === that.data.totalPage - 1) {
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
      that.getHomeRecommonList()
    }
  },

  // 关闭提示弹窗
  closeModal: function () {
    this.setData({
      hiddenModal: true
    })
  },

  comfirm: function () {
    this.setData({
      hiddenModal: true
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
