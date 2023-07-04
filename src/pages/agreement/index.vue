<template>
  <customNav>
    <view @click="gotoBack" class="pl-10 mt-[3rpx]"><uni-icons type="back" size="24"></uni-icons></view>
    <view class="name mx-6 text-18 line-clamp-1">{{pageData.title}}</view>
  </customNav>
  <view class="mx-20 text-15 text-[#272a29]">
    <rich-text :nodes="pageData.html" class="protocolDetail"></rich-text>
  </view>
  <view class="h-30"></view>
</template>

<script setup>
import {reactive} from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import {userProtocol} from '@/api/agreement/index'
const pageData = reactive({
  title:'',
  html:'',
})
onLoad((option)=>{
  if (option.code) {
    pageData.title = option.title
    userProtocol({code:option.code}).then(res=>{
      pageData.html = res
    })
  }
  else {
    uni.showToast({
      title: '协议code参数有误！',
      icon:'none',
      duration: 2000
    });
  }
})

const gotoBack = ()=>{
  uni.navigateBack({delta: 1})
}
</script>

<style lang="scss" scoped>
.protocolDetail {word-break: break-all;word-wrap: break-word;white-space: pre-wrap;line-height: 180%;}
.protocolDetail img {width:100%;}
.protocolDetail p {margin-top:10rpx;}
</style>
