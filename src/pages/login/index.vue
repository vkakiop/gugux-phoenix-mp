<template>
  <customNav>
    <view @click="gotoBack" class="pl-10 mt-[3rpx]"><uni-icons type="back" size="24"></uni-icons></view>
    <view class="name mx-6 text-18 line-clamp-1">手机登录</view>
  </customNav>
  <view class="m-30">
    <view class="text-right h-30 leading-30">
      <!--navigator url="/pages/index/index" open-type="switchTab">跳过</navigator-->
    </view>
    <phoneslogan></phoneslogan>
    <view>
      <view chass="h-45"></view>
      <view class="mb-10 text-16 text-[#777]">未注册手机验证后完成注册</view>
      <view class="h-48 bg-[#e9ebef] rounded-full flex items-center relative">
        <view class="ml-10 h-48 leading-48 text-[#777]">+86</view>
        <input class="w-3/5 ml-10 h-48" v-model="pageData.phone" placeholder="请输入手机号码" maxlength="11"/>
        <view class="w-90 h-22 leading-22 absolute right-15 top-11">
          <debounce v-if="!pageData.isReget" @debounce="getCode">
            <button class=" text-10 rounded-full bg-[#333333] active:bg-[#2c2c2c] text-[#f8cf01]">
              获取验证码
            </button>
          </debounce>
          <button v-else class="text-10 rounded-full bg-[#f4f5f6] text-black">{{pageData.count}}秒后重发</button>
        </view>

      </view>
      <view class="h-48 bg-[#e9ebef] rounded-full flex justify-center items-center mt-10 relative">
        <input class="w-4/5 h-48 ml-40" v-model="pageData.code" placeholder="请输入验证码" maxlength="6"/>
        <!--image v-if="pageData.code" class="w-18 h-18 absolute right-15 top-14" src="@/static/login/eye.png" @click="pageData.code = '';"></image-->
      </view>
      <button @click="onLogin" :class="['mt-25','h-48','leading-48','rounded-full','bg-[#f8cf01]',pageData.code.length < 6 ? '' : 'active:bg-[#f0c801]',pageData.code.length < 6 ? 'text-[#666666]' : 'text-[#333333]']" :disabled="pageData.isLoading">登录</button>
      <!--view class="mt-18 text-center" @click="gotoLoginPhone">验证码登录</view-->
      <view class="mt-58 text-13 flex items-center">
        <u-checkbox-group v-model="pageData.isAgreeItems">
          <u-checkbox shape="circle" activeColor="#f8cf01" label="" iconColor="#333333" iconSize="15" size="22"></u-checkbox>
        </u-checkbox-group>
        <view>
          我已阅读并同意<text class="text-[#f0c801]" @click="gotoAgreement('/pages/agreement/index?code=yonghufuwuxieyi&title=用户服务协议')">《用户服务协议》</text>及<text class="text-[#f0c801]" @click="gotoAgreement('/pages/agreement/index?code=yonghufuwuxieyi&title=隐私政策')">《隐私政策》</text>
        </view>
      </view>
      <!--u-popup :show="pageData.isDialogShow" mode="center" round="10" :customStyle="{marginLeft:'60rpx',marginRight:'60rpx'}">
        <view class="m-22">
          <view class="text-center font-bold">同意隐私条款</view>
          <view class="my-28">登录注册需要您阅读并同意我们的<text class="text-[#f0c801]" @click="gotoAgreement('/pages/agreement/index?code=yonghufuwuxieyi&title=用户服务协议')">《用户服务协议》</text>及<text class="text-[#f0c801]" @click="gotoAgreement('/pages/agreement/index?code=yonghufuwuxieyi&title=隐私政策')">《隐私政策》</text>
          </view>
          <view class="flex justify-center items-center">
            <button class="w-115 h-40 leading-40 rounded-full " @click="pageData.isDialogShow=false">不同意</button>
            <button class="w-115 h-40 leading-40 rounded-full bg-[#f8cf01] active:bg-[#f0c801] text-[#333333]" @click="pageData.isDialogShow=false;pageData.isAgreeItems=[''];onLogin();">我同意</button>
          </view>
        </view>
      </u-popup-->
    </view>
  </view>
  <ws-wx-privacy id="privacy-popup"></ws-wx-privacy>
