// components/order/selectAddress/item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    goodsList: [
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
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 选项选择触发的方法
    checkboxChange: function (e) {
      console.log(e)
      console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    }
  }
})