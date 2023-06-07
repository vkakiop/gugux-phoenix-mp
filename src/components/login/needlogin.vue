<template>
</template>

<script setup>
import {onMounted} from 'vue'
import {getCurrentPageUrl} from '@/utils/utils'
onMounted(()=>{
  const app = getApp()
  if (!app.globalData.loginToken.accessToken) {
    uni.redirectTo({url:'/pages/login/phone?url='+encodeURIComponent(getCurrentPageUrl())})
  }
})
</script>

<style scoped>

</style>
