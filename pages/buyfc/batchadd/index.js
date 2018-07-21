Page({

  // 页面的初始数据
  data: {
    mainMenuList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    subMenuList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    goodsList:[
      {
        id: '1',
        title:'桔红色20*3米中型线管20',
        price:'25',
        unit:'个',
        checked:false
      },
      {
        id: '1',
        title: '桔红色20*3米中型线管20',
        price: '25',
        unit: '个',
        checked: false
      },
      {
        id: '1',
        title: '桔红色20*3米中型线管20',
        price: '25',
        unit: '个',
        checked: false
      },
      {
        id: '1',
        title: '桔红色20*3米中型线管20',
        price: '25',
        unit: '个',
        checked: false
      },
      {
        id: '1',
        title: '桔红色20*3米中型线管20',
        price: '25',
        unit: '个',
        checked: true
      },
      {
        id: '1',
        title: '桔红色20*3米中型线管20',
        price: '25',
        unit: '个',
        checked: false
      }
    ],
    keyword:''
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "中骏四季花城15#2802"
    })
  },

  onShow: function () {
  
  },

  onHide: function () {
  
  },

  onPullDownRefresh:function(){

  },

  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /*******************
   **** 自定义方法 *****
   *******************/
  
  // 选项选择触发的方法
  checkboxChange: function (e) {
    console.log(e)
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  }
})