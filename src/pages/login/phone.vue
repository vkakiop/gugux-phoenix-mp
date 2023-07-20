<template>
  <view class="m-30">
    <view class="text-right h-30 leading-30">
      <navigator url="/pages/index/index" open-type="switchTab">跳过</navigator>
    </view>
    <phoneslogan></phoneslogan>
    <view class="mt-50">
      <view class="mb-10">未注册手机验证后完成注册</view>
      <view class="h-48 bg-[#e9ebef] rounded-full flex justify-center items-center relative">
        <view class="mr-10 text-[#888]">+86</view>
        <input v-model="pageData.phone" placeholder="请输入手机号" maxlength="11"/>
        <image v-if="pageData.phone" class="w-18 h-18 absolute right-15 top-14" :src="configStaticPath('/static/login/clear.png')" @click="pageData.phone = '';"></image>
      </view>
      <view class="mt-18">
        <button class="mb-25 h-48 leading-48 rounded-full bg-[#4ba1f8] active:bg-[#3194f9] text-white" @click="onGetValidCode">获取验证码</button>
        <view class="text-center" @click="gotoLoginPassword">账号密码登录</view>
      </view>
    </view>
    <u-popup :show="pageData.isDialogShow" mode="center" round="10" :customStyle="{marginLeft:'60rpx',marginRight:'60rpx'}">
      <view class="m-22">
        <view class="text-center font-bold">同意隐私条款</view>
        <view class="my-28">登录注册需要您阅读并同意我们的<text class="text-[#4ba1f8]" @click="gotoAgreement('/pages/agreement/index?code=yonghufuwuxieyi&title=用户服务协议')">《用户服务协议》</text>及<text class="text-[#4ba1f8]" @click="gotoAgreement('/pages/agreement/index?code=yonghufuwuxieyi&title=隐私政策')">《隐私政策》</text>
        </view>
        <view class="flex justify-center items-center">
          <button class="w-115 h-40 leading-40 rounded-full bg-[#f4f5f6] active:bg-[#eeeff0] text-black" @click="pageData.isDialogShow=false">不同意</button>
          <button class="w-115 h-40 leading-40 rounded-full bg-[#4ba1f8] active:bg-[#3194f9] text-white" @click="pageData.isDialogShow=false;pageData.isAgree=true;onGetValidCode();">我同意</button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import {reactive} from 'vue'
import {authSms} from '@/api/login/index'
import {onLoad} from "@dcloudio/uni-app"
import phoneslogan from './components/phoneslogan.vue'
const pageData = reactive({
  url:'',
  phone:'',
  isDialogShow:false,
  isAgree:false, //同意协议
})

onLoad((option)=>{
  pageData.url = decodeURIComponent(option.url || '')
  console.log('return url:',pageData.url)
})

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

//获取验证码
const getCode = ()=>{
  pageData.isLoading = true
  authSms({phone:pageData.phone,type:1}).then(res=>{
    uni.navigateTo({url:'./phonecode?phone='+pageData.phone+'&url='+encodeURIComponent(pageData.url)})
  })
}

const onGetValidCode = ()=>{
  if (vaildPhone()) {
    if (!pageData.isAgree) {
      pageData.isDialogShow=true
    }
    else {
      getCode()
    }
  }
}

const gotoAgreement = (url) =>{
  uni.navigateTo({url})
}

const gotoLoginPassword = ()=>{
  uni.navigateTo({url:'/pages/login/password?url='+encodeURIComponent(pageData.url)})
}
</script>
