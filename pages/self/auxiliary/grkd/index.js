// pages/self/auxiliary/grkd/index.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    StatusList: [],
    fMPDItemlist:[[]],
    flag: 0,
    currentHasBrand:0,
    currentCode:'',
    currentMatCode:'',
    currentCatName:'',
    currentfID:'',
    ArrowRight: '../../../../image/jt1.png',
    Isdefault: 0,
    actionSheetHidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '工人开单',
    })
    this.setData ({
      Isdefault: options.type
    })
    this.GetBillType()
  },

  /**
   * 页面相关事件处理函数--get大类tabs
   */
  GetBillType: function () {
    var that = this
    wx.request({
      url: `${app.globalData.posturl}wx/shop/openBillType.do`, //url 不能出现端口号
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          currentfID: res.data.data[0].fID, //初始化当前大类
          currentCode: res.data.data[0].fCode,
          currentMatCode: res.data.data[0].fMatCode,
          currentCatName: res.data.data[0].fValue
        })
        that.setData({
          tabs: res.data.data
        })
        that.GetBillProject()
      },
      method: 'GET'
    });
  },
  /**
   * 页面相关事件处理函数--get项目tabs
   */
  GetBillProject: function () {
    var that = this
    wx.request({
      url: app.globalData.posturl + 'wx/shop/openBillProject.do', //url 不能出现端口号
      data: { fID: that.data.currentfID},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let StatusList = res.data.data
        that.setData({
          StatusList: StatusList,
          currentHasBrand: StatusList[0].flag
        })
        that.showtabledata()
      },
      method: 'GET'
    });
  },
  /**
   * 页面相关事件处理函数--切换大类tabs
   */
  TabChange: function (e) {
    var that = this
    if (e.currentTarget.dataset.currentfID === that.data.currentfID) {
    } else {
      that.setData({
        currentCode: e.currentTarget.dataset.tabcode,
        currentfID: e.currentTarget.dataset.fid,
        currentMatCode: e.currentTarget.dataset.fcode,
        currentCatName: e.currentTarget.dataset.name,
        flag: 0,
        fMPDItemlist:[[]]
      })
      that.GetBillProject()
    }
  },
  /**
   * 页面相关事件处理函数--切换大类flag
   */
  ChangeFlags: function (e) {
    var that = this
    if (e.currentTarget.dataset.flag === that.data.flag) {
      that.setData({ num: 0 })
    } else {
      that.setData({
        flag: e.currentTarget.dataset.flag,
        currentHasBrand: e.currentTarget.dataset.brand,
        num: 0
      })
    }
  },
  /**
  * 页面相关事件处理函数--跳转详情
  */
  ToDetail: function (e) {
    var that = this
    wx.navigateTo({
      url: '../detail/index?fMatName=' + e.currentTarget.dataset.fmname + '&fNorms=' + e.currentTarget.dataset.fnorms + '&fPrice=' + e.currentTarget.dataset.fprice + '&fUnitName=' + e.currentTarget.dataset.funitname +'&fBrandName=' + e.currentTarget.dataset.fbname + '&fConf=' + e.currentTarget.dataset.fconf + '&fUrl=' + e.currentTarget.dataset.furl
    })
  },

  ToNoBrand:function(){
    wx.showToast({
      title: '当前类别下的商品不可选品牌',
      icon:'none'
    })
  },

  /**
  * 页面相关事件处理函数--跳转详情
  */
  // ToBranks: function(e) {
  //   var that = this
  //   wx.navigateTo({
  //     url: '../brand/index?fID=' + e.currentTarget.dataset.fid,
  //     success: function (res) {
  //     }
  //   })
  // },
  selectBrand:function(){
    this.setData({
      actionSheetHidden:false
    });
  },
  ToShopCity: function(e) {
    var that = this
    wx.navigateTo({
      url: `/pages/self/fclist/index?code1=F&code2=${this.data.currentMatCode}&catname=${this.data.currentCatName}`
    })
  },
  showtabledata: function (e) {
    var that = this
    if (that.data.StatusList.length>0){
      var item = that.data.StatusList
      for (let i = 0; i < item.length;i++){
        if (item[i].list){
          var itemlist = item[i].list
          var nitemtype = 'fMPDItemlist[' + i + '].fType'
          that.setData({
            [nitemtype]: item[i].fType
          })
          var k=0
          for (let j = 0; j < itemlist.length;j++)  {
            if (j==0){
              var mitem = 'fMPDItemlist[' + i + '].list['+k+']'
              that.setData({
                [mitem]: item[i].list[j].fMPDItem
              })
              k++
            }else{
              if (item[i].list[j].fMPDItem != item[i].list[j-1].fMPDItem){
                var mitemfMPDItem = 'fMPDItemlist[' + i + '].list[' + k + ']'
                that.setData({
                  [mitemfMPDItem]: item[i].list[j].fMPDItem
                })
                k++
              }
            }
          }
        } else{
        let nitem ='fMPDItemlist[' + i + ']'
          that.setData({
            [nitem]: []
          })
        }
      }
    }else {
      that.setData({
        fMPDItemlist: [[]]
      })
    }
  },

  actionSheetChange: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },

  // 选品牌后回调函数
  onUpdate:function(e){
    this.setData({
      actionSheetHidden:true,
      StatusList: e.detail
    });
    this.showtabledata()
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
