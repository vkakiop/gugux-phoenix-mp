<template>
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
    data: url, //要被复制的内容
    success: () => { //复制成功的回调函数
      uni.showToast({ //提示
        title: '复制成功'
      })
    }
  })
}

</script>

<style lang="scss" scoped>

</style>