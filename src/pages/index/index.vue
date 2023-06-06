<template>
  <view>
    home
    userInfo:{{loginToken.accessToken}}
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
