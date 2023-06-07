<script>
import {getCurrentPageUrl} from '@/utils/utils'
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
    uni.showToast({title:'test',icon:'none'})
    // let url = getCurrentPageUrl()
    // uni.showToast({title:url,icon:'none'})
    // return false
    // const app = getApp()
    // if (!app.globalData.loginToken.accessToken) {
    //   uni.redirectTo({url:'/pages/login/phone?url='+encodeURIComponent(url)})
    // }
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
