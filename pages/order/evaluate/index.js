// pages/order/evaluate/index.js
var app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mainEvaluate:{},
    EvaluateList:[],
    CurrentValue0: 0,
    CurrentEvaluate0: '',
    CurrentName0: '',
    CurrentValue: [],
    CurrentEvaluate: ['',''],
    CurrentName: ['',''],
    OtherList:[],
    SolidStar: '../../../image/order/ic_star_2.png',
    hollow: '../../../image/order/ic_star_1.png',
    isnormal: 1,
    Remark:'',
    defaultimg: '../../../image/default-img.png',
    transicon: '../../../image/pmt.png',
    delicon: '../../../image/del-icon.png',
    listpic: [],
    fSaleOrderID:'',
    PostPicdata:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ fSaleOrderID: options.fSaleOrderID})
    this.GetEvaluateItem()
  },

  switch1Change:function(e){
    var that = this
    if(e.detail.value){
      that.setData({
        isnormal: 1
      })
    }else{
      that.setData({
        isnormal: 0
      })
    }
  },
  /**
   * 页面相关事件处理函数----切换星标1
   */
  changeStar1: function(e) {
    var that = this
    if (e.target.dataset.index === that.data.CurrentValue0) {

    }else{
      that.setData({
        CurrentValue0: e.target.dataset.index,
        CurrentEvaluate0: e.target.dataset.value,
        CurrentName0: e.target.dataset.name
      })
    }
  },
  /**
   * 页面相关事件处理函数----获取评分项目
   */
  GetEvaluateItem: function (e) {
    var that = this
    wx.request({
      url: app.globalData.posturl + 'wx/shopCity/initEvaluate.do', //url 不能出现端口号
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        for (let i = 0; i < res.data.data.evaluateDatas.length;i++){
          var item = 'EvaluateList[' + i + ']'
          that.setData({
            [item]: res.data.data.evaluateDatas[4 - i]  //为方便按钮点击事件倒置数组
          })
        }
        that.setData({
          mainEvaluate: res.data.data.mainEvaluate,
          //初始化时评价分数ID为空,但评价至少为一星,故取其为一星时的评价分数ID
          //CurrentEvaluate0: res.data.data.mainEvaluate.fValue,
          CurrentEvaluate0: res.data.data.evaluateDatas[4].fID,
          OtherList: res.data.data.otherEvaluate
        })
        for (let i = 0; i < res.data.data.otherEvaluate.length; i++) {
          var itemValue = 'CurrentValue[' + i + ']'
          var itemEvaluate = 'CurrentEvaluate[' + i + ']'
          //同理这里也去默认一星,s数组下标取常数0
          that.setData({
            [itemValue]: 0,
            [itemEvaluate]: res.data.data.evaluateDatas[4].fID
          })
        }
      },
      method: 'GET'
    });
  },
  /**
   * 页面相关事件处理函数----切换星标2(其他评价)
   */
  changeStar2: function (e) {
    var that = this
    if (e.target.dataset.index === that.data.CurrentValue[e.target.dataset.idx]) {
    } else {
      var itemValue = 'CurrentValue[' + e.target.dataset.idx+']'
      var itemEvaluate = 'CurrentEvaluate[' + e.target.dataset.idx + ']'
      that.setData({
        [itemValue]: e.target.dataset.index,
        [itemEvaluate]: e.target.dataset.value
      })
    }
  },

  /**
   * 页面相关事件处理函数----表单提交
   */
  evaluateSubmit: function(e){
    var that = this
    var postdata={}
    postdata.rateList = new Array()
    postdata.fUserID = app.globalData.userInfo.fUserID
    postdata.fSaleOrderID = that.data.fSaleOrderID
    postdata.fRateContent = e.detail.value.fRateContent
    postdata.fIsAnonymus = that.data.isnormal
   // postdata.picList = that.data.PostPicdata
    for (var i = 0; i < e.detail.value.rateListlength;i++) {
      //拼接key
      var listkey = e.detail.value['rateListkey' + i]
      //拼接value
      var listvalue = e.detail.value['rateListvalue' + i]
      //利用中间变量组成键值对
      let listdata = {}
      listdata['fEvaluateRateItemID'] = listkey
      listdata['fEvaluateRateScoreID'] = listvalue
      //将键值对拼接到数组中
      postdata.rateList[i] = listdata
    }
    wx.request({
      url: app.globalData.posturl + 'wx/shopCity/addEvaluate.do', //url 不能出现端口号
      data: postdata,
      header: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      complete: function (res){
        wx.showToast({
          'title':'评价成功'
        })
        wx.navigateBack()
      },
      method:'POST'
    });
  },

  ChooseImage: function(){
    var that=this
    wx.chooseImage({
      success: function (res) {

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.globalData.posturl + 'app/upload.do', //仅为示例，非真实的接口地址
            filePath: res.tempFilePaths[i],
            name: 'file_data',
            success: function (res2) {
              var n = that.data.listpic.length
              var json = JSON.parse(res2.data)
              if (json.data) {
                  var itemimg = 'listpic[' + n + '].img'
                  var itemfurl = 'listpic[' + n + '].path'
                  var itempost = 'PostPicdata[' + n +'].path'
                  that.setData({
                    [itemimg]: json.data.img,
                    [itemfurl]: json.data.path,
                    [itempost]: json.data.path
                  })
                  n++
              }
            }
          })
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
