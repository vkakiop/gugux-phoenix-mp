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
import useGetSettingStore from '@/store/modules/getSetting'

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

const getSetting = (scope, name, callback)=> {
  let getSettingStore = useGetSettingStore().getGetSetting()
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


              wx.showModal({
                title: '提示',
                content: '需要您授权' + name + '权限',
                success: (res) => {
                  if (res.confirm) {
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
    }
  });
}
</script>

<style scoped>

</style>