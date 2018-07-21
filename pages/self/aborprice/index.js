// pages/self/aborprice/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Searchdata: '',
    tabs: [],
    currenttab: 0,
    currentid: '',
    datalist: [],
    num: 0,
    maxpage: 1,
    isShow: true,
    scrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '看工价',
    })
    this.getitemtype()
  },

  //图片点击放大
  showimg: function (e) {
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [e.target.dataset.url] // 需要预览的图片http链接列表
    })
  },
  //切换tabs
  TabsChange: function (e) {
    this.setData({
      currenttab: e.currentTarget.dataset.index,
      currentcode: e.currentTarget.dataset.fcode,
      num: 0
    })
    this.GetDataList()
  },
  //搜索
  GetSearch: function (e) {
    this.setData({
      Searchdata: e.detail.value
    })
    this.getitemtype()
  },
  /**
   * 页面相关事件处理函数--获取data列表
   */
  GetDataList: function () {
    var that = this
    wx.request({
      url: app.globalData.posturl +'wx/shop/priceMatList.do', //url 不能出现端口号
      data: {
        fMatName: that.data.Searchdata,
        fCode: that.data.currentcode,
        num: that.data.num
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (that.data.num > 0) {
          let n = that.data.datalist.length
          for (let i = 0; i < res.data.data.length; i++) {
            let item = 'datalist[' + (i + n) + ']'
            that.setData({
              [item]: res.data.data[i],
              maxpage: res.data.totalPage
            })
          }
        } else {
          that.setData({
            datalist: res.data.data,
            maxpage: res.data.totalPage
          })
        }
      },
      method: 'GET'
    });
  },

  /**
   * 页面相关事件处理函数--获取类别
   */
  getitemtype: function () {
    var that = this
    wx.request({
      url: app.globalData.posturl + '/wx/shop/priceType.do', //url 不能出现端口号
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          tabs: res.data.data,
          currentcode: res.data.data[that.data.currenttab].fCode
        })
        that.GetDataList()
      },
      method: 'GET'
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const that = this
    that.setData({
      num: 0,
      datalist:[]
    })
    that.GetDataList() 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (that.data.num === that.data.maxpage - 1) {
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

  onShareAppMessage: function () {
    return {
      title: '多维自装商城',
      desc: '免费介绍工人，装修辅材配送，专为自装服务',
      path: '/pages/self/index/index'
    }
  }
})