<template>
  <customNav>
    <view @click="gotoBack" class="pl-10 mt-[3rpx]"><uni-icons type="back" size="24"></uni-icons></view>
    <view class="name mx-6 text-18 line-clamp-1">蓝牙数字钥匙</view>
  </customNav>
  <view v-if="pageData.isShared">
    <view class="absolute top-0 left-0 w-screen h-screen">
      <map style="width: 100%; height: 100vh" :latitude="pageData.lat" :longitude="pageData.lng" :markers="pageData.markers">
      </map>
    </view>
    <view class="h-10 relative z-[1] bg-[#fff]"></view>
    <view class="px-13 relative z-[2] bg-[#fff] border-solid border-t-1 border-[#ebebeb]">
      <view class="pt-10 flex justify-start">
        <view class="text-13 text-[#666]">车辆未连接</view>
        <bleimage></bleimage>
      </view>
      <view class="py-10">
        <!--bleselect :disabled="false" v-model="pageData.select" :options="pageData.options"></bleselect-->
        <view class="bg-[#F3F3F3] rounded-7 h-38 leading-38 flex justify-between">
          <view class="line-clamp-1">
            <text class="text-[#000] text-14 pl-15">{{pageData.sharedData.name}}</text>
            <text :style="pageData.sharedData.state == 0 ? 'color:#80c70f' : '' " class="pl-10 text-14">{{pageData.sharedData.stateStr}}</text>
          </view>
          <image class="w-18 h-12 flex-none mt-14 mr-10" :src="configStaticPath('/static/blekey/select.png')"></image>
        </view>
      </view>
    </view>
    <view class="relative z-[1] bg-[#fff] mx-13 mt-13 px-15 py-25 rounded-10 shadow-[1rpx_2rpx_18rpx_2rpx_rgba(164,164,164,0.61)] text-[#000] leading-25">
      <view>APP与车机未建立连接，请检查以下内容</view>
      <view class="mt-20">1、确保您已打开手机蓝牙服务 </view>
      <view>2、确保您已打开车辆电源或手动轻摇晃车辆 </view>
      <view>3、确保您手机与车辆距离&gl;=1米;并点击“<text class="text-[#fd2d2d]">刷新设备</text>”按钮重新尝试连接</view>
    </view>
    <view class="w-85 h-85 absolute right-0 bottom-128 z-3 " @click="onUnlock">
      <image :src="configStaticPath('/static/blekey/unlock.png')" class="w-85 h-85"/>
    </view>
    <view class="absolute left-0 bottom-0 z-2 bg-[#fff]">
      <view class="flex justify-between items-center my-22 mx-13">
        <view class="line-clamp-1 text-l4 text-[#666]">车辆位置：重庆市南岸区重庆市南岸区重庆市南岸区重庆市南岸区重庆市南岸区重庆市南岸区重庆市南岸区</view>
        <button class="flex-none w-70 text-12 h-22 leading-22 rounded-full bg-[#f8cf01] active:bg-[#f0c801]" @click="onCopy">复制</button>
      </view>
      <u-safe-bottom></u-safe-bottom>
    </view>
    <u-popup :show="pageData.isDialogShow" mode="center" round="10" :customStyle="{marginLeft:'60rpx',marginRight:'60rpx'}">
      <view class="m-22">
        <view class="my-28">{{pageData.dialogTitle}}</view>
        <view v-if="pageData.isDialogIconSuccess" class="mt-40 mb-35">
          <imgage class="w-58 h-58 text-center" :src="configStaticPath('/static/blekey/success.png')"></imgage>
        </view>
        <view class="flex justify-center items-center">
          <button class="w-115 h-40 leading-40 rounded-full bg-[#f8cf01] active:bg-[#f0c801] text-[#333333]" @click="pageData.isDialogShow = false;pageData.dialogCallback();">确定</button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import {onMounted,reactive} from 'vue'
import {blekeyShared,blekeyIsShared,blekeyOpenResult} from '@/api/blekey/index'
import bleselect from './components/bleselect.vue'
import bleimage from './components/bleimage.vue'
import {configStaticPath} from '@/config/index'
import {onLoad,onShow} from '@dcloudio/uni-app'
const pageData = reactive({
  lng:106.550513, //车所在经纬度
  lat:29.562014,

  geo_x:0, //当前开锁经纬度
  geo_y:0,

  markers: [
    // {
    //   longitude: 106.550513,
    //   latitude: 29.562014,
    //   iconPath: configStaticPath('/static/blekey/location.png'),
    //   width:50,
    //   height:58,
    //   anchor:{x:.5,y:1}
    // }
  ],
  spToken:'',

  dialogTitle:'',
  dialogCallback:()=>{},
  isDialogShow:false,
  isDialogIconSuccess:false,

  isShared:false,
  sharedData:{}
})

onLoad((option)=>{
  if (option.spToken) {
    pageData.spToken = option.spToken
    uni.showToast({title: option.spToken,icon:'none',duration: 2000})
  }
  getGeoLocation()
  getBlekeyIsShared()
})

//距离获取
const getGeoLocation = () => {
  uni.getLocation({
    type:'gcj02',
    success: function (res) {
      pageData.geo_x = res.longitude;
      pageData.geo_y = res.latitude;
    }
  })
}

const getBlekeyIsShared = ()=>{
  blekeyIsShared({},pageData.spToken).then(res=>{
    pageData.isShared = res.data.isShared
    if (pageData.isShared) {
      getBlekeyShared()
    }
    else {
      pageData.dialogTitle = '您无该钥匙使用权限,请联系车主进行授权'
      pageData.isDialogIconSuccess = false
      pageData.dialogCallback = ()=>{gotoBack()}
      pageData.isDialogShow = true
    }
  })
}

const getBlekeyShared = ()=>{
  blekeyShared({},pageData.spToken).then(res=>{
    pageData.sharedData = res.data || {}
  })
}

const gotoBack = ()=>{
  uni.switchTab({url:'/pages/index/index'})
}

const onUnlock = ()=>{
  if (!pageData.geo_x) {
    pageData.dialogTitle = '当前位置信息获取不到，请授权位置信息权限后重试！'
    pageData.isDialogIconSuccess = false
    pageData.dialogCallback = ()=>{getGeoLocation()}
    pageData.isDialogShow = true

    return false
  }
  if (!pageData.sharedData.id) {
    pageData.dialogTitle = '数据加载中，请稍后重试！'
    pageData.isDialogIconSuccess = false
    pageData.dialogCallback = ()=>{}
    pageData.isDialogShow = true
    return false
  }
  if (pageData.sharedData.state != 0) {
    pageData.dialogTitle = '您的蓝牙钥匙授权'+pageData.sharedData.stateStr+'，请联系车主恢复'
    pageData.isDialogIconSuccess = false
    pageData.dialogCallback = ()=>{}
    pageData.isDialogShow = true
    return false
  }

  //连接蓝牙开锁


  //开锁成功
  blekeyOpenResult({
    address: '',
    code: 0,
    encryptedStr: pageData.sharedData.encryptedStr,
    id: pageData.sharedData.id,
    lng: pageData.geo_x,
    lat: pageData.geo_y
  }).then(res=>{
    pageData.dialogTitle = '蓝牙钥匙开锁成功!'
    pageData.isDialogIconSuccess = true
    pageData.dialogCallback = ()=>{}
    pageData.isDialogShow = true
  })
}

const onCopy = ()=>{
  uni.setClipboardData({
    data: 'test',
    success: () => {
      uni.showToast({
        title: '复制成功'
      })
    }
  })
}
</script>

<style lang="scss" scoped>

</style>