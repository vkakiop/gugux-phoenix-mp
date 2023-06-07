<template>
  <view>
    <view class="relative p-10  mb-10 bg-blue-500">
			<navigator url="/pages/index/searchHistory"  hover-class="navigator-hover">
			 <icon type="search" size="26"  class="absolute right-0" />
			 	</navigator>
		</view>

    <view>
      token:{{loginToken.accessToken}}
    </view>
    <view>
      <navigator url="/pages/login/phone" open-type="redirect">去登录</navigator>
      <navigator url="/pages/login/logout" open-type="redirect">退出登录</navigator>
    </view>
    <w-qrcode ref="qrcode" :options="options" @press="longtap"></w-qrcode>
  </view>
</template>

<script setup>
import {ref,onMounted} from 'vue'
import {onShow} from "@dcloudio/uni-app"

//二维码
const options = ref({
    code: '这是你生成二维码的值', // 生成二维码的值
    size: 460, // 460代表生成的二维码的宽高均为460rpx
    img: { // 二维码log配置 非必传
    src: '/static/logo.png', // 图片地址
    size: 60, // 图片大小
    degree: 15, // 圆角大小 如果type为round生效
    type: 'round', //图片展示类型 默认none 可选值  round圆角  circle圆 如果为round 可以传入degree设置圆角大小 默认 5
    color: '#ffffff', //图片周围的白色边框
    width: 8 //图片周围白色边框的宽度 默认5
  },
})


const loginToken = ref({})
onShow(()=>{
  loginToken.value = getApp().globalData.loginToken
})
</script>

<style lang="scss" scoped>
</style>
