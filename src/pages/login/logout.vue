<template>
</template>

<script setup>
import {onLoad} from "@dcloudio/uni-app"
import {loginout} from '@/utils/login'

onLoad((option)=>{
  //const app = getApp()
  //app.globalData.loginToken = {accessToken:'',expireTime:0,}
  // loginTokenStore.set({accessToken:'',expireTime:0,user:{id:''}})
  // uni.clearStorageSync(configLoginToken)
  loginout()
  let returnUrl = decodeURIComponent(option.url || '')
  let url = returnUrl || '/pages/index/index'
  uni.reLaunch({url:url})
})
</script>

<style lang="scss" scoped>
</style>
