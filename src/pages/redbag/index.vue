<template>
  <view>
    <view>红包首页</view>
    <button @click="onRedbagOpen">打开</button>

    <view class="fixed z-[9999] bottom-0 left-0 w-full" @click="onOfficialAccount">【测试公众号】
      <official-account></official-account>
    </view>
    <activityJoin ref="activityJoinRef"></activityJoin>
  </view>
</template>

<script setup>
import {ref,reactive} from 'vue'
import activityJoin from './components/activityJoin.vue'

//开始红包流程
const activityJoinRef = ref()
const onRedbagOpen = ()=>{
  activityJoinRef.value.init({},false)
}

//公众号点击添加一次机会
const onOfficialAccount = ()=>{
  activityJoinRef.value.init({},true)
}
</script>

<style lang="scss" scoped>

</style>