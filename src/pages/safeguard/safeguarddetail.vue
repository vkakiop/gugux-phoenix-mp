<!-- 查看详情 -->
<!-- 去导航 -->
<template>
  <view class="navi">
    <view class="userinfo">
      <view><view>姓名：<text>{{ pageData.data.name }}</text></view>
      </view>
      <view>
        <view>电话：<text>{{ pageData.data.phone }}</text>
        </view>
        <view>拨打电话</view>
      </view>
      <view>
        <view>现场地址：</view>
        <view>去导航</view>
      </view>
      <view>{{ pageData.data.address }}</view>
    </view>
    <view class="page-section page-section-gap" style="width: 100%; background: #ddd; height: 300rpx;">
      <!-- <map style="width: 100%; height: 100vh;" :latitude="pageData.data.latitude" :longitude="pageData.data.longitude" :markers="pageData.data.covers"> -->
      <!-- </map> -->
    </view>
    <view class="box">
      <text>现场图片：</text>
      <view class="photo">
          <image v-for="(item,index) in pageData.data.imgs" @click="previewImage(item)" :key="index" :src="item" alt=""></image>
      </view>
    </view>
    <view class="box">
      <text>现场视频：</text>
    </view>
    <view class="box">
      <text>现场录音：</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const pageData = reactive({
  data: {
    id: '',
    name: '张三',
    phone: '13333333333',
    address: '重庆市四川商会重庆市四川商会重庆市四川商会重庆市四川商会',
    latitude: 39.909,
    longitude: 116.39742,
    imgs: [
    'https://cdn.uviewui.com/uview/album/1.jpg',
    'https://cdn.uviewui.com/uview/album/2.jpg',
    'https://cdn.uviewui.com/uview/album/3.jpg',
    'https://cdn.uviewui.com/uview/album/4.jpg',
    'https://cdn.uviewui.com/uview/album/5.jpg',
    'https://cdn.uviewui.com/uview/album/6.jpg',
    'https://cdn.uviewui.com/uview/album/7.jpg',
    'https://cdn.uviewui.com/uview/album/8.jpg',
    'https://cdn.uviewui.com/uview/album/9.jpg',
    'https://cdn.uviewui.com/uview/album/10.jpg',
    ],
    video: [],
    audio: [],
    covers: [{
      latitude: 39.909,
      longitude: 116.39742,
      // iconPath: '../../../static/location.png'
    }]
  }
})
onLoad((option) => {
  if (option.id) {
    pageData.data.id = option.id;
  }
  else {
    uni.showToast({
      title: '协议code参数有误！',
      icon: 'none',
      duration: 2000
    });
  }
})

const previewImage = (url)=>{
  console.log(url)
  uni.previewImage({
    urls:[url],
    current:url
  })
}
</script>
<style lang="scss" scoped>
.navi {
  padding: 20rpx;
  .userinfo{
    >view{
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
  .box{
    .photo{
      overflow: scroll;
     white-space: nowrap;
      image{
        width:150rpx;
        height: 150rpx;
        margin-right: 30rpx;
      }
    }
  }
}</style>