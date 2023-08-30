<template>
  <view>
    <view>红包首页</view>
    <button @click="onRedbagOpen">打开</button>
    <activityJoin ref="activityJoinRef"></activityJoin>
  </view>
</template>

<script setup>
import {ref,reactive} from 'vue'
import activityJoin from './components/activityJoin.vue'

const activityJoinRef = ref()
const onRedbagOpen = ()=>{
  activityJoinRef.value.init({})
}
</script>

<style lang="scss" scoped>

</style>