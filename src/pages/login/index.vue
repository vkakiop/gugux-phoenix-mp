<template>
  <view class="m-30">
    <view class="text-right h-30 leading-30">
      <navigator url="/pages/index/index" open-type="switchTab">跳过</navigator>
    </view>
    <phoneslogan></phoneslogan>
    <view class="mt-45">
      <view class="h-48 bg-[#e9ebef] rounded-full flex items-center relative">
        <input class="w-3/5 ml-30 h-48" v-model="pageData.phone" placeholder="请输入手机号码" maxlength="11"/>
        <view class="w-80 h-22 leading-22 absolute right-15 top-11">
          <button v-if="!pageData.isReget" @click="getCode" class=" text-10 rounded-full bg-[#4ba1f8] active:bg-[#3194f9] text-white">
            获取验证码
          </button>
          <button v-else class="text-10 rounded-full bg-[#f4f5f6] text-black">重发({{pageData.count}})</button>
        </view>

      </view>
      <view class="h-48 bg-[#e9ebef] rounded-full flex justify-center items-center mt-10 relative">
        <input class="w-4/5 h-48" v-model="pageData.code" placeholder="请输入验证码" maxlength="6"/>
        <!--image v-if="pageData.code" class="w-18 h-18 absolute right-15 top-14" src="@/static/login/eye.png" @click="pageData.code = '';"></image-->
      </view>
      <button :class="['mt-25','h-48','leading-48','rounded-full','bg-[#4ba1f8]',pageData.code.length < 6 ? '' : 'active:bg-[#3194f9]',pageData.code.length < 6 ? 'text-[#ddd]' : 'text-white']" @click="onLogin">登录</button>
      <!--view class="mt-18 text-center" @click="gotoLoginPhone">验证码登录</view-->
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
            <button class="w-115 h-40 leading-40 rounded-full bg-[#f4f5f6] active:bg-[#eeeff0] text-black" :style="{border:'none'}" @click="pageData.isDialogShow=false">不同意</button>
            <button class="w-115 h-40 leading-40 rounded-full bg-[#4ba1f8] active:bg-[#3194f9] text-white" :style="{border:'none'}" @click="pageData.isDialogShow=false;pageData.isAgreeItems=[''];onLogin();">我同意</button>
          </view>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script setup>
import {reactive,watch,onMounted} from 'vue'
import {tokenSave} from '@/utils/login'
import {authSms,authSmsLogin} from '@/api/login/index'
import phoneslogan from './components/phoneslogan.vue'
import {onLoad} from "@dcloudio/uni-app"

onLoad((option)=>{
  pageData.url = decodeURIComponent(option.url || '')
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
})

watch(()=>pageData.count,(newVal,oldVal)=>{
  if(newVal==0){
    pageData.isReget = false
    clearInterval(pageData.timer)
  }
})

const onLogin = ()=>{
  if (pageData.code.length >= 6) {
    if (vaildPhone()) {
      if (pageData.isAgreeItems.length == 0) {
        pageData.isDialogShow=true
      }
      else {
        authSmsLogin({phone:pageData.phone,code:pageData.code}).then(res=>{
          tokenSave(res,pageData.url)
        })
      }
    }
  }
}

//获取验证码
const getCode = ()=>{
  authSms({phone:pageData.phone,type:1}).then(res=>{
    pageData.count = 60
    pageData.isReget = true
    getTimer()
  })
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
      title: '请输入正确的手机号',
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

// const gotoLoginPhone = ()=>{
//   uni.reLaunch({url:'/pages/login/phone?url='+encodeURIComponent(pageData.url)})
// }
</script>

<style lang="scss" scoped>

</style>