</template>

<script setup>
import {reactive,watch,onMounted} from 'vue'
import {tokenSave,isSwitchTab,loginout} from '@/utils/login'
import { privacyAuth } from "@/utils/utils"
import {authSms,authSmsLogin,authSmsLoginApp} from '@/api/login/index'
import phoneslogan from './components/phoneslogan.vue'
import {onLoad} from "@dcloudio/uni-app"

onLoad((option)=>{
  privacyAuth()
  pageData.url = decodeURIComponent(option.url || '')

  if (option.isShowReLoginMsg) {
    loginout()
    uni.showToast({
      title: '登录已过期，请重新登录！',
      icon:'none',
      duration: 2000
    });
  }
})

const pageData = reactive({
  url:'',
  phone:'',
  code:'',
  isDialogShow:false,
  isAgreeItems:[],
  timer:null,
  count:60,
  isReget: false,  // 判断是否显示 ‘重新获取’按钮
  isGetCode:false, // 是否获取过验证码
  jsCode:'',
  isLoading:false,
})

watch(()=>pageData.count,(newVal,oldVal)=>{
  if(newVal==0){
    pageData.isReget = false
    clearInterval(pageData.timer)
  }
})

const onLogin = ()=>{
  if (pageData.code.length >= 6) {
    if (!pageData.isGetCode) {
      uni.showToast({title: '请您先获取验证码',icon:'none',duration: 2000})
    }
    else if (vaildPhone()) {
      if (pageData.isAgreeItems.length == 0) {
        pageData.isDialogShow=true
        uni.showToast({title: '请勾选同意隐私条款',icon:'none',duration: 2000})
      }
      else {
        pageData.isLoading = true
        uni.login({
          provider: 'weixin', //使用微信登录
          success: function (res) {
            if (res.code) {
              pageData.jsCode = res.code
              authSmsLogin({phone:pageData.phone,code:pageData.code,jsCode:pageData.jsCode}).then(res=>{
                tokenSave(res,pageData.url)
                pageData.isLoading = false
              }).catch(err=>{
                pageData.isLoading = false
              })
            }
            else {
              let title = '登录错误：'+res.errMsg
              uni.showToast({title:title,icon: 'none', duration: 2000})
              pageData.isLoading = false
            }
            console.log('wxLogin',res)
          },
          fail : function(res) {
            uni.showToast({title:'登录错误：'+res.detail.code,icon: 'none', duration: 2000})
            pageData.isLoading = false
          },
        });
      }
    }
  }
}

//获取验证码
const getCode = ()=>{
  if (pageData.isAgreeItems.length == 0) {
    pageData.isDialogShow=true
    uni.showToast({title: '请勾选同意隐私条款',icon:'none',duration: 2000})
  }
  else if (vaildPhone()) {
    authSms({phone:pageData.phone,type:1}).then(res=>{
      pageData.count = 60
      pageData.isReget = true
      pageData.isGetCode = true
      getTimer()
    })
  }
}

const getTimer = ()=>{
  pageData.timer = setInterval(()=>{
    if(pageData.count==0){
      clearInterval(pageData.timer)
      //uni.navigateBack({delta: 1})
      return
    }
    pageData.count--
  }, 1000)
}

const vaildPhone = ()=>{
  let reg =  /^1[0-9]{10}$/;
  if(pageData.phone == ''){
    uni.showToast({title: '请输入手机号',icon:'none',duration: 2000
    });
    return false
  }
  if(reg.test(pageData.phone)){
    return true
  }
  else{
    uni.showToast({title: '请输入正确的手机号',icon:'none',duration: 2000
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

// const gotoLoginPhone = ()=>{
//   uni.reLaunch({url:'/pages/login/phone?url='+encodeURIComponent(pageData.url)})
// }

const gotoBack = ()=>{
  if (isSwitchTab(pageData.url)) {
    uni.switchTab({url:'/pages/index/index'})
  }
  else {
    if (getCurrentPages().length>1) {
      uni.navigateBack({delta: 1})
    }
    else {
      uni.switchTab({url:'/pages/index/index'})
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
