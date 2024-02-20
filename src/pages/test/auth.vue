<template>
  <div>test auth</div>
  <button @click="onBule">授权蓝牙</button>
</template>

<script setup>
import {onLoad} from "@dcloudio/uni-app"

let setting = {}

onLoad((option)=>{
  uni.getSetting({
    success:function(res) {
      setting = res
      console.log('getSetting:',res)
      uni.showToast({title: 'success',icon:'none'});
    },
    fail:function(e) {
      console.log('getSetting error:',e)
      uni.showToast({title: 'fail',icon:'none'});
    }
  })
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
</script>

<style scoped>

</style>