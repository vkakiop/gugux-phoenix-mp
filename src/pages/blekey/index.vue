<template>
  <customNav>
    <view @click="gotoBack" class="pl-10 mt-[3rpx]"><uni-icons type="back" size="24"></uni-icons></view>
    <view class="name mx-6 text-18 line-clamp-1">蓝牙数字钥匙</view>
  </customNav>
  <view v-if="pageData.isShared">
    <view class="absolute top-0 left-0 w-screen h-screen">
      <map v-if="pageData.lat && pageData.lng" style="width: 100%; height: 100vh" :latitude="pageData.lat" :longitude="pageData.lng" :markers="pageData.markers">
      </map>
    </view>
    <view class="h-10 relative z-[1] bg-[#fff]"></view>
    <view class="px-13 relative z-[2] bg-[#fff] border-solid border-t-1 border-[#ebebeb]">
      <view v-if="[1,3].includes(pageData.connectState)" class="pt-10 flex justify-end">
        <view v-if="pageData.connectStateLog" class="text-13 text-[#666]">{{pageData.connectStateLog}}</view>
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
    <view v-if="pageData.sharedData.id" class="w-85 h-85 absolute right-0 bottom-128 z-[3] " @click="onUnlock">
      <cover-image :src="configStaticPath('/static/blekey/unlock.png')" class="w-85 h-85"/>
    </view>
    <view v-if="pageData.address || (pageData.lng && pageData.lat)" class="absolute w-full left-0 bottom-0 z-[2] bg-[#fff]">
      <view class="flex justify-between items-center my-22 mx-13">
        <view class="line-clamp-1 text-l4 text-[#666]" v-if="pageData.address">车辆位置：{{pageData.address}}</view>
        <image v-if="pageData.lng && pageData.lat" :src="configStaticPath('/static/blekey/gotolocation.png')" class="flex-none w-79 h-22" @click="onLocation"/>
      </view>
      <u-safe-bottom></u-safe-bottom>
    </view>
  </view>
  <u-popup :show="pageData.isDialogShow" mode="center" round="10" :customStyle="{marginLeft:'60rpx',marginRight:'60rpx'}">
    <view class="m-22">
      <view class="my-28 text-17 text-[#333] font-bold"><text class="leading-30 break-all" user-select>{{pageData.dialogTitle}}</text></view>
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
import {onMounted,reactive,ref,nextTick,getCurrentInstance} from 'vue'
import {getTokenValue,local} from '@/utils/utils'
import {encodeBlekey,encodeBlekeyAb,decodeBlekey,decodeBlekeyAb,ab2hex,hex2ab,ab2str,str2ab,decimal2hex} from '@/utils/crypto'
import {blekeyShared,blekeyIsShared,blekeyOpen,blekeyOpenResult,blekeySharePlace} from '@/api/blekey/index'
import bleselect from './components/bleselect.vue'
import bleimage from './components/bleimage.vue'
import {configStaticPath} from '@/config/index'
import {onLoad,onShow,onUnload} from '@dcloudio/uni-app'
import {getAddress} from '@/utils/amap.js'
import useBlekeyStore from '@/store/modules/blekey'

const _this = getCurrentInstance();

const pageData = reactive({
  lng:0, //车所在经纬度
  lat:0,
  address:'',

  geo_x:0, //当前开锁经纬度
  geo_y:0,
  geo_address:'未知位置',

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
  connectStateLog:'',
  connectTimer:null,
  needUnlock:false, //是否需要进入开锁流程

  encryptedStr:'',
  encryptedStrDecodeAb:new ArrayBuffer(1),

  //蓝牙连接
  devices: [],
  connected: false,
  chs: [],

  _discoveryStarted:false,
  _deviceId:'',
  //蓝牙连接结束
})

const getCrytoKeyTest = ()=>{
  let mac = "48:B3:65:89:40:A8"
  mac = mac.replaceAll(':','')
  return mac + mac
}

