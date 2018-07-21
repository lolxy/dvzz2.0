// components/selectBrand/item.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fid:{
      type:String,
      observer: function (newVal,oldVal) {
        this.getBrandList()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tableDataList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    formSubmit: function (e) {
      var that = this
      //特殊处理提交列表型表单
      var postdata = {
        fID: that.data.fid,
        rels: []
      }
      for (var i = 0; i < e.detail.value['categorynum']; i++) {

        //利用中间变量组成键值对
        var listdata = {}
        listdata['fMatColor'] = e.detail.value['category' + i]
        listdata['fBrandName'] = e.detail.value['brand' + i] //fBrandName 为实际提交name
        postdata.rels[i] = listdata
      }

      wx.request({
        url: app.globalData.posturl + 'wx/shop/confirmBrand.do', //url 不能出现端口号
        data: postdata,
        header: {
          'content-type': 'application/json' // 默认值
        },
        complete: function (res) {
          that.triggerEvent('update', res.data.data)
        },
        method: 'POST'
      });
    },

    /**
     * 页面相关事件处理函数--get品牌选择
     */
    getBrandList: function () {
      var that = this
      wx.request({
        url: app.globalData.posturl + 'wx/shop/queryBrandList.do', //url 不能出现端口号
        data: { fID: that.data.fid },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          that.setData({
            tableDataList: res.data.data
          })
        },
        method: 'GET'
      });
    },
    /**
     * 页面相关事件处理函数----changeactive
     */
    changeindex: function (e) {
      var that = this
      for (let i = 0; i < that.data.tableDataList[e.currentTarget.dataset.idx].list.length; i++) {
        var mitem = 'tableDataList[' + e.currentTarget.dataset.idx + '].list[' + i + '].fIsDefault'
        that.setData({
          [mitem]: 0
        })
      }
      var nitem = 'tableDataList[' + e.currentTarget.dataset.idx + '].list[' + e.currentTarget.dataset.idy + '].fIsDefault'
      that.setData({
        [nitem]: 1
      })
    }
  }
})
