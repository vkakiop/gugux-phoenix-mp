<template>
</template>

<script setup>
import {configLoginToken} from '@/config/index'
import {onLoad} from "@dcloudio/uni-app"
import useLoginTokenStore from '@/store/modules/loginToken'
const loginTokenStore = useLoginTokenStore()

onLoad((option)=>{
  //const app = getApp()
  //app.globalData.loginToken = {accessToken:'',expireTime:0,}
  loginTokenStore.set({accessToken:'',expireTime:0})
  uni.clearStorageSync(configLoginToken)

  let returnUrl = decodeURIComponent(option.url || '')
  let url = returnUrl || '/pages/index/index'
  uni.reLaunch({url:url})
})
</script>

<style lang="scss" scoped>
</style>
