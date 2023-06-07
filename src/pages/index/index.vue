<template>
  <view>
    <view class="relative p-1  mb-2 h-20">
			<navigator  hover-class="navigator-hover">
			 <icon type="search" size="26"  class="float-right" />
			 	</navigator>
		</view>
    home
    userInfo:{{loginToken.accessToken}}
  </view>
</template>

<script setup>
import {ref,onMounted} from 'vue'
const loginToken = ref({})
onMounted(()=>{
  loginToken.value = getApp().globalData.loginToken
})
</script>

<style lang="scss" scoped>
</style>
