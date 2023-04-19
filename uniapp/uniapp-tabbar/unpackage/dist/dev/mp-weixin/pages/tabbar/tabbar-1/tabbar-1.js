"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "tabbar-1",
  setup(__props) {
    var h = common_vendor.index.getSystemInfoSync().statusBarHeight;
    console.log("Statusbar Height: " + h);
    return (_ctx, _cache) => {
      return {};
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/public/uniapp/uniapp-tabbar/pages/tabbar/tabbar-1/tabbar-1.vue"]]);
wx.createPage(MiniProgramPage);
