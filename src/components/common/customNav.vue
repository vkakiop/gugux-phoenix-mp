<template>
  <view v-show="pageData.isShow">
    <view class="fixed z-[999999] w-screen bg-white top-0 left-0">
      <view class="bg-white w-screen" :style="{height:pageData.statusBarHeight+'px'}"></view>
      <view class="flex items-center bg-white w-screen " :style="{height:pageData.titleBarHeight+'px',paddingRight:pageData.titleBarRight+'px'}">
        <slot></slot>
      </view>
    </view>
    <view :style="{height:(pageData.height/screen )+'px'}"></view>
  </view>
</template>

<script setup>
import {onMounted, reactive} from "vue"

const props = defineProps({
  screen: {
    type:Number,
    default:1
  }
})

const emit = defineEmits(['changeHeightInfo'])

const pageData = reactive({
  statusBarHeight: 0,//状态栏高度
  titleBarHeight: 0,//导航栏高度
  titleBarRight: 0,
  height:0, //状态栏+导航栏 总高度
  isShow: false,
})

onMounted(()=> {
  let systemInfo = uni.getSystemInfoSync()
  pageData.statusBarHeight = systemInfo.statusBarHeight
  let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
  pageData.titleBarHeight = (menuButtonInfo.top - pageData.statusBarHeight) * 2 + menuButtonInfo.height
  pageData.titleBarRight = menuButtonInfo.width + (systemInfo.windowWidth - menuButtonInfo.right)
  pageData.height = pageData.statusBarHeight + pageData.titleBarHeight
  pageData.isShow = true

  emit('changeHeightInfo',pageData)
})
</script>

<style lang="scss" scoped>

</style>
