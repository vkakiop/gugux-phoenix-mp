<template>
  <view>
    <view>
    token:{{loginToken.accessToken}}
    </view>
    <view>
      <navigator url="/pages/login/phone" open-type="redirect">去登录</navigator>
      <navigator url="/pages/login/logout" open-type="redirect">退出登录</navigator>
    </view>
  </view>
</template>

<script setup>
import {ref,onMounted} from 'vue'
const loginToken = ref({})
onMounted(()=>{
  loginToken.value = getApp().globalData.loginToken
})
</script>

<style lang="scss" scoped>
</style>
