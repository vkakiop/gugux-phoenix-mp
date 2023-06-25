<template>
  <view>
    <view class="fixed z-[999999] w-screen bg-white top-0 left-0">
      <view class="bg-white w-screen" :style="{height:pageData.statusBarHeight+'px'}"></view>
      <view class="flex items-center bg-white w-screen " :style="{height:pageData.titleBarHeight+'px',paddingRight:pageData.titleBarRight+'px'}">
        <slot></slot>
      </view>
    </view>
    <view :style="{height:(pageData.statusBarHeight + pageData.titleBarHeight )+'px'}"></view>
  </view>
</template>

<script setup>
import {onMounted, reactive} from "vue";

const pageData = reactive({
  statusBarHeight: 0,
  titleBarHeight: 0,
  titleBarRight: 0,
})

onMounted(()=> {
  let systemInfo = uni.getSystemInfoSync()
  pageData.statusBarHeight = systemInfo.statusBarHeight
  let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
  pageData.titleBarHeight = (menuButtonInfo.top - pageData.statusBarHeight) * 2 + menuButtonInfo.height
  pageData.titleBarRight = menuButtonInfo.width + (systemInfo.windowWidth - menuButtonInfo.right)
})
</script>

<style lang="scss" scoped>

</style>
