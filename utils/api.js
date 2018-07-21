// API
const apiURL = 'https://api.dovzs.com/APPDWERP';

const wxRequest = (params, url) => {
  wx.request({
    url,
    method: params.method || 'GET',
    data: params.data || {},
    header: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    success(res) {
      if (params.success) {
        params.success(res);
      }
    },
    fail(res) {
      if (params.fail) {
        params.fail(res);
      }
    },
    complete(res) {
      if (params.complete) {
        params.complete(res);
      }
    },
  });
};

// 获取当前登录微信的openID
const getOpenID = (params) => {
  wxRequest(params, `${apiURL}/zzsc/jscode.do`);
};

// 获取扫码数据
const getScanCode = (params) => {
  wxRequest(params, `${apiURL}/app/selectmat/scanCode.do`);
};

// 获取城市列表
const getCityList = (params) => {
  wxRequest(params, `${apiURL}/wx/personalcenter/queryCityList.do`);
};

// 获取主材商城首页banner图片
const getMallBanner = (params) => {
  wxRequest(params, `${apiURL}/app/picture/loadBanner.do`);
};

// 获取主材商城首页菜单
const getMallMenu = (params) => {
  wxRequest(params, `${apiURL}/wx/shop/indexMenu.do`);
};

// 获取主材商城首页推荐商品列表
const getHomeRecommonList = (params) => {
  wxRequest(params, `${apiURL}/wx/shop/recommendMatList.do`);
};

// 获取一二级分类列表
const getCategoryList = (params) => {
  wxRequest(params, `${apiURL}/app/mat/queryMatType.do`);
};

// 获取商品详情信息
const getDetail = (params) => {
  wxRequest(params, `${apiURL}/wx/shopmat/queryMatByID.do`);
};

// 获取当前商品的评论列表
const getCurrentGoodsEvaluate = (params) => {
  wxRequest(params, `${apiURL}/wx/shopCity/queryMatEvaluete.do`);
};

// 获取商品详情信息的商城列表
const getDetailMallList = (params) => {
  wxRequest(params, `${apiURL}/wx/shopmat/queryMatByShopcity.do`);
};

// 根据分类获取主材商城商品品牌列表
const getBrandList = (params) => {
  wxRequest(params, `${apiURL}/wx/shopmat/queryBrandList.do`);
};

// 根据分类获取主材商城商品列表
const getGoodsList = (params) => {
  wxRequest(params, `${apiURL}/wx/shopmat/queryMatList.do`);
};

// 获取商品列表可供筛选的数据
const getFilterField = (params) => {
  wxRequest(params, `${apiURL}/wx/shopmat/morefilterinit.do`);
};

/**************
 *  预算接口 **
 * ************/
// 获取游客信息
const getTouristExpInfo = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/addTouristExp.do`);
};

//  获取预算首页分类
const getBudgetCate = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/queryType.do`);
};

// 获取预算首页分类列表
const getBudgetCatList = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/queryTypeList.do`);
}; 

// 获取预算分类
const getBudgetByIdCatList = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/queryfSeriesList.do`);
}; 

// 获取主材预算列表
const getBudgetGoodsList = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/querySelectMatList.do`);
}; 

// 获取新增选材参数列表
const getParamList = (params) => {
  wxRequest(params, `${apiURL}/app/data/query.do`);
}; 

// 新增选材项
const addSelectMat = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/addSelectMatDetail.do`);
}; 

// 删除选材项
const dellSelectMat = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/deleteSelectMatDetail.do`);
}; 

// 获取选材明细
const getSelectMatDetail = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/querySelectMatDetail.do`);
}; 

// 获取选项明细页的收藏列表
const getCollectList = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/querySelectMatColl.do`);
}; 

// 添加收藏
const addCollect = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/addCollect.do`);
}; 

// 删除收藏
const dellCollect = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/deleteCollect.do`);
}; 

// 将商品加入选材项
const addMatToSelectDetail = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/updateSMSelectMat.do`);
}; 

// 业主选择自购操作
const selfBuy = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/selfBuy.do`);
}; 

// 业主选择取消自购
const cancelSelfBuy = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/cancelSelfBuy.do`);
}; 

// 选材明细选择复制列表
const getCopyList = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/copyList.do`);
}; 

// 选材明细选择复制操作
const getCopy = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/copy.do`);
}; 

// 生成销售订单
const addSaleorder = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/addSaleorder.do`);
}; 

// 获取我的消费类型
const getConsumeType = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/budgetType.do`);
}; 

// 获取我的消费明细
const getConsumeDetail = (params) => {
  wxRequest(params, `${apiURL}/wx/mainBudget/budgetDetail.do`);
}; 

/**************
 *  2.0新版接口 **
 * ************/

module.exports = {
  getOpenID,
  getScanCode,
  getCityList,
  getMallBanner,
  getMallMenu,
  getHomeRecommonList,
  getCategoryList,
  getDetail,
  getDetailMallList,
  getBrandList,
  getGoodsList,
  getFilterField,
  getCurrentGoodsEvaluate,
  getBudgetCate,
  getBudgetCatList,
  getTouristExpInfo,
  getBudgetByIdCatList,
  getBudgetGoodsList,
  getParamList,
  addSelectMat,
  dellSelectMat,
  getSelectMatDetail,
  getCollectList,
  addCollect,
  dellCollect,
  addMatToSelectDetail,
  selfBuy,
  cancelSelfBuy,
  getCopyList,
  getCopy,
  addSaleorder,
  getConsumeType,
  getConsumeDetail,
  /**************
 *  2.0新版接口 **
 * ************/
 
};