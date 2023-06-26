<template>
    <view>
    <u-modal :show="show"
      :showConfirmButton="false" ref="uModal" >
      <view class="slot-content">
        <view class="title"><text class="alarm-red">{{ alarmData.data.name}}</text>发出了<text class="alarm-red">紧急求助！</text>
        这是{{ alarmData.data.name}}的位置，请前往救助！
        </view>
        <view class="map">
          <view class="page-section page-section-gap" style="width: 100%; background: #ddd; height: 300rpx;">
            <map style="width: 100%; height: 300rpx;" :latitude="alarmData.data.latitude" :longitude="alarmData.data.longitude" :markers="alarmData.data.covers">
            </map>
          </view>
          <view class="map-name">
            <image  src="/static/img/user.png"  mode="widthFix"/>
             {{ alarmData.data.address }}
          </view>
        </view>
        <view class="foot-btn">
          <view class="btn btn1" @click="closeShow(alarmData.data.id)">查看详情</view>
          <view class="btn btn2" @click="confirmShow(alarmData.data.id)">导航去这里</view>
        </view>
      </view>
    </u-modal>
  </view>
</template>


<script setup>
import { ref, onMounted, reactive,watch } from 'vue'
import { onLoad ,onReachBottom} from '@dcloudio/uni-app'
const show = ref(true);
const alarmData = reactive({
  data:{
    id: '1601683533353328702',
    name: '张三',
    phone: '13333333333',
    address: '重庆市四川商会重庆市四川商会商会',
    latitude: 39.909,
    longitude: 116.39742,
    covers: [{
      latitude: 39.909,
      longitude: 116.39742,
      // iconPath: '../../../static/location.png'
    }]
  }
})

const confirmShow = (id) => {
  show.value = false;
  console.log('去导航');
  // uni.navigateTo({ url: '/pages/emergencycontact/index?id=' + encodeURIComponent(13333333333) })
  uni.navigateTo({ url: '/pages/safeguard/gonavigation?id=' + encodeURIComponent(id) })
}
const closeShow = (id) =>  {
  show.value = false;
  console.log('查看详情');
  uni.navigateTo({ url: '/pages/safeguard/safeguarddetail?id=' + encodeURIComponent(id) })
}
</script>

<style lang="scss" scoped>
.slot-content{
  width: 100%;
  .title{
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 32rpx;
    .alarm-red{
      font-size: 38rpx;
      color: #EC5938;
    }
  }
  .map{
    margin: 20rpx 0;
    .map-name{
      background: #F5F5F5;
      opacity: 0.95;
      border-radius: 0rpx 0rpx 10rpx 10rpx;
      font-size: 28rpx;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #272A29;
      padding:10rpx;
      display: flex;
      align-items: center;
      image{
        width: 30rpx;
        margin-right: 10rpx;
      }
    }
  }
  .foot-btn{
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 20rpx;
    .btn{
      width: 256rpx;
      height: 85rpx;
      line-height: 85rpx;
      border-radius: 43rpx;
      text-align: center;
    }
    .btn1{
      background: #F4F5F6;
      color: #666666;
      
    }
    .btn2{
      background: #FACC0A;
      color: #272A29;
    }
  }
}
</style>