// pages/order/list/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fReceiptNo:'',
    fSaleOrderID: '',
    DelIcon: '../../../../image/order/del.png',
    defaltimg: '../../../../image/default-img.png',
    DataList:[],
    fAmount: 0,
    flag:0,
    fUserID:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: options.fTypeCategory,
    })
    that.setData({
      fSaleOrderID: options.fSaleOrderID,
      flag: options.flag,
      fUserID: options.fUserID
    })
    that.GetInfoData()
  },

  /**
     * 页面相关事件处理函数--getdata
     */
  GetInfoData: function () {
    var that = this
    wx.request({
      url: app.globalData.posturl + 'wx/shopOrder/queryOrderDetail.do', //url 不能出现端口号
      data: {
        fSaleOrderID: that.data.fSaleOrderID,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          fReceiptNo: res.data.data.fReceiptNo,
          DataList: res.data.data.list,
          fAmount: res.data.data.fAmount,
          flag: res.data.data.flag
        })
      },
      method: 'GET'
    });
  },
  /**
  * 页面相关事件处理函数--跳转详情列表
  */
  ToEvaluate: function (e) {
    wx.navigateTo({
      url: '../../evaluate/index?fSaleOrderID=' + e.currentTarget.dataset.fid,
      success: function (res) {
      }
    })
  },
  
  /**
 * 订单支付
 */
  payOrder: function (e) {
    wx.navigateTo({
      url: '/pages/order/settlement/index?TotleAccont=' + e.currentTarget.dataset.amount + '&OIDList=' + e.currentTarget.dataset.soid,
      success: function (res) {
      }
    })
  },

  DelOrder: function() {
    var that = this
    wx.showModal({
      title: '警告',
      content: '删除订单将无法在本小程序内再次查找到此订单',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.posturl + 'wx/shopOrder/deleteSaleorder.do', //url 不能出现端口号
            data: {
              fSaleOrderID: that.data.fSaleOrderID,
              fUserID: that.data.fUserID,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              wx.navigateBack()
            },
            fail: function (res) {
              wx.showModal({
                title: '提示',
                content: '删除失败，您可以稍后重试或者（在工作时间内）联系多维客服帮你处理此订单',
                success: function (res) {
                  if (res.confirm) {
                  } else if (res.cancel) {
                  }
                }
              })
            },
            method: 'GET'
          });
        } else if (res.cancel) {

        }
      }
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
