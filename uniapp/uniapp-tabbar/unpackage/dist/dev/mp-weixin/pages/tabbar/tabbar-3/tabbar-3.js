"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      active: false
    };
  },
  onLoad() {
  },
  onShow() {
    this.active = true;
  },
  onHide() {
    this.active = false;
  },
  methods: {
    goToPage(url) {
      if (!url)
        return;
      common_vendor.index.navigateTo({
        url
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.goToPage("/pages/tabbar-3-detial/tabbar-3-video/tabbar-3-video")),
    b: $data.active ? 1 : ""
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-afdd7fb7"], ["__file", "D:/public/uniapp/uniapp-tabbar/pages/tabbar/tabbar-3/tabbar-3.vue"]]);
wx.createPage(MiniProgramPage);
