<template>
  <view>
    <image :animation="pageData.animationData" class="w-20 h-20 ml-6" :src="configStaticPath('/static/blekey/connect.png')"></image>
  </view>
</template>

<script setup>
import {configStaticPath} from '@/config/index'
import {onMounted, reactive} from 'vue'
const pageData = reactive({
  animationData:{}
})

onMounted(()=>{
  let animation = uni.createAnimation({
    duration: 1000*60000,
    timingFunction: "linear",
    transformOrigin: '50% 50% 0',
    // delay: 0
  })
  pageData.animationData = animation
  pageData.animationData.rotate(360*60000).step()
  pageData.animationData = pageData.animationData.export()
})
</script>

<style lang="scss" scoped>

</style>