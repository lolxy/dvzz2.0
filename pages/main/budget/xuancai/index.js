// pages/main/budget/index/index.js
const app = getApp();
const api = require("../../../../utils/api.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCode:'',
    currentMenu:'',
    currentMenuID:'',
    currentSubMenu:'',
    currentSubMenuId:'',
    currentSubMenuName:'',
    switchType:1,
    addIcon: './image/add.png',
    sysIcon: './image/qrimg.png',
    managerIcon: './image/manager.png',
    rightIcon: './image/right.png',
    mapIcon: './image/map.png',
    cartIcon: './image/cart.png',
    dellIcon: './image/dell.png',
    windowWidth: app.systemInfo.windowWidth,
    sumPrice:0,
    hiddenModal:true,
    hiddenTipModal: true,
    menuList:[],
    subMenuList:[],
    managerGoodsList:[],
    goodsList: [],
    isManager: false,
    isComfirm:false,
    hiddenComfirmModal: true,
    modalContent: "",
    selectMainArr:[],
    selectArr:[],
    isCanAllChecked:false,
    currentSaleStatus:false,
    canSelectGoodList:[],
    checkAll:false,
    currentSelfBuyId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentCode: options.code,
      currentMenu: options.subcode,
      currentMenuID: options.id
    }) 
    this.getBudgetCatList()
  },

  onShow: function () { 
    if (this.data.currentMenu){
      this.getBudgetByIdCatList()
    }
    if (app.globalData.fCustomerName && app.globalData.fSelectMatType != 'virtual'){
      wx.setNavigationBarTitle({
        title: `${app.globalData.fCustomerName}`
      })
    }else{
      wx.setNavigationBarTitle({
        title: '预算体验'
      })
    }
  },

  // 获取二级类别
  getCurrentMenuData:function(e){
    this.data.selectMainArr = []
    this.setData({
      isComfirm: false,
      isManager: false,
      selectMainArr: this.data.selectMainArr,
      currentMenu:e.currentTarget.dataset.code,
      currentMenuID: e.currentTarget.dataset.id,
      currentSaleStatus: e.currentTarget.dataset.num?true:false
    })
    this.getBudgetByIdCatList()
  },

  // 获取三级类别
  getCurrentSubMenuData: function (e) {
    this.setData({
      isComfirm: false,
      isManager: false,
      currentSubMenu: e.currentTarget.dataset.code,
      currentSubMenuId: e.currentTarget.dataset.id,
      currentSubMenuName: e.currentTarget.dataset.fvalue,
      managerGoodsList: e.currentTarget.dataset.list
    })
    this.getBudgetGoodsList()
  },

  // 切换选材类型
  getSwitchType:function(e){
    this.setData({
      switchType: e.currentTarget.dataset.type
    })
  },

  // 打开新增元素弹窗
  addItem:function(){
    this.setData({
      hiddenModal: false
    })
  },

  // 执行弹窗的状态切换
  actionModal:function(e){
    this.setData({
      hiddenModal: e.detail
    })
  },

  onUpdateList:function(e){
    this.getBudgetGoodsList()
  },

  // 确认是否生成订单
  comfirmOrder:function(){
    if (this.data.isCanAllChecked && this.data.currentSaleStatus){
      this.setData({
        isComfirm: true
      })
    }else{
      wx.showToast({
        title: '当前状态不允许生成订单！',
        icon:'none'
      })
    }
  },

  //点击管理执行结果
  openManager: function () {
    this.setData({
      isManager: true
    })
  },

  // 是否自购确认
  goToselfBuy: function () {
    this.setData({
      hiddenComfirmModal: false,
      modalContent: "确定要自购吗？",
      comfirmType:"selfBuy"
    })
  },

  // 是否取消自购确认
  canceSelfBuy: function (e) {
    this.setData({
      hiddenComfirmModal: false,
      modalContent: "确定要取消自购吗？",
      comfirmType: "canceSelfBuy",
      currentSelfBuyId: e.currentTarget.dataset.selectid
    })
  },

  // 是否删除
  dellItem: function () {
    this.setData({
      hiddenComfirmModal: false,
      modalContent: "确定要删除吗？",
      comfirmType: "dell"
    })
  },
  // 执行提示框确认动作
  actionComfirm: function (e) {
    let arr = this.data.selectArr
    let comfirmType = this.data.comfirmType
    this.setData({
      hiddenComfirmModal: e.detail
    })
    if (comfirmType == 'saveOrder') {
      let arrs = this.data.selectMainArr
      if (this.data.isCanAllChecked && !this.data.isManager) {
        if (!arrs.length) {
          wx.showToast({
            title: '请选择您要操作的选材项',
            icon: 'none'
          })
          return false
        } else {
          api.addSaleorder({
            data: {
              ids: arrs,
              fSelectMatID: app.globalData.fSelectMatID,
              fID: this.data.currentMenuID
            },
            method: 'post',
            success: (res) => {
              wx.showToast({
                title: '订单生成成功！',
                icon: 'none'
              })
              this.data.selectMainArr = []
              this.data.selectArr = []
              this.setData({
                selectMainArr: this.data.selectMainArr,
                selectArr: this.data.selectArr
              })
              this.getBudgetGoodsList()
            }
          })
        }
      } else {
        wx.showToast({
          title: '对不起，当前状态不能生成订单！',
          icon: 'none'
        })
      }
    }
    if (comfirmType == 'dell' || comfirmType == 'selfBuy'){
      if (!arr.length) {
        wx.showToast({
          title: '请选择您要操作的选材项',
          icon: 'none'
        })
        return false
      }
      if (comfirmType == 'selfBuy') {
        api.selfBuy({
          data: {
            ids: arr
          },
          method: 'post',
          success: (res) => {
            wx.showToast({
              title: '当前选择的选项自购成功！',
              icon: 'none'
            })
            this.getBudgetGoodsList()
          }
        })
      }
      if (comfirmType == 'dell') {
        api.dellSelectMat({
          data: {
            fSelectMatDetailID: arr.join(',')
          },
          success: (res) => {
            wx.showToast({
              title: '当前选择的选项删除成功！',
              icon: 'none'
            })
            this.getBudgetGoodsList()
          }
        })
      }
    }
    if (comfirmType == 'canceSelfBuy') {
      api.cancelSelfBuy({
        data: {
          ids: Array.of(this.data.currentSelfBuyId)
        },
        method: 'post',
        success: (res) => {
          wx.showToast({
            title: '取消自购成功！',
            icon: 'none'
          })
          this.getBudgetGoodsList()
        }
      })
    }
  },

  // 执行提示框取消动作
  actionClose: function (e) {
    this.setData({
      hiddenComfirmModal: e.detail
    })
  },

  // 取消管理
  canceManager: function () {
    this.setData({
      isManager: false
    })
    this.clearAllChecked()
  },

  // 获取预算分类列表
  getBudgetCatList: function () {
    api.getBudgetCatList({
      data: {
        fSelectMatID: app.globalData.fSelectMatID,
        fCode: this.data.currentCode
      },
      success: (res) => {
        let menuList = res.data.data
        let currentMenu = this.data.currentMenu
        this.setData({
          menuList: menuList,
          currentMenu: currentMenu ?currentMenu:menuList[0].fCode
        })
        if (this.data.currentMenu){
          let currentItem = menuList.find(item => item.fCode === this.data.currentMenu)
          this.setData({
            currentSaleStatus: currentItem.num ? true : false
          })
          this.getBudgetByIdCatList()
        }
      }
    })
  },

  // 获取当前二级分类下的三级分类列表
  getBudgetByIdCatList:function(){
    api.getBudgetByIdCatList({
      data:{
        fSelectMatID: app.globalData.fSelectMatID,
        fCode: this.data.currentMenu
      },
      success:(res)=>{
        let subMenuList = res.data.data
        this.setData({
          subMenuList: subMenuList,
          currentSubMenu:subMenuList[0].fCode,
          currentSubMenuId: subMenuList[0].fID,
          currentSubMenuName: subMenuList[0].fValue,
          managerGoodsList: subMenuList[0].list
        })
        this.getBudgetGoodsList()
      }
    })
  },

  // 获取主材预算产品列表
  getBudgetGoodsList:function(){
    let goodsList = this.data.managerGoodsList
    let newGoodsList = []
    let keyNameArr = goodsList.map(item => {
      return item.fSpace
    })
    let keyNameArrUniq = new Set(keyNameArr)
    keyNameArrUniq.forEach((item,index) => {
      let children = goodsList.filter((elem) => elem.fSpace === item)
      let goodsJson = {
        'spaceName': item,
        'children': children
      }
      newGoodsList.push(goodsJson)
    })
    let sumPrice = 0
    let isCanAllChecked = goodsList.some(item=>{
      return !item.fIsSelfBuy && !item.fIsGenerated && item.fAmount
    })
    let canSelectGoodList = []
    goodsList.forEach(item=>{
      item.checked = true
      if (!item.fIsSelfBuy && !item.fIsGenerated && item.fAmount){
        canSelectGoodList = canSelectGoodList.concat(item)
        // selectArr.push(item.fSelectMatDetailID)
      }
      if (item.fAmount && !item.fIsSelfBuy){
        sumPrice = sumPrice + parseFloat(item.fAmount)
      } 
    })
    // this.data.selectMainArr = this.data.selectMainArr.concat(selectArr)
    this.setData({
      // checkAll:true,
      // selectArr: selectArr,
      isCanAllChecked: isCanAllChecked,
      goodsList: newGoodsList,
      canSelectGoodList: canSelectGoodList,
      sumPrice: sumPrice,
      selectMainArr: Array.from(new Set(this.data.selectMainArr))
    })
  },

  // 跳转到当前选材明细页
  gotoSelectMatDetail:function(e){
    wx.navigateTo({
      url: `/pages/main/budget/detail/index?id=${e.currentTarget.dataset.selectid}&typeId=${this.data.currentSubMenuId}&title=${e.currentTarget.dataset.title}`
    })
  },

  // 跳转到选材商品列表页
  gotoGoodsList:function(e){
    wx.navigateTo({
      url: `/pages/main/list/index?code1=${this.data.currentCode}&&code2=${this.data.currentMenu}&code3=${this.data.currentSubMenu}&displayType=budget&catname=${this.data.currentSubMenuName}&selectid=${e.currentTarget.dataset.selectid}`
    })
  },

  // 单个选择元素
  selectItem:function(e){
    let value = e.currentTarget.dataset.checked
    let index = e.currentTarget.dataset.index
    let arr = this.data.selectArr
    let selectMainArr = this.data.selectMainArr
    let managerGoodsList = this.data.managerGoodsList
    let checked = managerGoodsList[index].checked
    managerGoodsList[index].checked = !checked
    if (checked){
      arr.splice(arr.findIndex(item => item === value), 1)
      selectMainArr.splice(selectMainArr.findIndex(elem => elem === value), 1)
      if (managerGoodsList[index].fAmount) {
        this.data.sumPrice = this.data.sumPrice - parseFloat(managerGoodsList[index].fAmount)
      }
    }else{
      arr.push(value)
      selectMainArr.push(value)
      if (managerGoodsList[index].fAmount) {
        this.data.sumPrice = this.data.sumPrice + parseFloat(managerGoodsList[index].fAmount)
      }
    }
    this.setData({
      managerGoodsList: managerGoodsList,
      checkAll: arr.length === this.data.canSelectGoodList.length ? true:false,
      selectArr: Array.from(new Set(arr)),
      sumPrice: this.data.sumPrice,
      selectMainArr: Array.from(new Set(this.data.selectMainArr))
    })
  },
  // 全部选择元素
  selectAllItem:function(){
    // let selectMainArr = this.data.selectMainArr
    let arr = this.data.canSelectGoodList.map(item=>{
      return item.fSelectMatDetailID
    })
    // let checkAll = !this.data.checkAll
    this.data.sumPrice = 0
    if(checkAll){      
      this.data.managerGoodsList.forEach(item=>{
        if (!item.fIsSelfBuy && !item.fIsGenerated) {
          item.checked = true
        }
      })
      this.data.canSelectGoodList.forEach(item => {
        if (item.fAmount) {
          this.data.sumPrice = this.data.sumPrice + parseFloat(item.fAmount)
        }
        // selectMainArr.push(item.fSelectMatDetailID)
      })
    }else{
      this.data.canSelectGoodList.forEach(item => {
        item.checked = false
        // selectMainArr.splice(selectMainArr.findIndex(elem => elem === item.fSelectMatDetailID), 1)
      })
    }

    this.setData({
      managerGoodsList: this.data.managerGoodsList,
      // checkAll: checkAll,
      // selectArr: checkAll ? Array.from(new Set(arr)):[],
      sumPrice: this.data.sumPrice,
      // selectMainArr: Array.from(new Set(this.data.selectMainArr))
    })
  },

  // 清空全部选择
  clearAllChecked:function(){
    this.data.managerGoodsList.forEach(item => {
      item.checked = false
    })
    this.setData({
      managerGoodsList: this.data.managerGoodsList,
      checkAll: false,
      selectArr:[]
    })
  },

  // 扫码选材
  scanCode: function (e) {
    const that = this
    let fSelectMatDetailID = e.currentTarget.dataset.selectid
    let amount = e.currentTarget.dataset.amount
    wx.scanCode({
      success: function (res) {
        if (res.result) {
          api.getScanCode({
            data: {
              fMatCode: res.result,
              fSelectMatDetailID: fSelectMatDetailID
            },
            success: (res) => {
              if (res.data.data.fMatID) {
                that.addSelectMatDetail(fSelectMatDetailID,res.data.data.fMatID)
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

  // 加入选材
  addSelectMatDetail: function (currentSelectMatDetailId,currentGoodsId) {
    api.addMatToSelectDetail({
      data: {
        fSelectMatDetailID: currentSelectMatDetailId,
        fMatID: currentGoodsId
      },
      success: (res) => {
        wx.showToast({
          title: '成功选材！',
        })
        this.getBudgetGoodsList()
      },
      fail: (res) => {
        wx.showToast({
          title: '选材失败！'
        })
      }
    })
  },

  // 生成订单
  addSaleorder:function(){
    if (this.data.isCanAllChecked && !this.data.isManager) {
      this.setData({
        hiddenComfirmModal: false,
        modalContent: "确定要生成订单吗？",
        comfirmType: "saveOrder"
      })
    } else {
      wx.showToast({
        title: '对不起，当前状态不能生成订单！',
        icon: 'none'
      })
    }
  },

  // 打开提示窗口
  tipOpenModal: function () {
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