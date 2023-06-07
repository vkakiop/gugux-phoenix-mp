<template>
  <view>index</view>
  <testinfo></testinfo>
</template>

<script setup>
import {onMounted} from 'vue'
import testinfo from './components/testinfo.vue'
onMounted(()=>{
  // uni.showToast({
  //   title: 'mount1',
  //   icon:'none',
  //   duration: 2000
  // });
})
</script>

<style lang="scss" scoped>

</style>
