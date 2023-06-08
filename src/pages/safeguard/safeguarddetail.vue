<!-- 查看详情 -->
<!-- 去导航 -->
<template>
	<view class="navi">
        <view>
            姓名：张三
            电话：
            现场地址
        </view>
        <view class="page-section page-section-gap" style="width: 100%; background: #ddd; height: 300rpx;">
            <!-- <map style="width: 100%; height: 100vh;" :latitude="pageData.latitude" :longitude="pageData.longitude" :markers="pageData.covers"> -->
            <!-- </map> -->
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const pageData = reactive({
    latitude:39.909,
    longitude:116.39742,
    covers:[{
        latitude: 39.909,
        longitude: 116.39742,
        // iconPath: '../../../static/location.png'
    }]
})
onLoad((option)=>{
  if (option.id) {
    console.log(option)
  }
  else {
    uni.showToast({
      title: '协议code参数有误！',
      icon:'none',
      duration: 2000
    });
  }
})
</script>
<style lang="scss" scoped>
</style>