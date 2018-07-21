// pages/categories/categories.js
const app = getApp()
const api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryList:[]
  },

  // 获取分类列表
  getCategoryList: function () {
    api.getCategoryList({
      success: (res) => {
        this.setData({
          categoryList: res.data.data
        })
      }
    });
  },

  // 搜索商品列表
  onSearch:function(e){
    wx.navigateTo({
      url: `/pages/main/list/index?keyword=${e.detail}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCategoryList()
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