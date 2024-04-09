<template>
  <view>
    <view class="mx-20 mt-20">
      <view>
        <view class="mb-10">请输入需要连接的mac地址：</view>
        <view class="flex items-center">
          <u-input v-model="pageData.mac1" maxlength="2" @change="changeMac"/><view class="text-[#999] mx-5">:</view>
          <u-input v-model="pageData.mac2" maxlength="2" @change="changeMac"/><view class="text-[#999] mx-5">:</view>
          <u-input v-model="pageData.mac3" maxlength="2" @change="changeMac"/><view class="text-[#999] mx-5">:</view>
          <u-input v-model="pageData.mac4" maxlength="2" @change="changeMac"/><view class="text-[#999] mx-5">:</view>
          <u-input v-model="pageData.mac5" maxlength="2" @change="changeMac"/><view class="text-[#999] mx-5">:</view>
          <u-input v-model="pageData.mac6" maxlength="2" @change="changeMac"/>
        </view>
      </view>
      <view>
        <view class="flex mt-10">
          <view>
            <button class="w-150 h-40 leading-40 rounded-full bg-[#f8cf01] active:bg-[#f0c801] text-[#333333]" v-if="pageData.connectState == 2" :disabled="true">蓝牙已连接</button>
            <button class="w-150 h-40 leading-40 rounded-full bg-[#f8cf01] active:bg-[#f0c801] text-[#333333]" v-else @click="onUnlockClick">蓝牙未连接</button>
          </view>
          <button class="w-150 h-40 leading-40 rounded-full bg-[#f8cf01] active:bg-[#f0c801] text-[#333333]" @click="changeLock(2)" :disabled="pageData.connectState != 2">上锁</button>
        </view>
        <view class="flex mt-10">
          <view><button class="w-150 h-40 leading-40 rounded-full bg-[#f8cf01] active:bg-[#f0c801] text-[#333333]" @click="changeLock(1)" :disabled="pageData.connectState != 2">解锁</button></view>
          <button class="w-150 h-40 leading-40 rounded-full bg-[#f8cf01] active:bg-[#f0c801] text-[#333333]" @click="changeLock(0)" :disabled="pageData.connectState != 2">查询</button>
        </view>
      </view>
      <view class="border-1 border-[#eee] border-solid mt-10 rounded-4 p-10">
        <view>日志：</view>
        <view>
          {{pageData.connectStateLog}}
        </view>
      </view>
    </view>
    <view v-if="pageData.connectState==3" class="relative z-[1] bg-[#fff] mx-13 mt-13 px-15 py-25 rounded-10 shadow-[1rpx_2rpx_18rpx_2rpx_rgba(164,164,164,0.61)] text-[#000] leading-25">
      <view>APP与车机未建立连接，请检查以下内容</view>
      <view class="mt-20">1、确保您已打开手机蓝牙服务 </view>
      <view>2、确保您已打开车辆电源或手动轻摇晃车辆 </view>
      <view>3、确保您手机与车辆距离&gl;=1米;并点击“<text class="text-[#fd2d2d]">刷新设备</text>”按钮重新尝试连接</view>
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
  </view>
</template>

<script setup>
import {reactive} from 'vue'
import { configStaticPath } from '@/config/index'
import {encodeBlekey,encodeBlekeyAb,decodeBlekey,decodeBlekeyAb,ab2hex,hex2ab,ab2str,str2ab,decimal2hex,hex2decimal} from '@/utils/crypto'
import {abcrc16} from '@/utils/crc16'
import useGetSettingStore from '@/store/modules/getSetting'
import {onLoad, onUnload} from '@dcloudio/uni-app'
const pageData = reactive({
  mac1:'60',
  mac2:'E7',
  mac3:'10',
  mac4:'0A',
  mac5:'38',
  mac6:'31',

  mac:'',

  geo_x:0, //当前开锁经纬度
  geo_y:0,

  isLocked:false,
  type:0, //0查询 1解锁 2上锁
  types:['查询','解锁','上锁'],
  isLockLoading:true,

  connectState:0,//0未连接 1连接中 2已连接 3连接失败
  connectStateLog:'',
  connectTimer:null,

  dialogTitle:'',
  dialogCallback:()=>{},
  isDialogShow:false,
  isDialogIconSuccess:false,
})

