const api = require('../../utils/api.js')
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentCatId:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    downIcon: "/image/downicon.png",
    spaceList:[],
    positionList:[],
    unitList:[],
    num:'',
    fUnitID:'',
    fSpace: '',
    fPosition:'',
    spaceIndex:0,
    positionIndex:0,
    unitIndex:0
  },

  attached: function () { 
    this.getSpaceList()
    this.getPositionList()
    this.getUnitList()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取空间列表
    getSpaceList:function(){
      api.getParamList({
        data:{
          fPCode: 'SM01'
        },
        success:(res)=>{
          this.setData({
            spaceList:res.data.data
          })
        }
      })
    },

    // 获取位置列表
    getPositionList:function(){
      api.getParamList({
        data: {
          fPCode: 'SM03'
        },
        success: (res) => {
          this.setData({
            positionList: res.data.data
          })
        }
      })
    },
    // 获取位置列表
    getUnitList: function () {
      api.getParamList({
        data: {
          fPCode: 'MD06'
        },
        success: (res) => {
          this.setData({
            unitList: res.data.data
          })
        }
      })
    },
    // 获取空间值
    bindPickerSpaceChange: function (e) {
      let currentIndex = e.detail.value
      this.setData({
        spaceIndex: currentIndex
      })
    },
    // 获取位置值
    bindPickerPositionChange: function (e) {
      let currentIndex = e.detail.value
      this.setData({
        positionIndex: currentIndex
      })
    },
    // 获取位置值
    bindPickerUnitChange: function (e) {
      let currentIndex = e.detail.value
      this.setData({
        unitIndex: currentIndex
      })
    },
    // 获取数量值
    getNumber:function(e){
      this.setData({
        num: e.detail.value
      })
    },
    // 重置表单
    resetForm:function(){
      this.setData({
        num:'',
        spaceIndex: 0,
        positionIndex: 0,
        unitIndex: 0
      })
    },
    colseModal:function(){
      this.resetForm()
      this.triggerEvent('customevent',true)
    },
    openModal:function(){
      this.triggerEvent('customevent', false)
    },
    submitForm:function(){
      if (!this.data.num) {
        wx.showToast({
          title: '请输入数量',
          icon: 'none'
        })
      } else {
        api.addSelectMat({
          data:{
            fSelectMatID: app.globalData.fSelectMatID,
            fUnitID: this.data.unitList[this.data.unitIndex].fID,
            fPosition: this.data.positionList[this.data.positionIndex].fValue,
            fSpace: this.data.spaceList[this.data.spaceIndex].fValue,
            fQuantity:parseFloat(this.data.num),
            fSeriesID:this.data.currentCatId
          },
          success:(res)=>{
            this.resetForm()
            this.triggerEvent('update')
            wx.showToast({
              title: '新增选材项成功！',
              icon: 'success'
            })
          },
          fail:(res)=>{
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        })
        this.triggerEvent('customevent', true)
      }
    }
  }
})
