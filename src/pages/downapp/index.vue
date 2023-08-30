<template>
  <customNav>
    <view @click="gotoBack" class="pl-10 mt-[3rpx]"><uni-icons type="back" size="24"></uni-icons></view>
    <view class="name mx-6 text-18 line-clamp-1">下载app</view>
  </customNav>
  <view>
    咕咕行，同行一路有我
  </view>
  <view>
    <button @click="copyUrl">复制下载连接</button>
    <view>粘贴到手机浏览器打开进行下载</view>
  </view>
</template>

<script setup>

const copyUrl = ()=>{
  let url = 'https://gugux.caigetuxun.com/down/index.html'
  uni.setClipboardData({
    data: url,
    success: () => {
      uni.showToast({
        title: '复制成功',
        icon:'none'
      })
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