onUnload(()=>{
  clearTimeout(pageData.connectTimer)
})

const changeMac = ()=>{
  pageData.connectState = 0
  pageData.connectStateLog = ''
  closeBluetoothAdapter()
}

//距离获取
const getGeoLocationPromise = () => {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type:'gcj02',
      success: function (res) {
        pageData.geo_x = res.longitude;
        pageData.geo_y = res.latitude;

        // getAddress(pageData.geo_x,pageData.geo_y).then(res=>{
        //   pageData.geo_address = res
        //   resolve()
        // }).catch(res=>{
        //   pageData.geo_address = '未知位置'
        //   console.log('getAddress error:',res)
        resolve()
        // })
      },
      fail: function(err) {
        console.log('getGeoLocationPromise error:',err)
        reject()
      }
    })
  })
}

const changeLock = (type)=>{
  //pageData.connectState = 1
  writeBLECharacteristicValue(type)
}

const getCrytoKey = ()=>{
  let mac = pageData.mac + ''
  mac = mac.replaceAll(':','')
  return mac + mac
}

const bleConnect = ()=>{
  console.log('bleConnect')
  //连接蓝牙开锁
  pageData.connectState = 1
  clearTimeout(pageData.connectTimer)
  pageData.connectTimer = setTimeout(()=>{
    if (pageData.connectState == 1) {
      pageData.connectState = 3
      pageData.connectStateLog = ''
      //closeBluetoothAdapter(false)
    }
  },30000)
  closeBluetoothAdapter().finally(()=>{
    openBluetoothAdapter()
  })
}

const getSetting = (scope, name, callback)=> {
  let getSettingStore = useGetSettingStore().getGetSetting()
  console.log('Object.keys(getSettingStore)',Object.keys(getSettingStore),getSettingStore)
  if (Object.keys(getSettingStore).includes(scope)) {
    if (getSettingStore[scope]) {
      callback && callback()
    }
    else {
      pageData.dialogTitle = '需要您授权'+ name + '权限'
      pageData.isDialogIconSuccess = false
      pageData.dialogCallback = ()=>{
        wx.openSetting({
          success(ret) {
            if (ret.authSetting[scope]) {
              let obj = {}
              obj[scope] = true
              useGetSettingStore().setGetSetting(obj)
              callback && callback()
            }
            else {
              let obj = {}
              obj[scope] = false
              useGetSettingStore().setGetSetting(obj)
            }
          }
        })
      }
      pageData.isDialogShow = true
    }
  }
  else {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting[scope]) {
          let obj = {}
          obj[scope] = true
          useGetSettingStore().setGetSetting(obj)
          callback && callback()
        } else {
          let obj = {}
          obj[scope] = false
          useGetSettingStore().setGetSetting(obj)
          wx.authorize({
            scope: scope,
            success(res) {
              let obj = {}
              obj[scope] = true
              useGetSettingStore().setGetSetting(obj)
              callback && callback()
            },
            fail(err) {
              let obj = {}
              obj[scope] = false
              useGetSettingStore().setGetSetting(obj)

              pageData.dialogTitle = '需要您授权'+ name + '权限'
              pageData.isDialogIconSuccess = false
              pageData.dialogCallback = ()=>{
                wx.openSetting({
                  success(ret) {
                    if (ret.authSetting[scope]) {
                      let obj = {}
                      obj[scope] = true
                      useGetSettingStore().setGetSetting(obj)
                      callback && callback()
                    }
                    else {
                      let obj = {}
                      obj[scope] = false
                      useGetSettingStore().setGetSetting(obj)
                    }
                  }
                })
              }
              pageData.isDialogShow = true
            }
          });
        }
      },
      fail(err) {
        console.log(err);
      }
    })
  }
}

