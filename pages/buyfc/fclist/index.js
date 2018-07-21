// pages/list/list.js
const app = getApp()
const api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    displayType:'fucai',
    currentSelectId:'',
    scrollTop:0,
    isScroll: true,
    currentGoodsPage: 0,
    loadedGoods: false,
    currentGoodsLoaded: false,
    keyword:'',
    code:{
      currentCode1: '',
      currentCode2: '',
      currentCode3: ''
    },
    fBrandName:'',
    fMatColor:'',
    fNorms:'',
    fPrice:'',
    fQuality:'',
    fShopCityID:'',
    goodsList:[],
    filterList:[],
    filterIcon:"./image/filter.png",
    actionSheetHidden: true
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.catname || '多维辅材商城'
    })
    this.setData({
      code: {
        currentCode1: options.code1 || "",
        currentCode2: options.code2 || "",
        currentCode3: options.code3 || ""
      },
      keyword: options.keyword || "",
      fShopCityID: options.fShopCityID || "",
      currentSelectId: options.selectid || ''
    })
    this.getFilterField()
    this.getGoodsList()
  },

// 获取过滤列表
  toggleActionSheet: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },

  actionSheetChange: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },

// 获取当前分类
  onChangeCurrentCate:function(e){
    this.setData({
      code: e.detail,
      keyword: '',
      fBrandName: '',
      fMatColor: '',
      fNorms: '',
      fPrice: '',
      fQuality: '',
      fShopCityID: '',
      flag:'',
      loadedBrand: false,
      currentBrandPage: 0,
      loadedGoods: false,
      currentGoodsPage: 0,
      brandList: [],
      goodsList: []
    })
    this.getFilterField()
    this.getGoodsList()
  },

  // 获取过滤条件列表
  getFilterField: function () {
    api.getFilterField({
      data: {
        fCityID: app.globalData.cityId,
        fSeriesCode: this.data.code.currentCode3 || this.data.code.currentCode2 || this.data.code.currentCode1,
        fSelectMatDetailID: this.data.currentSelectId || ''
      },
      success: (res) => {
        let list = res.data.data.list
        list.forEach((item)=>{
          item.list.forEach((elem,index)=>{
            elem['checked'] = index>0?false:true
          })
        })
        this.setData({
          filterList:list
        })
      }
    })
  },

  // 搜索商品列表
  onSearch: function (e) {
    this.setData({
      loadedGoods: false,
      currentGoodsPage: 0,
      goodsList: [],
      keyword: e.detail
    })
    this.getGoodsList()
  },

  // 获取当前分类的商品列表
  getGoodsList: function () {
    this.setData({
      currentGoodsLoaded: true,
    })
    if (!this.data.loadedGoods) {
      wx.showLoading({
        title: '加载中',
      })
      api.getGoodsList({
        data: {
          fSeriesCode: this.data.code.currentCode3 || this.data.code.currentCode2 || this.data.code.currentCode1,
          num: this.data.currentGoodsPage,
          keyword: this.data.keyword,
          fBrandName: this.data.fBrandName,
          fMatColor: this.data.fMatColor,
          fNorms: this.data.fNorms,
          fPrice: this.data.fPrice,
          fQuality: this.data.fQuality,
          fShopCityID: this.data.fShopCityID,
          fCityID: app.globalData.cityId,
          fSelectMatDetailID: this.data.currentSelectId || '',
          lat: app.globalData.area.latitude || '',
          lng: app.globalData.area.longitude || ''
        },
        success: (res) => {
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
          let goodsList = res.data.data
          this.setData({
            currentGoodsLoaded: false,
            goodsList: this.data.goodsList.concat(goodsList)
          })
          if (goodsList && goodsList.length < 10) {
            this.setData({
              loadedGoods: true,
            })
          }else{
            this.setData({
              currentGoodsPage: this.data.currentGoodsPage + 1
            })
          }
        },
        fail:(res)=>{
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1500
          })
        }
      });
    }
  },

  // 点击品牌列表页获取当前的商品列表
  onUpdateGoodsList:function(e){
    this.setData({
      keyword: '',
      fMatColor: '',
      fNorms: '',
      fPrice: '',
      fQuality: '',
      fShopCityID: '',
      loadedGoods: false,
      currentGoodsPage: 0,
      goodsList: [],
      currentType: 'goods',
      fBrandName: e.detail,
      scrollTop: 0
    })
    this.getGoodsList()
  },

  // 获取过滤的列表数据
  filterSearch:function(e){
    this.setData({
      loadedGoods: false,
      actionSheetHidden:true,
      currentGoodsPage: 0,
      goodsList: [],
      fBrandName: e.detail.fBrandName.length ? e.detail.fBrandName.join(','):'',
      fMatColor: e.detail.fMatColor.length ? e.detail.fMatColor.join(',') : '',
      fNorms: e.detail.fNorms.length ? e.detail.fNorms.join(',') : '',
      fPrice: e.detail.fPrice.length ? e.detail.fPrice.join(',') : '',
      fQuality: e.detail.fQuality.length ? e.detail.fQuality.join(',') : '',
      fShopCityID: e.detail.fShopCityID.length ? e.detail.fShopCityID.join(',') : ''
    })
    this.getGoodsList()
  },

  // 重置过滤的列表数据
  resetFilterSearch: function (e) {
    this.setData({
      loadedGoods: false,
      currentGoodsPage: 0,
      brandList: [],
      goodsList: [],
      fBrandName: e.detail.fBrandName.length ? e.detail.fBrandName.join(',') : '',
      fMatColor: e.detail.fMatColor.length ? e.detail.fMatColor.join(',') : '',
      fNorms: e.detail.fNorms.length ? e.detail.fNorms.join(',') : '',
      fPrice: e.detail.fPrice.length ? e.detail.fPrice.join(',') : '',
      fQuality: e.detail.fQuality.length ? e.detail.fQuality.join(',') : '',
      fShopCityID: e.detail.fShopCityID.length ? e.detail.fShopCityID.join(',') : ''
    })
    this.getGoodsList()
  },

  scrollLower:function(e){
    if (!this.data.loadedGoods && e.detail.direction == 'bottom') {
      if (!this.data.currentGoodsLoaded) { this.getGoodsList() }
    } else {
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