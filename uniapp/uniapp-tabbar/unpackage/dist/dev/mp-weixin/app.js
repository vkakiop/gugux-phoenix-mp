"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/tabbar/tabbar-1/tabbar-1.js";
  "./pages/tabbar/tabbar-2/tabbar-2.js";
  "./pages/tabbar/tabbar-3/tabbar-3.js";
  "./pages/tabbar/tabbar-4/tabbar-4.js";
  "./pages/tabbar/tabbar-5/tabbar-5.js";
  "./pages/tabbar-3-detial/tabbar-3-release/tabbar-3-release.js";
  "./pages/tabbar-3-detial/tabbar-3-video/tabbar-3-video.js";
  "./pages/tabbar-3-detial/tabbar-3-qa/tabbar-3-qa.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
    setTimeout(() => {
      common_vendor.index.setTabBarBadge({
        index: 1,
        text: "20"
      });
      common_vendor.index.showTabBarRedDot({
        index: 3
      });
    }, 1e3);
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/public/uniapp/uniapp-tabbar/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
