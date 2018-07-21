const api = require('../../utils/api.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    copyList:{
      type:Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    checkedAll:false,
    selectArr:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 单个选择元素
    selectItem: function (e) {
      let value = e.currentTarget.dataset.checked
      let index = e.currentTarget.dataset.index
      let arr = this.data.selectArr
      let copyList = this.data.copyList
      let checked = copyList[index].checked
      copyList[index].checked = !checked
      if (checked) {
        arr.splice(arr.findIndex(item => item === value), 1)
      } else {
        arr.push(value)
      }
      this.setData({
        copyList: copyList,
        checkedAll: arr.length === copyList.length ? true : false,
        selectArr: arr
      })
    },
    // 全部选择元素
    selectAllItem: function () {
      let arr = this.data.copyList.map(item => {
        return item.fSelectMatDetailID
      })
      let checkedAll = !this.data.checkedAll
      if (checkedAll) {
        this.data.copyList.forEach(item => {
          item.checked = true
        })
      } else {
        this.data.copyList.forEach(item => {
          item.checked = false
        })
      }
      this.setData({
        copyList: this.data.copyList,
        checkedAll: checkedAll,
        selectArr: checkedAll ? arr : []
      })
    },

    // 清空全部选择
    clearAllChecked: function () {
      this.data.copyList.forEach(item => {
        item.checked = false
      })
      this.setData({
        copyList: this.data.copyList,
        checkedAll: false,
        selectArr: []
      })
    },

    colseModal:function(){
      this.clearAllChecked()
      this.triggerEvent('customevent',true)
    },
    openModal:function(){
      this.triggerEvent('customevent', false)
    },
    submitForm:function(){
      this.triggerEvent('customevent', true)
      this.triggerEvent('comfirmcopy', this.data.selectArr)
    }
  }
})