const onUnlockClick = ()=>{
  // let callback = ()=>{
  //   let callback = ()=>{
  //     console.log('callback')
  //     onUnlock()
  //   }
  //   getSetting('scope.bluetooth','蓝牙',callback)
  // }
  // getSetting('scope.userLocation','个人位置信息',callback)
  pageData.mac = (pageData.mac1 + ':' + pageData.mac2 + ':' + pageData.mac3 + ':' + pageData.mac4 + ':' + pageData.mac5 + ':' + pageData.mac6).toUpperCase()
  if (pageData.mac.length != 17) {
    pageData.connectStateLog = 'mac地址输入有误，请重新输入！'
    pageData.dialogTitle = 'mac地址输入有误，请重新输入！'
    pageData.isDialogIconSuccess = false
    pageData.dialogCallback = ()=>{}
    pageData.isDialogShow = true
    return false
  }

  let callback = ()=>{
    console.log('callback')
    onUnlock()
  }
  getSetting('scope.bluetooth','蓝牙',callback)
}

const onUnlock = async()=>{
  console.log('onUnlock')
  if (pageData.connectState == 1) {
    return false
  }
  pageData.connectState = 1
  pageData.connectStateLog = '准备连接'

  bleConnect()

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
        pageData.connectStateLog = '当前蓝牙适配器不可用，请打开微信蓝牙权限和手机蓝牙功能！'

        pageData.dialogTitle = '当前蓝牙适配器不可用，请打开微信蓝牙权限和手机蓝牙功能！'
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
        pageData.connectStateLog = '当前蓝牙打开失败，请重试！' + res.errno + res.errMsg

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
      if (res.available) {
        onBluetoothDeviceFound()
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
      let advertisDataStr = ab2str(device.advertisData)
      if (advertisDataStr.indexOf('CG-RT') != -1 /*&& advertisDataStr.indexOf(pageData.sharedData.mac) != -1*/) {
        pageData.connectStateLog = '找到设备'
        stopBluetoothDevicesDiscovery()
        createBLEConnection(device)
      }
      //}
    })
  })
}

