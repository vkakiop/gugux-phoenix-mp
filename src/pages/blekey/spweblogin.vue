<template>
  <div>
    <web-view v-if="pageData.spTokenUrl" :src="pageData.spTokenUrl" @error="webviewError"></web-view>
  </div>
</template>

<script setup>
import {onMounted,reactive} from 'vue'
import {getTokenValue} from '@/utils/utils'
import {encodeBlekey} from '@/utils/crypto'

const pageData = reactive({
  isWebView:true,
  token:'',
  spTokenUrl:'',
})

onMounted(()=>{
  pageData.token = getTokenValue()
  if (pageData.token) {
    pageData.spTokenUrl = import.meta.env.VITE_APP_SHAREPAGE_H5_URL + '/#/blekey/mpindex?tokenEncode='+encodeURIComponent(encodeBlekey(pageData.token,''))
  }
  else {
    uni.navigateTo({url:'/pages/login/index'})
  }
})

const webviewError = ()=>{
  uni.showToast({title: '一键登录页面加载失败,请重试！',icon:'none',duration: 2000})
}
</script>

<style lang="scss" scoped>

</style>