onLoad((option)=>{
  //debug
  //pageData.geo_x = pageData.lng
  //pageData.geo_y = pageData.lat
  //enddebug
  if (!getTokenValue()) {
    uni.redirectTo({url:'/pages/login/index?url='+encodeURIComponent('/pages/blekey/index')})
    return false
  }
  if (option.spTokenData) {
    pageData.spTokenInfo = JSON.parse(decodeURIComponent(option.spTokenData))
    if (pageData.spTokenInfo.spToken) {
      local.set('blekeySpTokenInfo',pageData.spTokenInfo)

      pageData.needUnlock = true
      //debug
      //console.log('pageData.spTokenInfo.spToken',pageData.spTokenInfo.spToken)
      //uni.showToast({title: pageData.spTokenInfo.spToken,icon:'none',duration: 2000})
    }
    else if (pageData.spTokenInfo.errorMsg) {
      console.log('pageData.spTokenInfo',pageData.spTokenInfo)
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
      //uni.showToast({title: pageData.spTokenInfo.spToken,icon:'none',duration: 2000})
    }
  }
  //getGeoLocation()
  getBlekeyIsShared()
})

onUnload(()=>{
  clearTimeout(pageData.connectTimer)
})

//距离获取
const getGeoLocationPromise = () => {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type:'gcj02',
      success: function (res) {
        pageData.geo_x = res.longitude;
        pageData.geo_y = res.latitude;

        getAddress(pageData.geo_x,pageData.geo_y).then(res=>{
          pageData.geo_address = res
          resolve()
        }).catch(res=>{
          pageData.geo_address = '未知位置'
          console.log('getAddress error:',res)
          resolve()
        })
      },
      fail: function(err) {
        console.log('getGeoLocationPromise error:',err)
        reject()
      }
    })
  })
}

const getBlekeySharePlace = ()=>{
  if (pageData.sharedData && pageData.sharedData.vin) {
    blekeySharePlace({vin:pageData.sharedData.vin}).then(res=>{
      pageData.address = res.data.address
      pageData.lng = res.data.lng
      pageData.lat = res.data.lat

      //测试经纬度
      // pageData.address = '测试经纬度'
      // pageData.lng = 106.550513
      // pageData.lat = 29.562014
    })
  }
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


    //模拟多个
    //pageData.sharedItems.push({...pageData.sharedItems[0],id:'1',name:'test'})

    let items = []
    pageData.sharedItems.forEach(item=>{
      items.push({value:item.id,label:item.name,labelState:item.stateStr,labelStateColor:'#80c70f'})
    })
    pageData.options = items

    //选中前面选中的 如果没有选第一个
    let selectId = useBlekeyStore().getBlekeyIndexData().selectId
    let index = items.findIndex(item=>{
      return item.value == selectId
    })
    if (index == -1) {
      index = 0
    }
    nextTick(()=>{
      let bleselectRef = _this.refs.bleselectRef
      bleselectRef.itemClick(items[index])
    })
  })
}

const bleselectChange = (row)=>{
  let index = pageData.sharedItems.findIndex(item=>{
    return item.id == row.value
  })
  if (index != -1) {
    pageData.sharedData = pageData.sharedItems[index]
    getBlekeySharePlace()

    useBlekeyStore().setBlekeyIndexData({selectId:pageData.sharedData.id})

    closeBluetoothAdapter(true)

    if (pageData.needUnlock) {
      onUnlock()
    }
  }
}

const gotoBack = ()=>{
  uni.switchTab({url:'/pages/index/index'})
}

const getCrytoKey = ()=>{
  let mac = pageData.sharedData.mac + ''
  mac = mac.replaceAll(':','')
  return mac + mac
}

const bleConnect = ()=>{
  //连接蓝牙开锁
  pageData.connectState = 1
  clearTimeout(pageData.connectTimer)
  pageData.connectTimer = setTimeout(()=>{
    if (pageData.connectState == 1) {
      pageData.connectState = 3
      closeBluetoothAdapter(false)
    }
  },30000)
  openBluetoothAdapter()
}

