<template>
  <u-popup :show="isShow" mode="bottom" round="10" :customStyle="{marginLeft:'0rpx',marginRight:'0rpx'}" @close="close">
    <view class="mx-30 mt-20 mb-16">
      <view class="text-18 text-[#000000] text-center font-bold">登录或注册</view>
      <view class="mt-20 text-13 flex items-center">
        <u-checkbox-group v-if="isShowWxPhoneNumber" v-model="pageData.isAgreeItems">
          <u-checkbox shape="circle" activeColor="#4ba1f8" label="" iconSize="15" size="22"></u-checkbox>
        </u-checkbox-group>
        <view class="text-13 leading-22 text-[#333]">
          若手机号未注册将进入注册流程，注册即为同意<text class="text-[#f8cf01]" @click="gotoAgreement('/pages/agreement/index?code=yonghufuwuxieyi&title=用户服务协议')">《用户服务协议》</text>及<text class="text-[#f8cf01]" @click="gotoAgreement('/pages/agreement/index?code=yonghufuwuxieyi&title=隐私政策')">《隐私政策》</text>
        </view>
      </view>
      <view class="mt-20">
        <button v-if="isShowWxPhoneNumber" :open-type="pageData.isAgreeItems.length ? 'getPhoneNumber':''" @click="getPhoneNumberValid" @getphonenumber="getPhoneNumber" class="h-40 leading-40 rounded-full bg-[#51ab3a] active:bg-[#09b307] text-white text-14">微信一键登录</button>
        <button @click="gotoLogin" class="mt-15 h-40 leading-40 rounded-full bg-[#f8cf01] active:bg-[#f1c902] text-[#333333] text-14">手机号登录/注册</button>
      </view>
      <!--u-popup :show="pageData.isDialogShow" mode="center" round="10" :customStyle="{marginLeft:'60rpx',marginRight:'60rpx'}">
        <view class="m-22">
          <view class="text-center font-bold">同意隐私条款</view>
          <view class="my-28">登录注册需要您阅读并同意我们的<text class="text-[#4ba1f8]" @click="gotoAgreement('/pages/agreement/index?code=yonghufuwuxieyi&title=用户服务协议')">《用户服务协议》</text>及<text class="text-[#4ba1f8]" @click="gotoAgreement('/pages/agreement/index?code=yonghufuwuxieyi&title=隐私政策')">《隐私政策》</text>
          </view>
          <view class="flex justify-center items-center">
            <button class="w-115 h-40 leading-40 rounded-full text-black" @click="pageData.isDialogShow=false">不同意</button>
            <button class="w-115 h-40 leading-40 rounded-full bg-[#4ba1f8] active:bg-[#3194f9] text-white" @click="pageData.isDialogShow=false;pageData.isAgreeItems=[''];">我同意</button>
          </view>
        </view>
      </u-popup-->
    </view>
  </u-popup>
</template>

<script setup>
import {reactive} from 'vue'
import {authWxLogin} from '@/api/login/index'
import {tokenSave} from '@/utils/login'
const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
  isShowWxPhoneNumber: {
    type: Boolean,
    default: true,
  },
  isShowPhoneNumber: {
    type: Boolean,
    default: true,
  }
})
const emits = defineEmits(['close'])
const pageData = reactive({
  isShow:true,
  isDialogShow:false,
  isAgreeItems:[],
  jsCode:'',
})

const close = ()=>{
  emits('close')
}

const getPhoneNumberValid = ()=>{
  if (!pageData.isAgreeItems.length) {
    pageData.isDialogShow = true
    uni.showToast({title: '请勾选同意隐私条款',icon:'none',duration: 2000})
  }
  else {
    uni.login({
      provider: 'weixin', //使用微信登录
      success: function (res) {
        if (res.code) {
          pageData.jsCode = res.code
        }
        else {
          let title = '登录错误：'+res.errMsg
          uni.showToast({title:title,icon: 'none', duration: 2000})
        }
        console.log('wxLogin',res)
      },
      fail : function(res) {
        uni.showToast({title:'登录错误：'+res.detail.code,icon: 'none', duration: 2000})
      },
    });
  }
}

const getPhoneNumber = (e)=> {
  console.log('getPhoneNumber',e)
  if (e.detail.code) {
    if (pageData.jsCode) {
      authWxLogin({code:e.detail.code,jsCode:pageData.jsCode}).then(res=>{
        tokenSave(res,'', true).then(res=>{
          uni.showToast({
            title: "登录成功",
            icon: "none"
          })
        })
      })
      emits('close')
    }
    else {
      setTimeout(()=>{
        if (pageData.jsCode) {
          authWxLogin({code: e.detail.code, jsCode: pageData.jsCode}).then(res => {
            tokenSave(res, '', true).then(res=> {
              uni.showToast({
                title: "登录成功",
                icon: "none"
              })
            })
          })
          emits('close')
        }
        else {
          uni.showToast({title:'登录获取code错误',icon: 'none', duration: 2000})
        }
      },2000)
    }
  }
  else {
    let title = '获取手机号错误：' + e.detail.errMsg
    if (title.indexOf('getPhoneNumber:fail user deny') != -1) {
      title = '获取手机号用户取消授权'
    }
    else if (title.indexOf('etPhoneNumber:fail no permission') != -1) {
      title = '获取手机号暂无权限'
    }
    uni.showToast({title:title,icon: 'none', duration: 2000})
  }
}

const gotoLogin = ()=>{
  emits('close')
  uni.navigateTo({url:'/pages/login/index'})
}

const gotoAgreement = (url) =>{
  uni.navigateTo({url})
}
</script>

<style scoped>

</style>
