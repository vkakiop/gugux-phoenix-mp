<template>
  <div>
    <web-view src="http://192.168.0.99:81/#/blekey/mpindex" @load="webviewLoad" @error="webviewError"></web-view>
  </div>
</template>

<script setup>
import {onMounted,reactive} from 'vue'
const pageData = reactive({
  isWebView:true,
})

// const webviewPostMessage = (res)=>{
//   console.log('spToken',res)
//   uni.showToast({title: '已获取到验证码'+res.detail.data[0].spToken,icon:'none',duration: 2000})
//   uni.setStorageSync('spToken',res.detail.data[0].spToken)
// }

const webviewLoad = ()=>{
  // setTimeout(()=>{
  //   //uni.navigateTo({url:'/pages/blekey/index?isFirst=1'})
  //   uni.navigateBack({ delta: 1 })
  // },1000)
}

const webviewError = ()=>{
  uni.showToast({title: '获取一键登录页面加载失败',icon:'none',duration: 2000})
}
</script>

<style lang="scss" scoped>

</style>