const onUnlock = async()=>{
  if (pageData.connectState == 1) {
    return false
  }
  try {
    await getGeoLocationPromise()
  }
  catch (e) {
    pageData.dialogTitle = '当前位置信息获取不到，请授权位置信息权限后重试！'
    pageData.isDialogIconSuccess = false
    pageData.dialogCallback = ()=>{}
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

  //debug
  //console.log('header token:',getTokenValue())
  //console.log('/gugux-services-user-api/app/digital/key/share/open',{id:pageData.sharedData.id,token:pageData.spTokenInfo.spToken})
  blekeyOpen({id:pageData.sharedData.id,token:pageData.spTokenInfo.spToken,type:2}).then(res=>{
    console.log('RES:',res)
    let status = res.data.status
    if (status == 1) {
      pageData.encryptedStr = res.data.encryptedStr
      pageData.encryptedStrDecodeAb = decodeBlekeyAb(pageData.encryptedStr,getCrytoKey())
      bleConnect()
    }
    else {
      let title = ''
      if (status == 0) {
        title = '操作异常，请重试'
      }
      else if (status == 2) {
        title = '您未获得蓝牙钥匙合法授权，请联系车主；双卡手机请重新设置主从号顺序后重试'
      }
      else if (status == 3) {
        title = '您的蓝牙钥匙授权已被删除，不能开锁'
      }
      else if (status == 4) {
        title = '您的蓝牙钥匙授权已冻结，请联系车主恢复'
      }
      else if (status == 5) {
        title = '您的蓝牙钥匙授权未生效，暂不能开锁'
      }
      else if (status == 6) {
        title = '您的蓝牙钥匙授权已过期，不能开锁'
      }

      if (title) {
        pageData.dialogTitle = title
        pageData.isDialogIconSuccess = false
        pageData.dialogCallback = ()=>{}
        pageData.isDialogShow = true
      }

      if ([0,2].includes(status)) {
        pageData.spTokenInfo = {}
        //debug
        local.remove('blekeySpTokenInfo')
      }
    }
  })
}

const sendBlekeyOpenResult = (row)=>{
  blekeyOpenResult({
    address: pageData.geo_address,
    code: row.code,
    encryptedStr: row.encryptedStr,
    id: pageData.sharedData.id,
    lng: pageData.geo_x,
    lat: pageData.geo_y
  }).then(res=>{})
}

const onLocation = ()=>{
  uni.openLocation({
    latitude: parseFloat(pageData.lat),
    longitude: parseFloat(pageData.lng),
    scale: 18
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



const openBluetoothAdapter = ()=> {
  wx.openBluetoothAdapter({
    success: (res) => {
      console.log('openBluetoothAdapter success', res)
      startBluetoothDevicesDiscovery()
    },
    fail: (res) => {
      console.log('openBluetoothAdapter fail',res)
      if (res.errCode === 10001) {
        pageData.dialogTitle = '当前蓝牙适配器不可用，请打开手机的蓝牙权限！'
        pageData.isDialogIconSuccess = false
        pageData.dialogCallback = ()=>{pageData.connectState = 0}
        pageData.isDialogShow = true

        wx.onBluetoothAdapterStateChange(function (res) {
          console.log('onBluetoothAdapterStateChange', res)
          if (res.available) {
            startBluetoothDevicesDiscovery()
          }
        })
      }
      else {
        pageData.dialogTitle = '当前蓝牙打开失败，请重试！' + res.errno + res.errMsg
        pageData.isDialogIconSuccess = false
        pageData.dialogCallback = ()=>{}
        pageData.isDialogShow = true
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
  pageData.connectStateLog = '开始查找设备'
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
      // if (!device.name && !device.localName) {
      //   return
      // }
      // const foundDevices = pageData.devices
      // const idx = inArray(foundDevices, 'deviceId', device.deviceId)
      //
      // if (idx === -1) {
      //   pageData[`devices[${foundDevices.length}]`] = device
      // } else {
      //   pageData[`devices[${idx}]`] = device
      // }
      //找到了tbox直接连接
      if (device.deviceId == pageData.sharedData.mac) {
        pageData.connectStateLog = '找到设备'
        createBLEConnection(device)
        stopBluetoothDevicesDiscovery()
      }
    })
  })
}

const createBLEConnection = (row)=> {
  const deviceId = row.deviceId
  const name = row.name || row.localName
  wx.createBLEConnection({
    deviceId,
    success: (res) => {
      pageData.connectStateLog = '连接设备成功'

      const mtu = 190;
      wx.setBLEMTU({
        deviceId: deviceId,
        mtu,
        success:(res)=>{
          console.log('wx.setBLEMTU success',res)
        },
        fail:(res)=>{
          console.log('wx.setBLEMTU fail',res)
        },
        complete:(res)=> {
          pageData.connected = true
          pageData.name = name
          pageData.deviceId = deviceId
          getBLEDeviceServices(deviceId)
        }
      })
    },
    fail: (res) => {
      pageData.connectStateLog = '连接设备失败'

      pageData.dialogTitle = '连接设备失败,请重试！'
      pageData.isDialogIconSuccess = false
      pageData.dialogCallback = ()=>{}
      pageData.isDialogShow = true

      closeBluetoothAdapter(true)
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
      let items = res.characteristics
      for (let i = 0; i < items.length; i++) {
        let item = items[i]
        if (item.properties.write) {
          pageData.canWrite = true

          pageData._deviceId = deviceId
          pageData._serviceId = serviceId
          pageData._characteristicId = item.uuid

          pageData.connectState = 2
          break;
        }
      }
      for (let i = 0; i < items.length; i++) {
        let item = items[i]

        if (item.properties.notify || item.properties.indicate) {
          console.log('wx.notifyBLECharacteristicValueChange success')
          wx.notifyBLECharacteristicValueChange({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
            state: true,
            success: (res) => {
              console.log('wx.notifyBLECharacteristicValueChange success',res);
              writeBLECharacteristicValue()
            },
            fail: function (res) {
              console.log('wx.notifyBLECharacteristicValueChange fail',res);
            },
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

    let nofityDataHex = ab2hex(characteristic.value)
    let successHex = nofityDataHex.substr(16,4)
    let notifySourceData = nofityDataHex.substr(20)
    let isSuccess = successHex == '3601'
    console.log('读取原始数据：',nofityDataHex)

    pageData.dialogTitle = isSuccess ? '蓝牙钥匙开锁成功!' : '蓝牙钥匙开锁失败!'
    pageData.isDialogIconSuccess = true
    pageData.dialogCallback = ()=>{}
    pageData.isDialogShow = true

    let encryptedStr = ab2hex(encodeBlekeyAb(notifySourceData,getCrytoKey()))
    sendBlekeyOpenResult({code:isSuccess ? 1 : 0,encryptedStr:encryptedStr})

    //开锁完成之后10秒钟再断开
    setTimeout(()=>{
      closeBluetoothAdapter(true)
    },10000)

  })
}

const writeBLECharacteristicValue = ()=> {
  // 向蓝牙设备发送一个0x00的16进制数据
  // let buffer = new ArrayBuffer(1)
  // let dataView = new DataView(buffer)
  // dataView.setUint8(0, Math.random() * 255 | 0)
  let sourceHex = ab2hex(pageData.encryptedStrDecodeAb)
  console.log('长度十进制:',sourceHex.length/2)
  console.log('长度',decimal2hex(sourceHex.length/2))
  let buffer = hex2ab('50'+pageData.sharedData.mac+'303601'+decimal2hex(sourceHex.length/2)+'00'+sourceHex)
  wx.writeBLECharacteristicValue({
    deviceId: pageData._deviceId,
    serviceId: pageData._serviceId,
    characteristicId: pageData._characteristicId,
    value: buffer,
    success (res) {
      console.log('解密后数据：',sourceHex)
      console.log('向蓝牙写入数据：',pageData._deviceId,pageData._characteristicId,ab2hex(buffer))
      console.log('wx.writeBLECharacteristicValue success', res)
    },
    fail (res) {
      console.log('wx.writeBLECharacteristicValue fail', res)
    }
  })


}

const closeBluetoothAdapter = (isChangeConnectState)=> {
  stopBluetoothDevicesDiscovery()
  wx.offBLECharacteristicValueChange()
  wx.offBLEConnectionStateChange()

  wx.closeBLEConnection({
    deviceId:pageData._deviceId,
    success (res) {
    },
    fail (res) {
    },
    complete (res) {
      wx.closeBluetoothAdapter()

      pageData.needUnlock = false
      pageData._discoveryStarted = false
      if (isChangeConnectState) {
        pageData.connectState = 0
      }
      pageData.connectStateLog = ''
    }
  })


}
//蓝牙连接结束
</script>

<style lang="scss" scoped>

</style>