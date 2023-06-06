<template>
  <web-view v-if="pageData.url" :src="pageData.url"></web-view>
</template>

<script setup>
import {reactive} from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const pageData = reactive({
  url:'',
})
onLoad((option)=>{
  if (option.code) {
    pageData.url = import.meta.env.VITE_APP_BASE_API + '/gugux-services-user-api/app/user/protocol/' + option.code
    uni.setNavigationBarTitle({title:option.title})
  }
  else {
    uni.showToast({
      title: '协议code参数有误！',
      icon:'error',
      duration: 2000
    });
  }
})
</script>

<style lang="scss" scoped>

</style>
