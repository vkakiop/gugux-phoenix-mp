<template>
    <view class="safe">
    <u-modal :show="show"
      :showConfirmButton="false" ref="uModal" >
      <view class="slot-content">
        <view class="title">
          <!-- <text class="alarm-red">{{ alarmData.data.name}}</text>发出了<text class="alarm-red">紧急求助！</text>
            这是{{ alarmData.data.name}}的位置，请前往救助！ -->
            {{ alarmData.msg }}
        </view>
        <view class="map">
          <view class="page-section page-section-gap" style="width: 100%; background: #ddd; height: 300rpx;">
            <map style="width: 100%; height: 300rpx;" :latitude="alarmData.data.lat" :longitude="alarmData.data.lng" :markers="alarmData.data.covers">
            </map>
          </view>
          <view class="map-name">
            <image  src="/static/img/user.png"  mode="widthFix"/>
             {{ alarmData.data.unusualLocation }}
          </view>
        </view>
        <view class="foot-btn">
          <view class="btn btn1" @click="closeShow(alarmData.data.manageId)">查看详情</view>
          <view class="btn btn2" @click="confirmShow(alarmData.data.manageId)">导航去这里</view>
        </view>
        <view class="close">
          <image @click="closeBox" class="img" src="/static/img/close.png"  mode="widthFix"/>
        </view>
      </view>
    </u-modal>
  </view>
</template>


<script setup>
import { ref, onMounted, reactive,watch } from 'vue'
import { onLoad ,onReachBottom} from '@dcloudio/uni-app'
import useSafeguardStore from '@/store/modules/safeguard'
import JSONBIG from 'json-bigint'
const show = ref(false);
const alarmData = reactive({
  storageData:'',
  msg:'',
  data:{
    manageId: '',
    username: '',
    phone: '',
    unusualLocation: '',
    lat: 39.909,
    lng: 116.39742,
    covers: [{
      latitude: 39.909,
      longitude: 116.39742,
      // iconPath: '../../../static/location.png'
    }]
  }
})
onLoad(()=>{
  getData();
})
const getData = ()=>{
  let data =  uni.getStorageSync('admin-safe');
  console.log(data);
  if(data){
    alarmData.msg = data.data.content;
    alarmData.data = data.data.data;
    const json = JSONBIG({storeAsString:true});
    alarmData.data = json.parse(data.data.data);
    alarmData.data.covers = [{
      latitude : alarmData.data.lat||39.909,
      longitude : alarmData.data.lng||116.39742,
    }]
    show.value = true;
  }
}

watch(()=>useSafeguardStore().get(),(newVal,oldVal)=>{
    getData();
})

const confirmShow = (manageId) => {
  show.value = false;
  console.log('去导航');
  uni.navigateTo({ url: '/pages/safeguard/gonavigation?id=' + encodeURIComponent(manageId) });
  remove();
}
const closeShow = (manageId) =>  {
  show.value = false;
  uni.navigateTo({ url: '/pages/safeguard/safeguarddetail?id=' + encodeURIComponent(manageId) });
  remove();
  console.log('查看详情');
}
const remove = () =>{
  uni.removeStorage({
      key: 'admin-safe',
      success: function (res) {
          console.log('success');
      }
  });
}
const closeBox = () =>{
  show.value = false;
  remove();
}
</script>

<style lang="scss" scoped>
.safe{
  position: relative;
  .close{
    position: fixed;
    bottom: 130rpx;
    text-align: center;
    left:0;
    right: 0;
    margin: auto;
    .img{
      width:100rpx;
    }
  }
}
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