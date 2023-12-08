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
      <view v-if="[1,3].includes(pageData.connectState)" class="pt-10 flex justify-start">
        <view v-if="pageData.connectState==3" class="text-13 text-[#666]">车辆未连接</view>
        <bleimage v-if="pageData.connectState==1"></bleimage>
      </view>
      <view class="py-10">
        <bleselect ref="bleselectRef" @change="bleselectChange" :disabled="false" v-model="pageData.select" :options="pageData.options"></bleselect>
        <!--view class="bg-[#F3F3F3] rounded-7 h-38 leading-38 flex justify-between">
          <view class="line-clamp-1">
            <text class="text-[#000] text-14 pl-15">{{pageData.sharedData}}{{pageData.sharedData.name}}</text>
            <text :style="pageData.sharedData.state == 0 ? 'color:#80c70f' : '' " class="pl-10 text-14">{{pageData.sharedData.stateStr}}</text>
          </view>
          <image class="w-18 h-12 flex-none mt-14 mr-10" :src="configStaticPath('/static/blekey/select.png')"></image>
        </view-->
      </view>
    </view>
    <view v-if="pageData.connectState==3" class="relative z-[1] bg-[#fff] mx-13 mt-13 px-15 py-25 rounded-10 shadow-[1rpx_2rpx_18rpx_2rpx_rgba(164,164,164,0.61)] text-[#000] leading-25">
      <view>APP与车机未建立连接，请检查以下内容</view>
      <view class="mt-20">1、确保您已打开手机蓝牙服务 </view>
      <view>2、确保您已打开车辆电源或手动轻摇晃车辆 </view>
      <view>3、确保您手机与车辆距离&gl;=1米;并点击“<text class="text-[#fd2d2d]">刷新设备</text>”按钮重新尝试连接</view>
    </view>
    <view v-if="pageData.sharedData.id" class="w-85 h-85 absolute right-0 bottom-128 z-3 " @click="onUnlock">
      <image :src="configStaticPath('/static/blekey/unlock.png')" class="w-85 h-85"/>
    </view>
    <view class="absolute left-0 bottom-0 z-2 bg-[#fff]">
      <view class="flex justify-between items-center my-22 mx-13">
        <view class="line-clamp-1 text-l4 text-[#666]">车辆位置：重庆市南岸区重庆市南岸区重庆市南岸区重庆市南岸区重庆市南岸区重庆市南岸区重庆市南岸区</view>
        <button class="flex-none w-70 text-12 h-22 leading-22 rounded-full bg-[#f8cf01] active:bg-[#f0c801]" @click="onCopy">复制</button>
      </view>
      <u-safe-bottom></u-safe-bottom>
    </view>
  </view>
  <u-popup :show="pageData.isDialogShow" mode="center" round="10" :customStyle="{marginLeft:'60rpx',marginRight:'60rpx'}">
    <view class="m-22">
      <view class="my-28 text-17 text-[#333] font-bold"><text class="leading-30">{{pageData.dialogTitle}}</text></view>
      <view v-if="pageData.isDialogIconSuccess" class="mt-40 mb-35">
        <imgage class="w-58 h-58 text-center" :src="configStaticPath('/static/blekey/success.png')"></imgage>
      </view>
      <view class="flex justify-center items-center">
        <button class="w-115 h-40 leading-40 rounded-full bg-[#f8cf01] active:bg-[#f0c801] text-[#333333]" @click="pageData.isDialogShow = false;pageData.dialogCallback();">确定</button>
      </view>
    </view>
  </u-popup>
</template>

<script setup>
import {onMounted,reactive,ref,nextTick} from 'vue'
import {getTokenValue,local} from '@/utils/utils'
import {blekeyShared,blekeyIsShared,blekeyOpen,blekeyOpenResult} from '@/api/blekey/index'
import bleselect from './components/bleselect.vue'
import bleimage from './components/bleimage.vue'
import {configStaticPath} from '@/config/index'
import {onLoad,onShow} from '@dcloudio/uni-app'

const bleselectRef = ref()

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
  spTokenInfo:{},

  dialogTitle:'',
  dialogCallback:()=>{},
  isDialogShow:false,
  isDialogIconSuccess:false,

  isShared:false,
  sharedData:{},
  sharedItems:[],
  select:'',
  options:[],

  connectState:0,//0未连接 1连接中 2已连接 3连接失败
  connectTimer:null,

  //蓝牙连接
  devices: [],
  connected: false,
  chs: [],

  _discoveryStarted:false,
  _deviceId:'',
  //蓝牙连接结束
})

