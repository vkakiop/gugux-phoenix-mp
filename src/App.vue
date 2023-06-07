<script>
export default {
  globalData: {
    loginToken:{
      accessToken:'',
      expireTime:0,
    }
  },
  onLaunch: function () {
    let ggx_login_token_text = uni.getStorageSync('ggx_login_token')
    if (ggx_login_token_text) {
      this.globalData.loginToken = JSON.parse(ggx_login_token_text) || {}
    }
    console.log('loginToken',this.globalData)
  },
  onShow: function () {
  },
  onHide: function () {
  },
}
</script>

<style lang="scss">
@import './tailwind.scss';
//@import './windi.scss';
// @import "vk-uview-ui/index.scss";
@import "uview-plus/index.scss";

</style>
