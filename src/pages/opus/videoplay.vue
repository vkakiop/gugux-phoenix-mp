<template>
  <view class="h-screen overflow-hidden">
    <customNav :screen="2">
      <view @click="gotoBack" class="ml-3 mt-5"><uni-icons type="back" size="24"></uni-icons></view>
      <view class="name mx-6 text-14 line-clamp-1">视频播放</view>
    </customNav>
    <view class="bg-black">
      <swiper class="swiper w-screen h-full" :style="`height:calc(100vh - ${pageData.statusHeight/2}px)`" vertical :current="pageData.current" :interval="2000" :duration="600" @animationfinish="animationfinish" @change="handleChange" :circular="false">
        <swiper-item v-for="(item,index) in pageData.urls" :key="index">
          <view v-if="index == pageData.current" @click="handleVideo(index)" class="w-screen h-full">
            <video autoplay class="w-screen h-screen fixed" :id="'video'+index" :src="item"  loop  :controls="false" :show-center-play-btn="true" :show-play-btn="false" :show-fullscreen-btn="false" @error="videoErrorCallback">
            </video>
            <view v-if="pageData.status == 1" class="icon_play top-[calc(50% - 64rpx)] left-[calc(50% - 64rpx)] absolute w-64 h-64"><image class="w-64 h-64" src="@/static/opus/icon_play.png"/></view>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script setup>
import {getCurrentInstance, reactive} from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const pageData = reactive({
  url:'',
  urls:[],
  current:0,
  status:0,//0播放 1暂停
})

const { ctx } = getCurrentInstance()

onLoad((option)=>{
  pageData.url = decodeURIComponent(option.url || '')
  pageData.urls = JSON.parse(decodeURIComponent(option.urls || '')) || []
  pageData.urls.forEach((item,index)=>{
    if (item == pageData.url) {
      pageData.current = index
    }
  })
  console.log('pageData:',pageData)
})

const playVideo = ()=> {
  let currentId = 'video' + pageData.current; // 获取当前视频id
  pageData.videoContent = uni.createVideoContext(currentId, ctx).play();
  pageData.status = 0;
}

//点击视频播放或者暂停
const handleVideo = (index)=> {
  let currentId = 'video' + index
  if (pageData.status == 1) {
    uni.createVideoContext(currentId, ctx).play()
    pageData.status = 0
  } else {
    uni.createVideoContext(currentId, ctx).pause()
    pageData.status = 1
  }
}

const animationfinish = (e)=>{
  pageData.current = e.detail.current;
  playVideo()
}

const handleChange = ()=>{
  let currentId = 'video' + pageData.current
  uni.createVideoContext(currentId, ctx).pause()
  pageData.status = 1
}

const videoErrorCallback = ()=>{
  uni.showToast({
    title: '视频播放错误',
    icon:'none',
    duration: 2000
  });
}

const gotoBack = ()=>{
  uni.navigateBack({delta: 1})
}
</script>

<style lang="scss" scoped>
.icon_play {
  top:calc(50% - 64rpx);
  left:calc(50% - 64rpx);
}
</style>
<style>
::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}
</style>
