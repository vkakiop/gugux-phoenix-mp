<template>
  <view>
    <view v-if="pageData.isShow">
      <u-popup :show="pageData.isShowLogin" mode="bottom" round="10" :customStyle="{marginLeft:'0rpx',marginRight:'0rpx'}" @close="close">
        <view class="mx-30 mt-20 mb-16">
          <view class="flex justify-between">
            <view class="flex">
              <image :src="configStaticPath('/static/redbag/poplogo.png')" class="w-20 h-20"></image>
              <view class="ml-5 text-16 text-[#000000] text-center font-bold">咕咕行</view>
            </view>
            <image :src="configStaticPath('/static/redbag/popicon.png')" class="w-20 h-20"></image>
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
      <u-popup :show="pageData.isShowRedbag" @close="close" @open="open"  mode="center" bgColor="transparent">
        <view>
          <view class="relative w-250 h-400">
            <image :src="configStaticPath('/static/redbag/popbg.jpg')" class="w-full h-300 absolute left-0 top-0"/>
            <view class="absolute w-full text-center text-[#fed9ac]">
              <view v-if="false">
                <view class="mt-30">恭喜您获得咕咕行红包</view>
                <view>
                  <text class="text-20">￥</text>
                  <text class="text-40">6.60</text>
                </view>
              </view>
              <view v-else class="pt-30">
                非常遗憾，没有抽中咕咕行红包
              </view>
              <view class="mt-50">
                <view>关注咕咕行公众号</view>
                <view>可获得额外一次抽奖机会!</view>
              </view>
            </view>
            <image :src="configStaticPath('/static/redbag/popbutton.png')" class="w-160 h-40 absolute left-[calc(50%-160rpx)] bottom-150" @click="close"/>
            <image :src="configStaticPath('/static/redbag/popbuttondown.png')" class="w-160 h-40 absolute left-[calc(50%-160rpx)] bottom-150" @click="downApp"/>
            <view class="absolute w-full flex justify-center bottom-100">
              <view class="text-center text-12 text-[#fed9ac] bg-[red] inline-block rounded-full">红包已转入您的微信零钱</view>
            </view>
            <image :src="configStaticPath('/static/redbag/popclose.png')" class="w-40 h-40 absolute left-[calc(50%-40rpx)] bottom-0" @click="close"/>
          </view>
        </view>
      </u-popup>
      <u-popup :show="pageData.isShowMessage" @close="close" @open="open"  mode="center" bgColor="transparent">
        <view class="w-300 bg-white rounded-20">
          <view class="mt-40 flex justify-center">
            <view class="w-4/5 text-center">
              <view>{{pageData.messageText}}</view>
              <view>请等待下一轮抽奖吧</view>
            </view>
          </view>
          <view class="mt-30 h-50 leading-50 rounded-b-20 bg-[#f2f2f2] text-center text-[#333333]" @click="close">关闭</view>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script setup>
import {reactive} from "vue"
import {authWxLogin} from '@/api/login/index'
import {tokenSave} from '@/utils/login'
import {configStaticPath} from '@/config/index'

const pageData = reactive({
  isShow:true,
  isShowLogin:false,
  isShowRedbag:false,
  isShowMessage:false,
  messageText:'',
  jsCode:'',
})

const init = (row,isOfficialAccount) => {
  if (isOfficialAccount) {
    uni.showToast({title: '关注公众号测试',icon:'none',duration: 2000
    });
  }
  else {
    pageData.isShow = true
    //pageData.isShowLogin = false
    pageData.isShowRedbag = true
    //pageData.isShowMessage = true
    //pageData.messageText = '您的抽奖次数已用完'
  }
}
defineExpose({ init })

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

const close = ()=>{
  pageData.isShow = false
}

const downApp = ()=>{
  uni.navigateTo({url:'/pages/downapp/index'})
}
</script>

<style lang="scss" scoped>

</style>