<template>
  <div>
    <button @click="getPhone">获取当前手机号</button>
  </div>

</template>

<script setup>
import {onMounted,reactive} from 'vue'
import {onLoad,onShow} from '@dcloudio/uni-app'

const getPhone = ()=>{
  uni.redirectTo({url:'/pages/blekey/login'})
}
</script>

<style lang="scss" scoped>

</style>