<template>
  <view>testinfo</view>
</template>

<script setup>
import {onMounted} from 'vue'
onMounted(()=>{
  uni.showToast({
    title: 'mount2',
    icon:'none',
    duration: 4000
  });
})
</script>

<style scoped>
</style>
