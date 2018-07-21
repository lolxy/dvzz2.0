// pages/self/find/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Searchdata:'',
    tabs:[],
    currentid:'',
    datalist:[],
    num: 0,
    fUserID: '',
    maxpage:1,
    isShow:true,
    scrollTop:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '找工人',
    })
    if (app.globalData.userInfo!=null){
      this.setData({
        fUserID: app.globalData.userInfo.fUserID
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.userInfo != null) {
      this.setData({
        fUserID: app.globalData.userInfo.fUserID
      })
    }
    this.getitemtype()
  },

  /**
   * 生命周期函数--切换tabs
   */
  TabsChange: function(e) {
    this.setData({
      currentid: e.currentTarget.dataset.fid,
      num: 0
    })
    this.GetDataList()
  },
  //搜索
  getSearch: function (e) {
    this.setData({
      Searchdata: e.detail.value,
      num: 0
    })
    this.GetDataList()
  },
  //图片点击放大
  showimg: function (e) {
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [e.target.dataset.url] // 需要预览的图片http链接列表
    })
  },
  /**
   * 页面相关事件处理函数--获取data列表
   */
  GetDataList: function(){
    var that = this
    wx.request({
      url: app.globalData.posturl + 'wx/worker/queryWorkerList.do', //url 不能出现端口号
      data: {
        keyword: that.data.Searchdata,
        num: that.data.num,
        fOrgID: that.data.currentid,
        fUserID: that.data.fUserID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (that.data.num > 0){
          let n = that.data.datalist.length
          for (let i=0;i<res.data.data.length;i++) {
            let item = 'datalist[' + (i + n) +']'
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
      url: app.globalData.posturl + 'wx/worker/queryWorkerType.do', //url 不能出现端口号
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          tabs: res.data.data
        })
        that.GetDataList()
      },
      method: 'GET'
    });
  },
  /**
   * 页面相关事件处理函数--跳转到详情页
   */
  ToFindDetail: function (e) {
    if (app.globalData.userInfo && app.globalData.userInfo.fUserID) {
      wx.navigateTo({
        url: '../finddetail/index?fEmployID=' + e.currentTarget.dataset.feid + '&fEmployName=' + e.currentTarget.dataset.name + '&fYear=' + e.currentTarget.dataset.fyear + '&fMobile=' + e.currentTarget.dataset.phone + '&fIntroduce=' + e.currentTarget.dataset.discript + '&fPhoto=' + e.currentTarget.dataset.fphoto,
        success: function (res) {
        }
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '您还没有登录，请先登录，',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/mine/login/index'
            })
          } else if (res.cancel) {
            
          }
        }
      })
    }
    
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
    if (that.data.num === that.data.maxpage - 1){
      wx.showLoading({
        title: '已经到底了',
        mask: true
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
    }else {
      that.setData({
        num: that.data.num + 1
      })
      that.GetDataList()
    }
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
