<template>
  <button @click="openBluetoothAdapter">开始扫描</button>
  <button @click="stopBluetoothDevicesDiscovery">停止扫描</button>
  <button @click="closeBluetoothAdapter">结束流程</button>

  <view class="devices_summary">已发现 {{pageData.devices.length}} 个外围设备：</view>
  <scroll-view class="device_list" scroll-y scroll-with-animation>
    <view v-for="item in pageData.devices"
          data-device-id="item.deviceId"
          data-name="{{item.name || item.localName}}"
          @click="createBLEConnection(item)"
          class="device_item"
          hover-class="device_item_hover">
      <view style="font-size: 16px; color: #333;">{{item.name}}</view>
      <view style="font-size: 10px">信号强度: {{item.RSSI}}dBm ({{utils_max(0, item.RSSI + 100)}}%)</view>
      <view style="font-size: 10px">UUID: {{item.deviceId}}</view>
      <view style="font-size: 10px">Service数量: {{utils_len(item.advertisServiceUUIDs)}}</view>
    </view>
  </scroll-view>

  <view class="connected_info" v-if="pageData.connected">
    <view>
      <text>已连接到 {{name}}</text>
      <view class="operation">
        <button v-if="pageData.canWrite" size="mini" @click="writeBLECharacteristicValue">写数据</button>
        <button size="mini" @click="closeBLEConnection">断开连接</button>
      </view>
    </view>
    <view v-for="item in pageData.chs" style="font-size: 12px; margin-top: 10px;">
      <view>特性UUID: {{item.uuid}}</view>
      <view>特性值: {{item.value}}</view>
    </view>
  </view>
</template>

<script setup>
import {reactive} from 'vue'
const pageData = reactive({
  devices: [],
  connected: false,
  chs: [],

  _discoveryStarted:false,
  _deviceId:'',
})

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
}

const closeBluetoothAdapter = ()=> {
  wx.closeBluetoothAdapter()
  pageData._discoveryStarted = false
}
</script>

<style lang="scss" scoped>
view {
  color: #333;
}
.devices_summary {
  margin-top: 30px;
  padding: 10px;
  font-size: 16px;
}
.device_list {
  height: 300px;
  margin: 50px 5px;
  margin-top: 0;
  border: 1px solid #EEE;
  border-radius: 5px;
  width: auto;
}
.device_item {
  border-bottom: 1px solid #EEE;
  padding: 10px;
  color: #666;
}
.device_item_hover {
  background-color: rgba(0, 0, 0, .1);
}
.connected_info {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #F0F0F0;
  padding: 10px;
  padding-bottom: 20px;
  margin-bottom: env(safe-area-inset-bottom);
  font-size: 14px;
  min-height: 100px;
  box-shadow: 0px 0px 3px 0px;
}
.connected_info .operation {
  position: absolute;
  display: inline-block;
  right: 30px;
}
</style>