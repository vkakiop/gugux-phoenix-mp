<template>
</template>

<script setup>
import {onLoad} from "@dcloudio/uni-app"
onLoad((option)=>{
  const app = getApp()
  app.globalData.loginToken = {
    accessToken:'',
    expireTime:0,
  }
  uni.clearStorageSync('ggx_login_token')

  let returnUrl = decodeURIComponent(option.url || '')
  let url = returnUrl || '/pages/index/index'
  uni.reLaunch({url:url})
})
</script>

<style lang="scss" scoped>
</style>
