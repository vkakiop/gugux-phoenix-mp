<template>
  <view>
    <u-popup :show="pageData.isShowLogin" mode="bottom" round="10" :customStyle="{marginLeft:'0rpx',marginRight:'0rpx'}">
        <view class="mx-30 mt-20 mb-16">
          <view class="flex justify-between">
            <view class="flex">
              <image :src="configStaticPath('/static/redbag/poplogo.png')" class="w-20 h-20 rounded-full"></image>
              <view class="ml-5 text-16 text-[#000000] text-center font-bold">咕咕行</view>
            </view>
            <image :src="configStaticPath('/static/redbag/popicon.png')" class="w-20 h-20" @click="closeLogin"></image>
          </view>
          <view class="mt-20 text-15">
            <view class="leading-22 text-[#333] font-bold">
              申请获取以下权限
            </view>
            <view class="text-[#999] mt-50">
              获得你微信绑定的手机号码
            </view>
          </view>
          <view class="mt-20">
            <button :open-type="true ? 'getPhoneNumber':''" @click="getPhoneNumberValid" @getphonenumber="getPhoneNumber" class="h-40 leading-40 rounded-full bg-[#51ab3a] active:bg-[#09b307] text-white text-14">授权登录</button>
          </view>
        </view>
      </u-popup>
    <u-popup :show="pageData.isShowRedbag" mode="center" bgColor="transparent">
      <view>
        <view class="relative w-375 h-460">
          <image :src="configStaticPath('/static/redbag/popbg.png')" class="w-full h-408 absolute left-0 top-0"/>
          <view class="absolute w-full text-center text-[#FFEDAC]">
            <view v-if="pageData.redbagInfo.isDraw">
              <view class="mt-63 text-14">恭喜您获得咕咕行红包</view>
              <view class="text-[#FFFFFC] mt-20">
                <!--text class="text-20">￥</text-->
                <text class="text-46">{{pageData.redbagInfo.amount}}</text>
                <text class="text-15">元</text>
              </view>
            </view>
            <view v-else class="mt-65 pb-50 text-14">
              非常遗憾，没有抽中咕咕行红包
            </view>
            <view class="mt-20 text-16">
              <view>关注咕咕行公众号</view>
              <view>可获得额外1次抽奖机会!</view>
            </view>
          </view>
          <image :src="configStaticPath('/static/redbag/popbutton.png')" class="w-122 h-41 absolute left-[calc(50%-122rpx)] bottom-125" @click="close"/>
          <image :src="configStaticPath('/static/redbag/popbuttondown.png')" class="w-122 h-41 absolute left-[calc(50%-122rpx)] bottom-125" @click="downApp"/>
          <view class="absolute w-full flex justify-center bottom-105">
            <view class="text-center text-14 text-[#FFEDAC] inline-block rounded-full">红包已转入您的微信零钱</view>
          </view>
          <image :src="configStaticPath('/static/redbag/popclose.png')" class="w-39 h-39 absolute left-[calc(50%-39rpx)] bottom-0" @click="closeRedbag"/>
        </view>
      </view>
    </u-popup>
    <u-popup :show="pageData.isShowOfficialAccount" mode="bottom">
      <view class="w-300 bg-white rounded-20">
        <view class="mt-40 flex justify-center">
          <official-account></official-account>
        </view>
        <view class="mt-30 h-50 leading-50 rounded-b-20 bg-[#f2f2f2] text-center text-[#333333]" @click="closeOfficialAccount">关闭</view>
      </view>
    </u-popup>
    <u-popup :show="pageData.isShowMessage" mode="center" bgColor="transparent">
      <view class="w-300 bg-white rounded-20">
        <view class="mt-17 mx-auto">
          <view class="flex justify-center">
            <image :src="configStaticPath('/static/redbag/popicon.png')" class="w-49 h-49"></image>
          </view>
          <view class="mt-13 flex justify-center">
            <rich-text v-html="pageData.messageText" class="w-4/5 font-bold text-center text-18 text-[#333333]"></rich-text>
          </view>
        </view>
        <view class="flex justify-center">
          <view class="mt-13 mb-13 w-146 h-43 leading-43 rounded-full bg-[#F4F5F6] text-17 text-center text-[#333333]" @click="closeMessage">关闭</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import {reactive} from "vue"
import {authWxLogin} from '@/api/login/index'
import {tokenSave} from '@/utils/login'
import {configStaticPath} from '@/config/index'
import {getTokenValue,isWxPhoneLogin,getHtmlReplaceEnter} from '@/utils/utils'
import {redbagAdd,redbagInfo} from '@/api/redbag/index'

const pageData = reactive({
  isShowLogin:false,

  isShowRedbag:false,
  redbagInfo:{},

  isShowOfficialAccount:false,

  isShowMessage:false,
  messageText:'',

  jsCode:'',
})

const init = (row) => {
  //判断数量如果为0弹出消息
  if (false) {
    pageData.isShowMessage = true
    pageData.messageText = '您的抽奖次数已用完'
    return
  }

  //判断是否微信授权登录
  if (!isWxPhoneLogin()) {
    pageData.isShowLogin = true
    return
  }

  redbagInfo({id:id}).then(res=>{
    pageData.redbagInfo = res.data
    pageData.isShowRedbag = true

    //判断是否有关注公众号的机会
    if (!pageData.redbagInfo.isType) {
      pageData.isShowOfficialAccount = true
    }
  }).catch(e=>{
    pageData.isShowMessage = true
    pageData.messageText = getHtmlReplaceEnter(e.toString())
  })
}

const message = (row) => {
  if (row) {
    pageData.isShowMessage = true
    pageData.messageText = row.messageText
  }
}
defineExpose({ init,message })

const getPhoneNumberValid = ()=>{
}

const getPhoneNumber = (e)=> {
  console.log('getPhoneNumber',e)
  if (e.detail.code) {
    if (pageData.jsCode) {
      authWxLogin({code:e.detail.code,jsCode:pageData.jsCode}).then(res=>{
        tokenSave(res,'', true)
      })
      emits('close')
    }
    else {
      setTimeout(()=>{
        if (pageData.jsCode) {
          authWxLogin({code: e.detail.code, jsCode: pageData.jsCode}).then(res => {
            tokenSave(res, '', true)
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

const closeLogin = ()=>{
  pageData.isShowLogin = false
}

const closeRedbag = ()=>{
  pageData.isShowRedbag = false
}

const closeMessage = ()=>{
  pageData.isShowMessage = false
}

const closeOfficialAccount = ()=>{
  pageData.isShowOfficialAccount = false
}

const downApp = ()=>{
  uni.navigateTo({url:'/pages/downapp/index'})
}
</script>

<style lang="scss" scoped>

</style>