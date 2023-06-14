<script>
import {getCurrentPageUrl} from '@/utils/utils'
import {configLoginToken} from '@/config/index'
import useLoginTokenStore from '@/store/modules/loginToken'

export default {
  globalData: {
    loginToken:{
      accessToken:'',
      expireTime:0,
    }
  },
  onLaunch: function () {
    let ggx_login_token_text = uni.getStorageSync(configLoginToken)
    if (ggx_login_token_text) {
      let loginToken = JSON.parse(ggx_login_token_text) || {}
      //this.globalData.loginToken = loginToken
      const loginTokenStore = useLoginTokenStore()
      loginTokenStore.set(loginToken)
    }
    console.log('loginToken',this.globalData)
  },
  onShow: function () {
    console.log('App Show')
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
