//self/index.js
//获取应用实例
const app = getApp()
const api = require('../../utils/api.js');

Page({
  data: {
    citylist: [],
    currentCity: app.globalData.location,
    LocalImage: '../../images/icon_area.png',
    searchIcon: "../../images/icon_search.png",
    QRCode: '../../images/icon_code.png',
    msgIcon: '../../images/icon_message.png',
    downIcon: "../../images/icon_down.png",
    indicatorDots: false,
    autoplay: true, //banner  是否自动播放
    interval: 5000,//banner1 切换间隔
    interval2: 3000,//banner2  切换间隔
    duration: 500,//切换动画持续时间
    imgUrls: [],
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    currentTab2: 0,
    latitude: app.globalData.area.latitude,
    longitude: app.globalData.area.longitude,
    recommonList:[],
    LinkList:[
      {
        fImgUrl:'../../images/icon_main1.png',
        fTitle:'买辅材',
        fUrl:'buyfc/storeList'
      },
      {
        fImgUrl: '../../images/icon_main2.png',
        fTitle: '买建材',
        fUrl: 'main/index'
      },
      {
        fImgUrl: '../../images/icon_main3.png',
        fTitle: '全屋定制',
        fUrl: 'customize/index'
      },
      {
        fImgUrl: '../../images/icon_main4.png',
        fTitle: '软装',
        fUrl: 'soft/index'
      }
    ],
    subMenuList:[
      {
        fImgUrl: '../../images/icon_sub1.png',
        fTitle: '装修工人',
        fUrl: ''
      },
      {
        fImgUrl: '../../images/icon_sub2.png',
        fTitle: '找设计',
        fUrl: ''
      },
      {
        fImgUrl: '../../images/icon_sub3.png',
        fTitle: '找监理',
        fUrl: ''
      },
      {
        fImgUrl: '../../images/icon_sub4.png',
        fTitle: '安装工人',
        fUrl: ''
      },
      {
        fImgUrl: '../../images/icon_sub5.png',
        fTitle: '装修案例',
        fUrl: ''
      },
      {
        fImgUrl: '../../images/icon_sub6.png',
        fTitle: '免费量房',
        fUrl: ''
      },
      {
        fImgUrl: '../../images/icon_sub7.png',
        fTitle: '工地直播',
        fUrl: ''
      },
      {
        fImgUrl: '../../images/icon_sub8.png',
        fTitle: '装修图库',
        fUrl: ''
      },
      {
        fImgUrl: '../../images/icon_sub9.png',
        fTitle: '找户型',
        fUrl: ''
      },
      {
        fImgUrl: '../../images/icon_sub10.png',
        fTitle: '全部分类',
        fUrl: ''
      }
    ],
    tipList: [
      {
        fImgUrl: '../../images/home_icon1.png',
        fTitle: '施工提醒',
        fUrl: ''
      },
      {
        fImgUrl: '../../images/home_icon2.png',
        fTitle: '验收提示',
        fUrl: ''
      },
      {
        fImgUrl: '../../images/home_icon3.png',
        fTitle: '材料订购',
        fUrl: ''
      },
      {
        fImgUrl: '../../images/home_icon4.png',
        fTitle: '预算',
        fUrl: ''
      }
    ],
    recom: {
      "recom1": "../../images/index_recom1.png",
      "recom2": "../../images/index_recom2.png"
    },
    shopIcon: "../../images/icon_store.png",
    loadimg:'../../image/loadimg.png',
    fCustomerID: '',
    num:0,
    totalPage: 1
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
  getCityList: function(){
    var that=this
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    wx.showLoading({
      title: '加载中',
    })
    //请求banner列表
    wx.request({
      url: app.globalData.posturl + 'app/picture/loadBanner.do', //url 不能出现端口号
      data: { type: 5 },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        that.setData({
          imgUrls: res.data.data
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      },
      method: 'GET'
    });
    wx.showLoading({
      title: '加载中',
    })
    wx.showLoading({
      title: '加载中',
    })
    that.getorderinfo()
    wx.showLoading({
      title: '加载中',
    })
    this.init()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    if (app.globalData.userInfo) {
      that.setData({
        fCustomerID: app.globalData.userInfo.fCustomerID,
      })
      that.getorderinfo()
    }
    this.getCityList()
  },
  /**
    * 滑动切换tab
    */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab2: e.detail.current })
  },
  /**
    * 跳转到自装服务站
    */
  ToStationList: function () {
    wx.navigateTo({
      url: '../station/index',
      success: function (res) {
      }
    })
  },

  //banner跳转
  toOutLink: function (e) {
    if (e.currentTarget.dataset.burl && e.currentTarget.dataset.burl.indexOf('dovzs')>-1) {
      wx.navigateTo({
        url: `/pages/outlink/index?url=${e.currentTarget.dataset.burl}`
      })
    }
  },
  /**
    * 跳转到各详情页面
    */
  JumpTo: function (e) {
    wx.navigateTo({
      url: `../${e.currentTarget.dataset.url}/index`
    })
  },

  /**
    * 跳转到各详情页面
    */
  message: function(e) {
    wx.navigateTo({
      url: '/pages/self/message/index'
    })
  },
  // 扫码功能
  scanCode: function () {
    wx.scanCode({
      success: function (res) {
        if (res.result) {
          api.getScanCode({
            data: {
              fMatCode: res.result
            },
            success: (res) => {
              if (res.data.data.fMatID) {
                wx.navigateTo({
                  url: `/pages/main/detail/index?id=${res.data.data.fMatID}&displayType=fucai`
                })
              } else {
                wx.showToast({
                  title: '扫码有误，请重新扫码！',
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  },
  //请求菜单项
  // getmenudata: function (e) {
  //   var that = this
  //   wx.request({
  //     url: app.globalData.posturl + 'wx/shop/indexMenu.do', //url 不能出现端口号
  //     data: {flag: 1},
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success: function (res) {
  //       that.setData({
  //         LinkList: res.data.data
  //       })
  //       setTimeout(function () {
  //         wx.hideLoading()
  //       }, 2000)
  //     },
  //     method: 'GET'
  //   });
  // },
  //请求订单列表轮播
  getorderinfo: function (e) {
    var that = this
    //请求订单列表

    wx.request({
      url: app.globalData.posturl + 'wx/shop/quereyOrder.do', //url 不能出现端口号
      data:{
        fCustomerID: that.data.fCustomerID,
        num:0
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          StutList: res.data.data
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      },
      method: 'GET'
    });
  },
  tomap: function (e) {
    const that = this
    const latitude = Number(e.target.dataset.lat)
    const longitude = Number(e.target.dataset.lng)
    const title = e.target.dataset.add
    const distance = e.target.dataset.distance
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        wx.openLocation({
          name: title,
          address: distance,
          latitude: latitude,
          longitude: longitude
        })
      }
    })
  },
  //评价----开发中…………
  toeva: function(e) {
    wx.showModal({
      title: '温馨提示',
      content: '服务站评价功能开发中，敬请期待'
    })
  },
  //图片点击放大
  showimg: function (e) {
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [e.target.dataset.url] // 需要预览的图片http链接列表
    })
  },

  chickbtn: function(e) {
    wx.navigateTo({
      url: '/pages/self/auxiliary/orderdetail/index?fSaleOrderID=' + e.currentTarget.dataset.soid + '&fTypeCategory=' + e.currentTarget.dataset.cate
    })
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

  // 初始化
  init:function() {
    if (this.data.latitude && this.data.longitude) {
      this.getHomeRecommonList()
    } else {
      app.getLocationInfo().then(res => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        this.getHomeRecommonList()
      });
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const that = this
    that.setData({
      num: 0
    })
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
    }
  },

  // 前往登录页面
  goToLogin:function(){
    wx.navigateTo({
      url: '/pages/mine/login/index',
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
