// pages/main/budget/index/index.js
const api = require("../../../../utils/api.js");
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCode:"",
    currentMenu:"",
    rightIcon:'./image/right.png',
    mapIcon:'./image/map.png',
    sumPrice:0,
    hiddenTipModal: true,
    menuList:[],
    xcList:[]
  },

  // 获取预算分类
  getBudgetCate:function(){
    const self = this
    api.getBudgetCate({
      success:(res)=>{
        let currentCode = res.data.data[0].fCode
        let currentMenu = res.data.data[0].fValue
        self.setData({
          menuList:res.data.data,
          currentCode: currentCode,
          currentMenu: currentMenu
        })
        self.getBudgetCatList()
      }
    })
  },

  // 获取预算分类列表
  getBudgetCatList: function () {
    api.getBudgetCatList({
      data:{
        fSelectMatID: app.globalData.fSelectMatID,
        fCode:this.data.currentCode      
      },
      success: (res) => {
        let xcList = res.data.data
        let sumPrice = 0
        xcList.forEach(item => {
          sumPrice = sumPrice + parseInt(item.fAmount)
        })
        this.setData({
          xcList: xcList,
          sumPrice: sumPrice
        })
      }
    })
  },

  getCurrentMenuData:function(e){
    this.setData({
      currentCode: e.currentTarget.dataset.code,
      currentMenu: e.currentTarget.dataset.fvalue
    })
    this.getBudgetCatList()
  },

  // 跳转对应分类的选材页面
  gotoPage:function(e){
    let currentSubCat = e.currentTarget.dataset.subcode
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/main/budget/xuancai/index?code=${this.data.currentCode}&subcode=${currentSubCat}&id=${id}`
    })
  },

  onShow: function () {
    this.getBudgetCate()
    if (app.globalData.fCustomerName && app.globalData.fSelectMatType != 'virtual') {
      wx.setNavigationBarTitle({
        title: `${app.globalData.fCustomerName}`
      })
    } else {
      wx.setNavigationBarTitle({
        title: '预算体验'
      })
    }
  },

  // 打开提示窗口
  tipOpenModal:function(){
    this.setData({
      hiddenTipModal: false
    })
  },

  // 关闭提示弹窗
  onCloseTipModal: function () {
    this.setData({
      hiddenTipModal: true
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