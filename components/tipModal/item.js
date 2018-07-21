// components/tipModal/item.js
Component({
  methods: {
    // 关闭提示弹窗
    closeModal: function () {
      this.triggerEvent('closemodal')
    }
  }
})
