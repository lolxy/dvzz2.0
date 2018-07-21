const api = require('../../utils/api.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:{
      type:String
    },
    code:{
      type:Object,
      value:{
        currentCode1: "", 
        currentCode2: "",
        currentCode3: ''
      },
      observer: function (newVal, oldVal) { 
        if (newVal.currentCode1 != oldVal.currentCode1){
          this.getCurrentCategoryList()
        }
        if (newVal.currentCode2 != oldVal.currentCode2){
          this.getCurrentSubCategoryList()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: true,
    currentCategory:{},
    currentSubCategory:[],
    filterIcon: "./image/filter.png",
    moreIcon: "./image/down.png",
    moreList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取当前分类列表
    getCurrentCategoryList: function () {
      const self = this
      api.getCategoryList({
        data: {
          fTypeCode: self.data.code.currentCode1
        },
        success: (res) => {
          let currentCate = res.data.data
          if (currentCate && currentCate.length){
            self.setData({
              currentCategory: currentCate[0],
              moreList: currentCate[0].data2.slice(5)
            })
            self.getCurrentSubCategoryList()
          }
        }
      });
    },
    // 获取当前子分类列表
    getCurrentSubCategoryList(){
      const self = this
      if (self.data.currentCategory && self.data.currentCategory.fType1){
        let currentCate = self.data.currentCategory
        if (self.data.code.currentCode2){
          let currentSubCategoryJson = currentCate.data2.find(item => item.fTypeCode2 == self.data.code.currentCode2)
          let currentSubCategory = (currentSubCategoryJson && currentSubCategoryJson.fTypeCode2) ? currentSubCategoryJson.data3 : []
          self.setData({
            currentSubCategory: currentSubCategory,
          })
        }else{
          self.setData({
            currentSubCategory: []
          })
        }
      } 
    },
    // 切换选择当前二级分类
    getCurrentCate:function(e){
      let code = {
        currentCode1: this.data.code.currentCode1,
        currentCode2: e.currentTarget.dataset.code,
        currentCode3: ''
        // currentCode3: e.currentTarget.dataset.subcode
      }
      this.triggerEvent('changecurrentcate',code)
    },

    // 切换选择当前三级分类
    getCurrentSubCat:function(e){
      let code = {
        currentCode1: this.data.code.currentCode1,
        currentCode2: this.data.code.currentCode2,
        currentCode3: e.currentTarget.dataset.code
      }
      this.triggerEvent('changecurrentcate', code)
    },

    toggleMoreMenu: function () {
      this.setData({
        isShow: !this.data.isShow
      })
      this.triggerEvent('customevent')
    },
    closeActionSheet: function () {
      this.setData({
        isShow: true
      })
      this.triggerEvent('customevent')
    },
    actionSheetTap:function(){
      this.triggerEvent('customevent')
    }
  }
})
