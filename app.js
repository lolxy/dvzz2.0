//app.js
App({
  systemInfo: null,
  onLaunch: function () {

    const self = this;
    wx.getSystemInfo({
      success(res) {
        self.systemInfo = res;
      }
    });

    wx.getStorage({
      key: 'fOpenID',
      success: function (res) {
        self.globalData.fOpenID = res.data
        wx.request({
          url: self.globalData.posturl + 'wx/personalcenter/queryUserInfo.do', //url 不能出现端口号
          data: { fOpenID: self.globalData.fOpenID },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            if (res.data.code == 1) {
              wx.getStorage({
                key: 'userInfo',
                success: function (res) {
                  self.globalData.userInfo = res.data
                  self.globalData.fSelectMatID = res.data.fSelectMatID
                  self.globalData.fCustomerID = res.data.fCustomerID
                  self.globalData.fCustomerName = res.data.fCustomerName
                }
              })
            }
          },
          method: 'GET'
        });
      }
    })
  },

  // 获取当前位置信息
  getLocationInfo: function () {
    const self = this;
    return new Promise(function(resolve,reject){
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          self.globalData.area = res
          resolve(res);
        }
      });
    })
  },
  globalData: {
    userInfo: null,
    location: '泉州',
    cityId:'ff8080815c3ad0d7015c3ad8a38d0000',
    area: '',
    fOpenID:'',
    fSelectMatID:'',
    fCustomerID:'',
    fCustomerName:'',
    fBindStatus:false,
    fSelectMatType:'',
    posturl: 'https://api.dovzs.com/APPDWERP/',
    appid: 'wx5d6a6e22ab9f16fe',
    gaodekey: 'f25373107c102c9c02ff92c4596f3b52'
  }
})
