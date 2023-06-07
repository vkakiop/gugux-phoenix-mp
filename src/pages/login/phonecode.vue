<template>
  <view class="m-30">
    <view class="text-right h-30"></view>
    <phoneslogan></phoneslogan>
    <view class="mt-58 text-[#7b7b7c]">{{pageData.isLoading ? '正在发送至' : '已经发送至'}}：{{ pageData.phone }}</view>
    <view class="phone_code_single">
      <input class="phone_code_single_cinput"
             adjust-position="false"
             auto-blur="true"
             @blur="codeNumBlurFun"
             @input="codeNumInputFun"
             :focus="pageData.focus"
             v-model="pageData.code"
             type="number"
             maxlength="6"/>
      <view class="phone_code_single_codeinput">
        <view v-for="(item,index) in 6"
              :key="index"
              @click="codefocusFun(index)"
              :style="(index == pageData.code.length? 'background-color:#FEF2F2;':'color: #313131;background-color:#e9ebef')">
          {{pageData.code[index]}}
        </view>
      </view>
    </view>
    <view v-if="!pageData.isLoading" class="mt-30">
      <view class="text-[#4ba1f8]">
        <text v-if="pageData.isReget" @click="getCode">重新发送</text>
        <text v-else class="">重新发送({{pageData.count}})</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import {reactive,watch,onMounted} from 'vue'
import {authSms,authSmsLogin} from '@/api/login/index'
import {tokenSave} from '@/utils/login'
import phoneslogan from './components/phoneslogan.vue'
import {onLoad} from "@dcloudio/uni-app"

const pageData = reactive({
  url:'',
  phone: "", // 当前显示电话
  isReget: false,  // 判断是否显示 ‘重新获取’按钮
  isLoading: true, // 正在加载中
  timer: null,   // 定时器
  count: 60,  // 时间
  code: "",  // 验证码
  focus: true,   // 焦点
})

onLoad((option)=>{
  pageData.url = decodeURIComponent(option.url || '')
  console.log('return url:',pageData.url)
  pageData.phone = option.phone
  getCode() // 获取验证码
})

watch(()=>pageData.count,(newVal,oldVal)=>{
  if(newVal==0){
    pageData.isReget = true
    clearInterval(pageData.timer)
  }
})

watch(()=>pageData.code,(newVal,oldVal)=>{
  if (newVal.length == 6) {
    onLogin()
  }
})

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

//获取验证码
const getCode = ()=>{
  pageData.isLoading = true
  authSms({phone:pageData.phone,type:1}).then(res=>{
    pageData.isLoading = false

    pageData.count = 60
    pageData.isReget = false
    getTimer()
  }).catch(e=>{
    setTimeout(()=>{
      uni.navigateBack({delta: 1})
    },2000)
  })
}

//输入框输入事件
const codeNumInputFun = (e)=>{
  let val = e.detail.value
  pageData.code = val
  // if(val.length==6){
  //   onLogin()
  // }
}

//输入框失去焦点事件
const codeNumBlurFun = (e)=>{
  let val = e.detail.value
  pageData.focus = false
  // if(val.length==6) {
  //   onLogin()
  // }
}

//输入框点击事件
const codefocusFun = (index)=>{
  pageData.focus = true
}

//按钮点击事件
const onLogin = ()=>{
  authSmsLogin({code:pageData.code,phone:pageData.phone}).then(res=>{
    tokenSave(res,pageData.url)
  })
}
</script>

<style lang="scss" scoped>
.phone_code_single{
  margin-top: 30rpx;
  .phone_code_single_cinput{
    position: fixed;
    left: -100rpx;
    width: 50rpx;
    height: 50rpx;
  }
  .phone_code_single_codeinput{
    margin: auto;
    width: 650rpx;
    height: 100rpx;
    display: flex;
  }

  .phone_code_single_codeinput>view {
    margin-top: 5rpx;
    margin-left: 15rpx;
    width: 96rpx;
    height: 96rpx;
    line-height: 96rpx;
    font-size: 60rpx;
    font-weight: bold;
    color: #313131;
    text-align: center;
    border-radius: 10rpx;
  }

  .phone_code_single_codeinput>view:nth-child(1) {
    margin-left: 0rpx;
  }
}
</style>
