Component({
  /**
   * 组件的属性列表
   */
  properties: {
    brandList:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    loadImg:'./image/loadimg.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoBrandGoodsList:function(e){
      let name = e.currentTarget.dataset.name
      this.triggerEvent('customevent', name)
    }
  }
})