onLoad((option)=>{
  //debug
  pageData.geo_x = pageData.lng
  pageData.geo_y = pageData.lat
  //enddebug
  if (!getTokenValue()) {
    uni.redirectTo({url:'/pages/login/index?url='+encodeURIComponent('/pages/blekey/index')})
    return false
  }
  if (option.spTokenData) {
    pageData.spTokenInfo = JSON.parse(decodeURIComponent(option.spTokenData))
    if (pageData.spTokenInfo.spToken) {
      local.set('blekeySpTokenInfo',pageData.spTokenInfo)

      //debug
      uni.showToast({title: pageData.spTokenInfo.spToken,icon:'none',duration: 2000})
    }
    else if (pageData.spTokenInfo.errorMsg) {
      pageData.dialogTitle = pageData.spTokenInfo.errorMsg
      pageData.isDialogIconSuccess = false
      pageData.dialogCallback = ()=>{}
      pageData.isDialogShow = true
    }
  }
  else {
    let spTokenInfo = local.get('blekeySpTokenInfo')
    if (spTokenInfo) {
      pageData.spTokenInfo = spTokenInfo

      //debug
      uni.showToast({title: pageData.spTokenInfo.spToken,icon:'none',duration: 2000})
    }
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
  blekeyIsShared({}).then(res=>{
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
  blekeyShared({}).then(res=>{
    pageData.sharedItems = res.data || []
    if (pageData.sharedItems.length == 0) {
      pageData.isShared = false

      pageData.dialogTitle = '您无该钥匙使用权限,请联系车主进行授权'
      pageData.isDialogIconSuccess = false
      pageData.dialogCallback = ()=>{gotoBack()}
      pageData.isDialogShow = true

      return false
    }

    let items = []
    pageData.sharedItems.forEach(item=>{
      items.push({value:item.id,label:item.name,labelState:item.stateStr,labelStateColor:'#80c70f'})
      //模拟多个
      //items.push({value:item.id+'x',label:item.name+'2',labelState:item.stateStr,labelStateColor:'red'})
    })
    pageData.options = items

    //选中第一个
    nextTick(()=>{
      if (bleselectRef.value) {
        bleselectRef.value.itemClick(items[0])
      }
    })
  })
}

const bleselectChange = (row)=>{
  let index = pageData.sharedItems.findIndex(item=>{
    return item.id == row.value
  })
  if (index != -1) {
    pageData.sharedData = pageData.sharedItems[index]
  }
}

const gotoBack = ()=>{
  uni.switchTab({url:'/pages/index/index'})
}

const bleConnect = ()=>{
  //连接蓝牙开锁
  pageData.connectState = 1
  clearTimeout(pageData.connectTimer)
  pageData.connectTimer = setTimeout(()=>{
    if (pageData.connectState == 1) {
      pageData.connectState = 3
    }
  },30000)
  openBluetoothAdapter()
}

const onUnlock = ()=>{
  if (pageData.connectState == 1) {
    return false
  }
  if (!pageData.geo_x) {
    pageData.dialogTitle = '当前位置信息获取不到，请授权位置信息权限后重试！'
    pageData.isDialogIconSuccess = false
    pageData.dialogCallback = ()=>{getGeoLocation()}
    pageData.isDialogShow = true

    return false
  }
  if (!pageData.sharedItems.length) {
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

  if (!pageData.spTokenInfo.spToken) {
    uni.redirectTo({url:'/pages/blekey/spweblogin'})
    return false
  }

  blekeyOpen({id:pageData.sharedData.id,token:pageData.spTokenInfo.spToken}).then(res=>{
    bleConnect()
  })
}

const sendBlekeyOpenResult = ()=>{
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


//蓝牙连接开始
const utils_max = function(n1, n2) {
  return Math.max(n1, n2)
}
const utils_len = function(arr) {
  arr = arr || []
  return arr.length
}

function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
  )
  return hexArr.join('');
}

const openBluetoothAdapter = ()=> {
  wx.openBluetoothAdapter({
    success: (res) => {
      console.log('openBluetoothAdapter success', res)
      startBluetoothDevicesDiscovery()
    },
    fail: (res) => {
      if (res.errCode === 10001) {
        wx.onBluetoothAdapterStateChange(function (res) {
          console.log('onBluetoothAdapterStateChange', res)
          if (res.available) {
            startBluetoothDevicesDiscovery()
          }
        })
      }
    }
  })
}

const getBluetoothAdapterState = ()=> {
  wx.getBluetoothAdapterState({
    success: (res) => {
      console.log('getBluetoothAdapterState', res)
      if (res.discovering) {
        onBluetoothDeviceFound()
      } else if (res.available) {
        startBluetoothDevicesDiscovery()
      }
    }
  })
}

const startBluetoothDevicesDiscovery = ()=> {
  if (pageData._discoveryStarted) {
    return
  }
  pageData._discoveryStarted = true
  wx.startBluetoothDevicesDiscovery({
    allowDuplicatesKey: true,
    success: (res) => {
      console.log('startBluetoothDevicesDiscovery success', res)
      onBluetoothDeviceFound()
    },
  })
}

const stopBluetoothDevicesDiscovery = ()=> {
  wx.stopBluetoothDevicesDiscovery()
}

const onBluetoothDeviceFound = ()=> {
  wx.onBluetoothDeviceFound((res) => {
    res.devices.forEach(device => {
      if (!device.name && !device.localName) {
        return
      }
      const foundDevices = pageData.devices
      const idx = inArray(foundDevices, 'deviceId', device.deviceId)

      if (idx === -1) {
        pageData[`devices[${foundDevices.length}]`] = device
      } else {
        pageData[`devices[${idx}]`] = device
      }

      //找到了tbox直接连接
      createBLEConnection(pageData.devices[0])
    })
  })
}

const createBLEConnection = (row)=> {
  const deviceId = row.deviceId
  const name = row.name || row.localName
  wx.createBLEConnection({
    deviceId,
    success: (res) => {
      pageData.connected = true
      pageData.name = name
      pageData.deviceId = deviceId
      getBLEDeviceServices(deviceId)
    }
  })
  stopBluetoothDevicesDiscovery()
}

const closeBLEConnection = ()=> {
  wx.closeBLEConnection({
    deviceId: pageData.deviceId
  })
  pageData.connected = false
  pageData.chs = []
  pageData.canWrite =  false
}

const getBLEDeviceServices = (deviceId)=> {
  wx.getBLEDeviceServices({
    deviceId,
    success: (res) => {
      for (let i = 0; i < res.services.length; i++) {
        if (res.services[i].isPrimary) {
          getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
          return
        }
      }
    }
  })
}

const getBLEDeviceCharacteristics = (deviceId, serviceId)=> {
  wx.getBLEDeviceCharacteristics({
    deviceId,
    serviceId,
    success: (res) => {
      console.log('getBLEDeviceCharacteristics success', res.characteristics)
      for (let i = 0; i < res.characteristics.length; i++) {
        let item = res.characteristics[i]
        if (item.properties.read) {
          wx.readBLECharacteristicValue({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
          })
        }
        if (item.properties.write) {
          pageData.canWrite = true

          pageData._deviceId = deviceId
          pageData._serviceId = serviceId
          pageData._characteristicId = item.uuid

          pageData.connectState = 2
          writeBLECharacteristicValue()
        }
        if (item.properties.notify || item.properties.indicate) {
          wx.notifyBLECharacteristicValueChange({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
            state: true,
          })
        }
      }
    },
    fail(res) {
      console.error('getBLEDeviceCharacteristics', res)
    }
  })
  // 操作之前先监听，保证第一时间获取数据
  wx.onBLECharacteristicValueChange((characteristic) => {
    const idx = inArray(pageData.chs, 'uuid', characteristic.characteristicId)

    if (idx === -1) {
      pageData[`chs[${pageData.chs.length}]`] = {
        uuid: characteristic.characteristicId,
        value: ab2hex(characteristic.value)
      }
    } else {
      pageData[`chs[${idx}]`] = {
        uuid: characteristic.characteristicId,
        value: ab2hex(characteristic.value)
      }
    }
    // data[`chs[${pageData.chs.length}]`] = {
    //   uuid: characteristic.characteristicId,
    //   value: ab2hex(characteristic.value)
    // }

  })
}

const writeBLECharacteristicValue = ()=> {
  // 向蓝牙设备发送一个0x00的16进制数据
  let buffer = new ArrayBuffer(1)
  let dataView = new DataView(buffer)
  dataView.setUint8(0, Math.random() * 255 | 0)
  wx.writeBLECharacteristicValue({
    deviceId: pageData._deviceId,
    serviceId: pageData._deviceId,
    characteristicId: pageData._characteristicId,
    value: buffer,
  })
  sendBlekeyOpenResult()
}

const closeBluetoothAdapter = ()=> {
  wx.closeBluetoothAdapter()
  pageData._discoveryStarted = false
}
//蓝牙连接结束
</script>

<style lang="scss" scoped>

</style>