// pages/detail/detail.js
const api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluateList:[],
    currentGoodsId:null,
    pageSize:10,
    currentPage:0,
    loading:true,
    hasMore:false
  },

  // 查看图片大图
  onPreview:function(e){
    let arr = e.currentTarget.dataset.arr
    let urls = arr.map(item=>{
      return item.fUrl
    })
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  // 获取当前商品的评价列表
  getCurrentGoodsEvaluate:function(){
    const self = this
    self.setData({
      loading:true
    })
    wx.showLoading({
      title: '加载中'
    })
    api.getCurrentGoodsEvaluate({
      data:{
        fMatID: self.data.currentGoodsId,
        num: self.data.pageSize,
        page:self.data.currentPage
      },
      success: (res) => {
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
        let evaluateList = res.data.data
        self.setData({
          loading:false,
          evaluateList: self.data.evaluateList.concat(evaluateList)
        })
        if (evaluateList && evaluateList.length < self.data.pageSize) {
          self.setData({
            hasMore: true
          })
        }else{
          this.setData({
            currentPage: this.data.currentPage + 1
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentGoodsId:options.id
    })
    this.getCurrentGoodsEvaluate()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.hasMore) {
      if (!this.data.loading){
        this.getCurrentGoodsEvaluate()
      }
    }else{
      wx.showToast({
        title: '已经到底了！',
        icon: 'none',
        duration: 1500
      })
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