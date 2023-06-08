<template>
  <view class="bg-black">
    <swiper class="swiper w-screen h-screen" vertical :interval="2000" :duration="600" @animationfinish="animationfinish" @change="handleChange" circular>
      <swiper-item v-for="(item,index) in pageData.urls" :key="index">
        <view v-if="index == pageData.current" @click="handleVideo(index)" class="w-screen h-screen">
          <video autoplay class="w-screen h-screen fixed" :id="'video'+index" title="产品介绍" :src="item"  loop  :controls="false" :show-center-play-btn="true" :show-play-btn="false" :show-fullscreen-btn="false" @error="videoErrorCallback">
          </video>
          <view v-if="pageData.status == 1" class="icon_play w-full h-full absolute w-50 h-50"><image class="w-50 h-50" src="@/static/opus/icon_play.png"/></view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup>
import { reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const pageData = reactive({
  url:'',
  urls:[],
  current:0,
  status:0,
})
onLoad((option)=>{
  pageData.url = decodeURIComponent(option.url || '')
  pageData.urls = JSON.parse(decodeURIComponent(option.urls || '')) || []
  pageData.urls.forEach((item,index)=>{
    if (item == pageData.url) {
      pageData.current == index
    }
  })
  console.log('pageData:',pageData)
})

const playVideo = ()=> {
  let currentId = 'video' + pageData.current; // 获取当前视频id
  pageData.videoContent = uni.createVideoContext(currentId, this).play();
  pageData.status = 0;
}

//点击视频播放或者暂停
const handleVideo = (index)=> {
  let currentId = 'video' + index
  if (pageData.status == 1) {
    uni.createVideoContext(currentId, this).play()
    pageData.status = 0
    console.log('执行了播放', pageData.status);
  } else {
    uni.createVideoContext(currentId, this).pause()
    pageData.status = 1
    console.log('执行了暂停', pageData.status);
  }
}

const animationfinish = (e)=>{
  pageData.current = e.detail.current;
  playVideo()
}

const handleChange = ()=>{
  console.log('视频切换了', pageData.current);
  let currentId = 'video' + pageData.current
  let currentId2 = 'video' + (pageData.current + 1)
  uni.createVideoContext(currentId, this).pause()
  pageData.status = 1
}

const videoErrorCallback = ()=>{
  uni.showToast({
    title: '视频播放错误',
    icon:'none',
    duration: 2000
  });
}
</script>

<style lang="scss" scoped>
.icon_play {
  top:calc(50% - 50rpx);
  left:calc(50% - 50rpx);
}
</style>
