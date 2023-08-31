<template>
  <view>
    <view>红包首页</view>
    <button @click="onRedbagOpen">打开</button>

    <activityJoin ref="activityJoinRef"></activityJoin>
  </view>
</template>

<script setup>
import {ref,reactive,onMounted,nextTick} from 'vue'
import {getHtmlReplaceEnter} from '@/utils/utils'
import activityJoin from './components/activityJoin.vue'

onMounted(()=>{
  onMessageText('本轮活动已经结束\n请等待下一轮抽奖吧')
})

//开始红包流程
const activityJoinRef = ref()
const onRedbagOpen = ()=>{
  nextTick(()=>{
    activityJoinRef.value.message({messageText:text},true)
  })
  activityJoinRef.value.init({})
}

//显示消息
const onMessageText = (text)=>{
  nextTick(()=>{
    activityJoinRef.value.message({messageText:getHtmlReplaceEnter(text)},true)
  })
}
</script>

<style lang="scss" scoped>

</style>