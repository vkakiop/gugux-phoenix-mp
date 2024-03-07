<template>
  <view class="m-30">
    <view class="text-right h-30"></view>
    <phoneslogan></phoneslogan>
    <view class="mt-45">
      <view class="h-48 bg-[#e9ebef] rounded-full flex justify-center items-center relative">
        <input class="w-4/5" v-model="pageData.phone" placeholder="请输入手机号码" maxlength="11"/>
        <image v-if="pageData.phone" class="w-18 h-18 absolute right-15 top-14" :src="configStaticPath('/static/login/clear.png')" @click="pageData.phone = '';"></image>
      </view>
      <view class="h-48 bg-[#e9ebef] rounded-full flex justify-center items-center mt-10 relative">
        <input class="w-4/5" v-model="pageData.password" placeholder="请输入密码" maxlength="32"/>
        <image v-if="pageData.password" class="w-18 h-18 absolute right-15 top-14" :src="configStaticPath('/static/login/eye.png')" @click="pageData.password = '';"></image>
      </view>
      <button :class="['mt-25','h-48','leading-48','rounded-full','bg-[#4ba1f8]',pageData.password.length < 6 ? '' : 'active:bg-[#3194f9]',pageData.password.length < 6 ? 'text-[#ddd]' : 'text-white']" @click="onLogin">登录</button>
      <view class="mt-18 text-center" @click="gotoLoginPhone">验证码登录</view>
      <view class="mt-58 text-13 flex items-center">
        <u-checkbox-group v-model="pageData.isAgreeItems">
          <u-checkbox shape="circle" activeColor="#4ba1f8" label=""></u-checkbox>
        </u-checkbox-group>
        <view>
          我已阅读并同意<text class="text-[#4ba1f8]" @click="gotoAgreement('/pages/agreement/index?code=yonghufuwuxieyi&title=用户服务协议')">《用户服务协议》</text>及<text class="text-[#4ba1f8]" @click="gotoAgreement('/pages/agreement/index?code=yonghufuwuxieyi&title=隐私政策')">《隐私政策》</text>
        </view>
      </view>
      <u-popup :show="pageData.isDialogShow" mode="center" round="10" :customStyle="{marginLeft:'60rpx',marginRight:'60rpx'}">
        <view class="m-22">
          <view class="text-center font-bold">同意隐私条款</view>
          <view class="my-28">登录注册需要您阅读并同意我们的<text class="text-[#4ba1f8]" @click="gotoAgreement('/pages/agreement/index?code=yonghufuwuxieyi&title=用户服务协议')">《用户服务协议》</text>及<text class="text-[#4ba1f8]" @click="gotoAgreement('/pages/agreement/index?code=yonghufuwuxieyi&title=隐私政策')">《隐私政策》</text>
          </view>
          <view class="flex justify-center items-center">
            <button class="w-115 h-40 leading-40 rounded-full bg-[#f4f5f6] active:bg-[#eeeff0] text-black" @click="pageData.isDialogShow=false">不同意</button>
            <button class="w-115 h-40 leading-40 rounded-full bg-[#4ba1f8] active:bg-[#3194f9] text-white" @click="pageData.isDialogShow=false;pageData.isAgreeItems=[''];onGetValidCode();">我同意</button>
          </view>
        </view>
      </u-popup>
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
  password:'',
  isDialogShow:false,
  isAgreeItems:[],
})
const onLogin = ()=>{
  if (pageData.password.length >= 6) {
    if (vaildPhone()) {
      if (pageData.isAgreeItems.length == 0) {
        pageData.isDialogShow=true
      }
      else {
        authPwdLogin({phone:pageData.phone,password:pageData.password}).then(res=>{
          tokenSave(res,pageData.url)
        })
      }
    }
  }
}

const vaildPhone = ()=>{
  let reg =  /^1[0-9]{10}$/;
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

const checkboxChange = (n) => {
  console.log('change', n);
}

const gotoAgreement = (url) =>{
  uni.navigateTo({url})
}

const gotoLoginPhone = ()=>{
  uni.reLaunch({url:'/pages/login/phone?url='+encodeURIComponent(pageData.url)})
}
</script>

<style lang="scss" scoped>

</style>