const createBLEConnection = (row)=> {
  const deviceId = row.deviceId
  const name = row.name || row.localName
  wx.createBLEConnection({
    deviceId,
    success: (res) => {
      pageData.connectState = 1
      pageData.connectStateLog = '获取状态'

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
  //#define kBLE_TBOXServiceUUID                    @"00002760-08c2-11e1-9073-0e8ac72e1001"          //蓝牙TBOX服务的UUID
  //#define kBLE_TBOXWriteCharacteristicUUID        @"00002760-08c2-11e1-9073-0e8ac72e0001"          //蓝牙TBOX写入特征的UUID
  //#define kBLE_TBOXNotifyCharacteristicUUID       @"00002760-08c2-11e1-9073-0e8ac72e0002"          //蓝牙TBOX通知特征的UUID
  wx.getBLEDeviceServices({
    deviceId,
    success: (res) => {
      console.log('getBLEDeviceServices:',res.services)
      for (let i = 0; i < res.services.length; i++) {
        if (res.services[i].isPrimary && (res.services[i].uuid+'').toLowerCase() == '00002760-08c2-11e1-9073-0e8ac72e1001') {
          getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
          break
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
      let isWrite = false

      // 操作之前先监听，保证第一时间获取数据
      wx.onBLECharacteristicValueChange((characteristic) => {
        console.log('wx.onBLECharacteristicValueChange',characteristic)
        let nofityDataHex = ab2hex(characteristic.value)
        console.log('读取原始数据：',nofityDataHex)
        let successHex = nofityDataHex.substr(24,4)
        if (successHex == '1000') { //上锁解锁失败
          pageData.connectState = 2
          pageData.connectStateLog = '执行'+pageData.types[pageData.type]+'失败！'
          pageData.isLockLoading = false

          pageData.dialogTitle = '执行'+pageData.types[pageData.type]+'失败！'
          pageData.isDialogIconSuccess = true
          pageData.dialogCallback = ()=>{}
          pageData.isDialogShow = true
        }
        else if(successHex == '1001') { //上锁解锁成功
          pageData.connectState = 2
          pageData.connectStateLog = pageData.types[pageData.type] + '成功！'
          pageData.isLockLoading = false

          pageData.dialogTitle = pageData.types[pageData.type] + '成功！'
          pageData.isDialogIconSuccess = true
          pageData.dialogCallback = ()=>{}
          pageData.isDialogShow = true
        }
        else if (successHex == '1003') { //查询未解锁
          pageData.connectState = 2
          pageData.connectStateLog = '查询结果成功未解锁！'
          pageData.isLocked = false
          pageData.isLockLoading = false

          pageData.dialogTitle = '查询结果成功未解锁！'
          pageData.isDialogIconSuccess = true
          pageData.dialogCallback = ()=>{}
          pageData.isDialogShow = true
        }
        else if (successHex == '1002') { //查询已解锁
          pageData.connectState = 2
          pageData.connectStateLog = '查询结果成功已解锁！'
          pageData.isLocked = true
          pageData.isLockLoading = false

          pageData.dialogTitle = '查询结果成功已解锁！'
          pageData.isDialogIconSuccess = true
          pageData.dialogCallback = ()=>{}
          pageData.isDialogShow = true
        }

        // let lenhexbig = nofityDataHex.substr(22,2) + nofityDataHex.substr(20,2)
        // let lenhexbig_decimal = hex2decimal(lenhexbig)
        // let notifySourceData = nofityDataHex.substr(24,lenhexbig_decimal*2)
        // console.log('加密前数据',notifySourceData)
        // console.log('加密key',getCrytoKey())
        // let jmtext = encodeBlekey(ab2str(hex2ab(notifySourceData)),getCrytoKey())
        // //let encryptedStr = ab2hex(uni.base64ToArrayBuffer(jmtext))
        // //sendBlekeyOpenResult({code:isSuccess ? 1 : 0,encryptedStr:encryptedStr})

        //开锁完成之后10秒钟再断开
        // setTimeout(()=>{
        //   closeBluetoothAdapter(true)
        // },10000)

      })

      for (let i = 0; i < items.length; i++) {
        let item = items[i]

        if ((item.properties.notify || item.properties.indicate) && (item.uuid + '').toLowerCase() == '00002760-08c2-11e1-9073-0e8ac72e0002') {
          console.log('wx.notifyBLECharacteristicValueChange success',item)
          wx.notifyBLECharacteristicValueChange({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
            state: true,
            success: (res) => {
              console.log('wx.notifyBLECharacteristicValueChange success',res);
            },
            fail: function (res) {
              console.log('wx.notifyBLECharacteristicValueChange fail',res);
            },
          })
        }
      }

      for (let i = 0; i < items.length; i++) {
        let item = items[i]
        if (item.properties.write && (item.uuid + '').toLowerCase() == '00002760-08c2-11e1-9073-0e8ac72e0001') {
          pageData.canWrite = true

          pageData._deviceId = deviceId
          pageData._serviceId = serviceId
          pageData._characteristicId = item.uuid

          pageData.connectStateLog = '蓝牙连接成功'
          pageData.connectState = 2
          //writeBLECharacteristicValue(0)
          isWrite = true
          break;
        }
      }
      if (!isWrite) {
        // pageData.connectState = 0
        // pageData.connectStateLog = ''

        pageData.dialogTitle = '连接设备不能写入数据,请重试！'
        pageData.isDialogIconSuccess = false
        pageData.dialogCallback = ()=>{}
        pageData.isDialogShow = true

        //closeBluetoothAdapter(true)
      }
    },
    fail(res) {
      console.error('getBLEDeviceCharacteristics', res)

      if (pageData.connectState != 3) {
        pageData.connectStateLog = '连接设备不能写入数据,请重试！'

        pageData.dialogTitle = '连接设备不能写入数据,请重试！'
        pageData.isDialogIconSuccess = false
        pageData.dialogCallback = ()=>{}
        pageData.isDialogShow = true
      }

      // pageData.connectState = 0
      // pageData.connectStateLog = ''

      //closeBluetoothAdapter(true)
    }
  })
}

/**
 *
 * @param type 0 查询 1解锁 2上锁
 */
const writeBLECharacteristicValue = (type)=> {
  pageData.type = type
  pageData.isLockLoading = true
  let sourceType = '02'
  if (type == 1) {
    sourceType = '10'
  }
  else if (type == 2) {
    sourceType = '11'
  }

  let sourceHex1 = '1a1a01' + sourceType
  let validDecimal = hex2decimal(sourceHex1.substr(0,2))^hex2decimal(sourceHex1.substr(2,2))^hex2decimal(sourceHex1.substr(4,2))^hex2decimal(sourceHex1.substr(6,2))
  let hexLength1 = decimal2hex(validDecimal)
  if (hexLength1.length == 1) {
    hexLength1 = '0' + hexLength1
  }
  sourceHex1 = sourceHex1 + hexLength1 + 'ff'

  let hexLength = decimal2hex((sourceHex1.length/2) % 256)
  if (hexLength.length == 1) {
    hexLength = '0' + hexLength
  }

  let sourceHex = '50'+pageData.mac.replaceAll(':','').toLowerCase()+'303601'+hexLength+'00'+sourceHex1
  sourceHex = sourceHex + abcrc16(hex2ab(sourceHex)).toLowerCase()

  wx.writeBLECharacteristicValue({
    deviceId: pageData._deviceId,
    serviceId: pageData._serviceId,
    characteristicId: pageData._characteristicId,
    value: hex2ab(sourceHex),
    success (res) {
      console.log('向蓝牙写入数据：',pageData._deviceId,pageData._characteristicId,sourceHex)
      console.log('wx.writeBLECharacteristicValue success', res)
    },
    fail (res) {
      console.log('wx.writeBLECharacteristicValue fail', res)
      console.log('deviceId',pageData._deviceId)
      console.log('serviceId',pageData._serviceId)
      console.log('characteristicId',pageData._characteristicId)
      console.log('向蓝牙写入数据：',pageData._deviceId,pageData._characteristicId,sourceHex)

      pageData.connectStateLog = '连接设备写入数据失败,请重试！'

      pageData.dialogTitle = '连接设备写入数据失败,请重试！'
      pageData.isDialogIconSuccess = false
      pageData.dialogCallback = ()=>{}
      pageData.isDialogShow = true

      pageData.isLockLoading = false
      //closeBluetoothAdapter(true)
    }
  })
}

const closeBluetoothAdapter = (isChangeConnectState)=> {
  return new Promise((resolve, reject)=>{
    stopBluetoothDevicesDiscovery()
    wx.offBLECharacteristicValueChange()
    wx.offBLEConnectionStateChange()

    wx.closeBLEConnection({
      deviceId:pageData._deviceId,
      success (res) {
      },
      fail (res) {
        reject()
      },
      complete (res) {
        wx.closeBluetoothAdapter()

        pageData.needUnlock = false
        pageData._discoveryStarted = false
        // if (isChangeConnectState) {
        //   pageData.connectState = 0
        // }
        pageData.connectStateLog = ''

        resolve()
      }
    })
  })
}
</script>

<style lang="scss" scoped>

</style>