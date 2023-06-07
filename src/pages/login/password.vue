<template>
  <view class="m-30">
    <view class="text-right h-30"></view>
    <phoneslogan></phoneslogan>
    <view class="mt-45">
      <view class="h-48 bg-[#e9ebef] rounded-full flex justify-center items-center relative">
        <input class="w-4/5" v-model="pageData.phone" placeholder="请输入手机号码" maxlength="11"/>
        <image v-if="pageData.phone" class="w-18 h-18 absolute right-15 top-14" src="@/static/login/clear.png" @click="pageData.phone = '';"></image>
      </view>
      <view class="h-48 bg-[#e9ebef] rounded-full flex justify-center items-center mt-10 relative">
        <input class="w-4/5" v-model="pageData.password" placeholder="请输入密码" maxlength="32"/>
        <image v-if="pageData.password" class="w-18 h-18 absolute right-15 top-14" src="@/static/login/eye.png" @click="pageData.password = '';"></image>
      </view>
      <button :class="['mt-25','h-48','leading-48','rounded-full','bg-[#4ba1f8]',pageData.password.length < 6 ? '' : 'active:bg-[#3194f9]',pageData.password.length < 6 ? 'text-[#ddd]' : 'text-white']" @click="onLogin">登录</button>

      <view class="mt-18 text-center" @click="gotoLoginPhone">验证码登录</view>

    </view>
  </view>
</template>

<script setup>
import {reactive,watch,onMounted} from 'vue'
import {authPwdLogin} from '@/api/login/index'
import {tokenSave} from '@/utils/login'
import phoneslogan from './components/phoneslogan.vue'
import {onLoad} from "@dcloudio/uni-app"

onLoad((option)=>{
  pageData.url = decodeURIComponent(option.url || '')
})

const pageData = reactive({
  url:'',
  phone:'',
  password:''
})
const onLogin = ()=>{
  if (pageData.password.length >= 6) {
    if (vaildPhone()) {
      authPwdLogin({phone:pageData.phone,password:pageData.password}).then(res=>{
        tokenSave(res,pageData.url)
      })
    }
  }
}

const vaildPhone = ()=>{
  let reg =  /^1[3456789]\d{9}$/;
  if(pageData.phone == ''){
    uni.showToast({
      title: '请输入手机号',
      icon:'none',
      duration: 2000
    });
    return false
  }
  if(reg.test(pageData.phone)){
    return true
  }
  else{
    uni.showToast({
      title: '请输入正确的手机号'+pageData.phone,
      icon:'none',
      duration: 2000
    });
    return false
  }
}

const gotoLoginPhone = ()=>{
  uni.reLaunch({url:'/pages/login/phone?url='+encodeURIComponent(pageData.url)})
}
</script>

<style lang="scss" scoped>

</style>
