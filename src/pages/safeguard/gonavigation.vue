<!-- 去导航 -->
<template>
	<view class="navi">
        <!-- <view class="page-section page-section-gap" style="width: 100%; background: #ddd; height: 100vh;"> -->
            <map style="width: 100%; height: 100vh;" :latitude="pageData.latitude" :longitude="pageData.longitude" :markers="pageData.covers">
            </map>
        <!-- </view> -->
        <view class="box">
            <view class="info">
                <view>姓名：张三</view>
                <view>电话：186966666666</view>
            </view>
            <view class="funk">
                <view>拨打电话</view>
                <view @click="openMap(pageData.longitude,pageData.latitude)">去导航</view>
            </view>
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
const  openMap = (lon,lat) => {
    console.log("获取经纬度ssssfff", lon, lat);
    //打开地图，并将门店位置传入
    uni.getLocation({
        success: res => {
            // res.latitude=lat;
            // res.longitude=lon;
            console.log('location success', parseFloat(lat), parseFloat(lon))
            uni.openLocation({
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
                scale: 18
            })
        }
        
    })
}
</script>
<style lang="scss" scoped>
.navi{
    position: relative;
    .box{
        width: 100%;
        position: fixed;
        bottom: 0;
        
        .info,.funk{
            display: flex;
            
        }
        .info{
            background-color: rgba(0,0,0,0.3);
            height: 80rpx;
            align-items: center;
            justify-content: space-around;
            font-size: 26rpx;
            color:#fff
        }
        .funk{
            background-color: #fff;
            height: 100rpx;
            align-items: center;
            justify-content: space-around;
        }
    }
}
</style>