const api = require('../../utils/api.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    displayType:{
      type:String
    },
    filterList:{
      type:Array
    },
    fDefault:{
      type:Object
    },
    fBrandName:{
      type:String,
      observer: function (newVal, oldVal){
        if (newVal){
          let newArr = newVal.split(',')
          this.setData({
            'params.fBrandName': newArr
          })
          this.data.filterList.forEach((item) => {
            if (item.key === 'fBrandName'){
              item.list.forEach((elem, index) => {
                if (newArr.includes(elem.fName)) {
                  elem['checked'] = true
                  item.list[0]['checked'] = false
                } else {
                  elem['checked'] = false
                }
              })
            }
          })
          this.setData({
            filterList: this.data.filterList
          })
        }
      }
    },
    selected:{
      type:Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    downIcon:'./image/down.png',
    isOpen:false,
    currentIndex:null,
    minPrice:'',
    maxPrice:'',
    params:{
      fShopCityID:[],
      fBrandName:[],
      fNorms:[],
      fQuality:[],
      fMatColor:[],
      fPrice:[],
      flag:''
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 取得当前属性值
    getCurrentSpec:function(e){
      let arr = this.data.params[`${e.currentTarget.dataset.key}`]
      if (!e.currentTarget.dataset.value){
        arr.splice(0,arr.length)
        this.data.filterList[e.currentTarget.dataset.index].list.forEach((item,index)=>{
            item.checked = index > 0?false:true
        })
      }else{
        this.data.filterList[e.currentTarget.dataset.index].list[e.currentTarget.dataset.dindex].checked = !e.currentTarget.dataset.checked
        if (!e.currentTarget.dataset.checked) {
          arr.push(e.currentTarget.dataset.value)
        }else{
          arr.splice(arr.findIndex(item => item === e.currentTarget.dataset.value), 1)
        }
        this.data.filterList[e.currentTarget.dataset.index].list[0].checked = arr.length ? false:true
      }
      this.setData({
        filterList: this.data.filterList,
        params: this.data.params
      })
    },

    // 取得最小价格
    getMinPrice:function(e){
      this.setData({
        minPrice: e.detail.value
      })
    },
    // 取得最大价格
    getMaxPrice: function (e) {
      this.setData({
        maxPrice: e.detail.value
      })
    },
    // 切换展示更多字段
    togglePanel:function(e){
      if (this.data.currentIndex == e.currentTarget.dataset.index){
        this.setData({
          isOpen:!this.data.isOpen
        })
      }else{
        this.setData({
          currentIndex: e.currentTarget.dataset.index,
          isOpen:true
        })
      }
    },
    // 提交筛选参数
    submitFilter:function(){
      if (this.data.minPrice && !this.data.maxPrice){
        wx.showToast({
          title: '高位价格不能为空',
          icon:'none',
          duration:1500
        })
        return false;
      }
      if (!this.data.minPrice && this.data.maxPrice) {
        wx.showToast({
          title: '低位价格不能为空',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      if (this.data.minPrice && this.data.maxPrice){
        if (parseFloat(this.data.minPrice) > parseFloat(this.data.maxPrice)) {
          wx.showToast({
            title: '价格区间填写有误',
            icon: 'none',
            duration: 1500
          })
          return false;
        }
        let price = Array.of(this.data.minPrice, this.data.maxPrice)
        this.data.params.fPrice = price
      }
      this.data.params.flag = this.data.selected ? 1 : 0
      this.setData({
        params: this.data.params
      })
      this.triggerEvent('filtersearch', this.data.params)
    },

    // 切换默认筛选
    selectDefault:function(e){
      this.data.selected = !this.data.selected
      this.data.params.flag = this.data.selected?1:0
      this.setData({
        selected: this.data.selected,
        params: this.data.params
      })
    },

    resetFilter:function(){
      this.data.filterList.forEach((item) => {
        item.list.forEach((elem, index) => {
          elem['checked'] = index > 0 ? false : true
        })
      })
      let params = {
        fShopCityID: [],
        fBrandName: [],
        fNorms: [],
        fQuality: [],
        fMatColor: [],
        fPrice: [],
        flag: this.data.fDefault.fValue?1:0
      }
      this.setData({
        minPrice:'',
        maxPrice:'',
        filterList:this.data.filterList,
        selected: this.data.fDefault.fValue ? true : false,
        params: params
      })
      this.triggerEvent('resetsearch', this.data.params)
    }
  }
})
