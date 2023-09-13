<template>
  <view class="relative h-screen overflow-hidden bg-[#c5c9d5]">
    <customNav>
      <view @click="gotoBack" class="pl-10 mt-[3rpx]"><uni-icons type="back" size="24"></uni-icons></view>
      <view class="name mx-6 text-18 line-clamp-1">下载咕咕行APP</view>
    </customNav>
    <view class="">
      <image class="absolute w-full h-760" :src="configStaticPath('/static/redbag/qr_bg.jpg')"></image>
      <view class="absolute left-0 bottom-0 w-full">
        <view class="flex justify-center">
          <view>
            <view class="w-278 h-52 leading-52 rounded-10 bg-[#F8CF01] text-center text-[#00000] text-18" @click="copyUrl">复制下载链接</view>
            <view class="mt-15 pb-10 text-16 text-[#121212] text-center">粘贴到手机浏览器打开进行下载</view>
          </view>
        </view>
        <u-safe-bottom></u-safe-bottom>
      </view>
    </view>
  </view>
</template>

<script setup>
import {reactive} from "vue"
import {configStaticPath} from '@/config/index'
import {redbagAdd,redbagInfo} from '@/api/redbag/index'
import {onLoad} from '@dcloudio/uni-app'

const pageData = reactive({
  type:'',
  id:'',
})
onLoad(option=>{
  pageData.type = option.type
  pageData.id = option.id

  console.log('pageData',pageData)
})

const copyUrl = ()=>{
  let url = 'https://gugux.caigetuxun.com/down/index.html'
  uni.setClipboardData({
    data: url,
    success: () => {
      uni.showToast({
        title: '复制成功',
        icon:'none'
      })
      if (pageData.type == 'redbag' && pageData.id) {
        redbagAdd({type:2,id:pageData.id}).then(res=>{
        })
      }
    },
    fail: ()=>{
      uni.showToast({
        title: '复制失败',
        icon:'none'
      })
    }
  })
}

const gotoBack = ()=>{
  uni.navigateBack({delta: 1})
}
</script>

<style lang="scss" scoped>

</style>