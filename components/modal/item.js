// components/common/modal/item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    colseModal: function () {
      this.triggerEvent('close', true)
    },
    openModal: function () {
      this.triggerEvent('close', false)
    },
    confirm: function (e) {
      this.triggerEvent('comfirm', true)
    }
  }
})
