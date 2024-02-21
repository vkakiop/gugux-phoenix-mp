<template>
  <div>test auth</div>
  <button @click="onBule">授权蓝牙</button>
  <button @click="onCopy" class="mt-10">复制测试</button>
  <!--ws-wx-privacy id="privacy-popup"></ws-wx-privacy-->

  <view v-if="pageData.showPrivacy">
    <view>隐私弹窗内容....</view>
    <button bindtap="handleOpenPrivacyContract">查看隐私协议</button>
    <button id="agree-btn" open-type="agreePrivacyAuthorization" @agreeprivacyauthorization="handleAgreePrivacyAuthorization">同意</button>
  </view>
</template>

<script setup>
import {onLoad} from "@dcloudio/uni-app"
import {reactive} from 'vue'

let setting = {}
const pageData = reactive({
  showPrivacy:false,
  resolvePrivacyAuthorization:null
})

onLoad((option)=>{
  wx.onNeedPrivacyAuthorization((resolve, eventInfo) => {
    console.log('触发本次事件的接口是：' + eventInfo.referrer)
    // 需要用户同意隐私授权时
    // 弹出开发者自定义的隐私授权弹窗
    pageData.showPrivacy = true
    pageData.resolvePrivacyAuthorization = resolve
  })

  onCopy()
})

const getSetting = (scope, title, callback)=> {
  wx.getSetting({
    success: (res) => {
      if (res.authSetting[scope]) {
        callback && callback()
      } else {
        wx.authorize({
          scope: scope,
          success(res) {
            callback && callback()
          },
          fail(err) {
            console.log('getSetting '+scope,err)
            wx.showModal({
              title: '提示',
              content: '需要您授权' + title,
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting({
                    success(ret) {
                      if (ret.authSetting[scope]) {
                        callback && callback()
                      }
                    }
                  })
                }
              },
              fail(err) {
              }
            })
          }
        });
      }
    },
    fail(err) {
      console.log(err);
    }
  })
}

const handleAgreePrivacyAuthorization = ()=> {
  uni.showToast({title: '已同意',icon:'none'});
  pageData.showPrivacy = false

  pageData.resolvePrivacyAuthorization({ buttonId: 'agree-btn', event: 'agree' })

  onCopy()
}

const onBule = async()=>{
    let callback = ()=>{
      uni.showToast({title: '已授权个人位置信息',icon:'none'});
      let callback = ()=>{
        uni.showToast({title: '已授权蓝牙',icon:'none'});
      }
      getSetting('scope.bluetooth','蓝牙',callback)
    }
    getSetting('scope.userLocation','个人位置信息',callback)
}


const onCopy = ()=>{
  onCopy2()
}
const onCopy2 = ()=>{
  // wx.requirePrivacyAuthorize({
  //   success: () => {
  //     // 用户同意授权
  //     // 继续小程序逻辑
  //   },
  //   fail: () => {}, // 用户拒绝授权
  //   complete: () => {}
  // })

  wx.setClipboardData({
    data: 'test', //要被复制的内容
    success: () => { //复制成功的回调函数
      uni.showToast({ //提示
        title: '复制成功1'
      })
    },
    fail: (e)=>{
      uni.showToast({ //提示
        title: '复制失败1'
      })
      console.log('setClipboardData fail:',e)
    },
    complete: (res)=>{
      uni.showToast({ //提示
        title: '复制完成1'
      })
      console.log('setClipboardData complete:',res)
    }
  });
}
</script>

<style scoped>

</style>