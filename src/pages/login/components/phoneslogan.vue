<template>
  <view class="text-[#272a29]">
    <view>
      <image :src="configStaticPath('/static/login/slogan.png')" class="w-54 h-39"></image>
    </view>
    <view class="font-bold text-22 text-[#333333] mt-14">欢迎加入咕咕行</view>
    <view class="mt-16 text-16">同行，一路有我</view>
  </view>
</template>

<script setup>
import {configStaticPath} from '@/config/index'
</script>

<style lang="scss" scoped>
</style>
