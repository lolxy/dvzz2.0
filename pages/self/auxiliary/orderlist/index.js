// pages/self/auxiliary/orderlist/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grkdIcon:'../../../../image/auxiliary/grkd.png',
    fcmallIcon: '../../../../image/auxiliary/fcsc.png',
    statusList: [
      {
        type: 0,
        name: '未付款'
      }, {
        type: 1,
        name: '待收货'
      }, {
        type: 2,
        name: '待评价'
      }, {
        type: 3,
        name: '退货'
      },{
        type: 'all',
        name: '全部'
      }],
    OrderList: [],
    CurrentCode: 'F',//这里仅显示辅材订单
    Currentsum: 0,//默认显示装修建材
    flag: 0,//默认显示未付款
    num: 0,//默认显示第一页
    maxpage: 1, //最大页码(每个页面单独页码)
    menuimg: '../../../../image/jt1.png',
    loadimg:'../../../../image/loadimg.png',
    SelectAll: 0,
    totle: 0,
    IsVisible: false,
    Visibleicon: '../../../../image/auxiliary/dd-del.png',
    OpenID: '',
    OIDList:[],
    fCustomerID:app.globalData.fCustomerID,
    userInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '辅材商城',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.setData({
      fCustomerID: app.globalData.fCustomerID,
      OIDList:[],
      SelectAll:0
    })
    that.GetOrderInfo()
  },

  // 阻止跳转
  stopNavigater: function () {
    return false;
  },

  /**
   * 页面相关事件处理函数--切换code状态
   */
  ChangeFlags: function (e) {
    var that = this
    if (e.currentTarget.dataset.flag != that.data.flag) {
      that.setData({ 
        flag: e.currentTarget.dataset.flag,
        OIDList: [],
        SelectAll: 0,
        num: 0
      })
      that.GetOrderInfo()
    }
  },

  /**
   * 数据请求处理函数---获取订单列表信息
   */
  GetOrderInfo: function (e) {
    var that = this
    var fcode
    if (that.data.flag == 4) {
      fcode = ''
    } else {
      fcode = that.data.flag
    }
    if (app.globalData.fCustomerID){
      wx.request({
        url: app.globalData.posturl + 'wx/shopOrder/queryOrderList.do', //url 不能出现端口号
        data: {
          fCustomerID: app.globalData.fCustomerID,
          fType: that.data.CurrentCode,
          flag: that.data.flag,
          num: that.data.num
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (that.data.num > 0) {
            let n = that.data.OrderList.length
            for (let i = 0; i < res.data.data.length; i++) {
              let item = 'OrderList[' + (i + n) + ']'
              that.setData({
                [item]: res.data.data[i],
                maxpage: res.data.totalPage
              })
            }
            that.setData({ IsVisible: false })
          } else {
            if (res.data.data.length > 0) {
              that.setData({ IsVisible: false })
            } else {
              that.setData({ IsVisible: true })
            }
            that.setData({
              OrderList: res.data.data,
              maxpage: res.data.totalPage
            })
          }
        },
        method: 'GET'
      });
    }
  },
  /**
   * 页面相关事件处理函数--切换checkbox点击切换
   */
  checkboxChange: function (e) {
    var that = this
    for (let i = 0; i < that.data.OrderList.length; i++) {
      let item = 'OrderList[' + i + '].Selected'
      that.setData({
        [item]: false
      })
    }
    that.setData({
      OIDList: []
    })
    for (let i = 0; i < e.detail.value.length; i++) {
      let n = e.detail.value[i]
      let item = 'OrderList[' + n + '].Selected'
      let itemb = 'OIDList[' + i + ']'
      that.setData({
        [item]: true,
        [itemb]: that.data.OrderList[n].fSaleOrderID
      })
    }
    that.setData({
      SelectAll: that.data.OIDList.length == that.data.OrderList.length?1:0
    })
    that.SumTotle()
  },
  //统计已选取的总金额
  SumTotle: function () {
    var that = this
    that.setData({ totle: 0 })
    for (let i = 0; i < that.data.OrderList.length; i++) {
      if (that.data.OrderList[i].Selected == true) {
        that.setData({
          totle: that.data.totle + parseFloat(that.data.OrderList[i].fAmount)
        })
      }
    }
  },
  /**
  * 页面相关事件处理函数--切换checkbox点击切换
  */
  SelectAll: function (e) {
    var that = this
    let OIDList = that.data.OrderList.map(item => {
      return item.fSaleOrderID
    })
    if (e.detail.value.length > 0) {
      for (let i = 0; i < that.data.OrderList.length; i++) {
        let item = 'OrderList[' + i + '].Selected'
        that.setData({
          [item]: true
        })
      }
      that.setData({
        OIDList: OIDList,
        SelectAll:true
      })
    } else {
      for (let i = 0; i < that.data.OrderList.length; i++) {
        let item = 'OrderList[' + i + '].Selected'
        that.setData({
          [item]: false
        })
      }
      that.setData({
        OIDList: [],
        SelectAll: false
      })
    }
    that.SumTotle()
  },

  /**
   * 页面相关事件处理函数--跳转详情列表
   */
  ToList: function (e) {
    wx.navigateTo({
      url: '/pages/self/auxiliary/orderdetail/index?fSaleOrderID=' + e.currentTarget.dataset.fid + '&fTypeCategory=' + e.currentTarget.dataset.item
    })
  },
  
  // 跳转到工人开单明细页
  jumpToOrderDetail:function(e) {
    wx.navigateTo({
      url:'../grkd/index?type=1'
    })
  },

  // 跳转到辅材商城列表页
  jumpToMallList: function (e) {
    wx.navigateTo({
      url: `/pages/self/fclist/index?code1=F`
    })
  },

  ToEvaluate: function (e) {
    wx.navigateTo({
      url: '/pages/order/evaluate/index?fSaleOrderID=' + e.currentTarget.dataset.fid
    })
  },

  ToNoSettlement:function(){
    wx.showToast({
      title: '请选择要结算的订单！',
      icon: 'none',
      duration: 1000,
      mask: true
    })
  },

  //结算
  ToSettlement: function (e) {
    var that = this
    if (app.globalData.fOpenID == '') {
      wx.showModal({
        title: '温馨提示',
        content: '您必须先登录才能结算订单',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/mine/login/index',
            })
          } else if (res.cancel) {
            wx.navigateTo({
              url: '/pages/mine/login/index',
            })
          }
        }
      })
    } else {
      if (app.globalData.userInfo) {
        that.setData({
          userInfo: app.globalData.userInfo
        })
        wx.navigateTo({
          url: '/pages/order/settlement/index?TotleAccont=' + that.data.totle + '&OIDList=' + e.currentTarget.dataset.soid
        })
      }
    }
  },
  // 判断是否确认收货
  sureorder: function (e) {
    var that = this
    wx.showModal({
      title: '确认收货',
      content: '为避免不必要的损失，请在确认收到所货品之后点击确认收货',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.posturl + 'wx/shopOrder/updateSaleOrder.do', //url 不能出现端口号
            data: {
              fSaleOrderID: e.currentTarget.dataset.soid,
              fUserID: app.globalData.userInfo.fUserID
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              that.GetOrderInfo()
            },
            method: 'GET'
          });
        } else if (res.cancel) {
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const that = this
    that.setData({
      OrderList: [],
      num: 0
    })
    that.GetOrderInfo()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (that.data.num == that.data.maxpage - 1) {
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
      that.GetOrderInfo()
    }
  },

  GetBindsta: function () {
    var that = this
    wx.request({
      url: app.globalData.posturl + 'wx/personalcenter/queryUserInfo.do', //url 不能出现端口号
      data: { fOpenID: that.data.OpenID },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        app.globalData.userInfo = res.data.data
        if (res.data.code == 1) {
          that.setData({
            userInfo: res.data.data,
          })
          that.GetOrderInfo(that.data.userInfo)
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '您还没有绑定微信，请先绑定用户，',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/mine/bind/index',
                })
              } else if (res.cancel) {
              }
            }
          })
        }
      },
      method: 'GET'
    });
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
