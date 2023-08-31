<template>
  <view>
    <view>红包首页</view>
    <button @click="onRedbagOpen">打开</button>

    <view v-show="pageData.isShowOfficialAccount" class="fixed z-[9999] bottom-0 left-0 w-full" @click="onOfficialAccount">【测试公众号】
      <official-account></official-account>
    </view>
    <activityJoin ref="activityJoinRef" @ShowOfficialAccount="showOfficialAccount"></activityJoin>
  </view>
</template>

<script setup>
import {ref,reactive,onMounted} from 'vue'
import activityJoin from './components/activityJoin.vue'

const pageData = reactive({
  isShowOfficialAccount:false //是否在底部显示公众号
})

onMounted(()=>{
  //onMessageText('hello wold')
})

//开始红包流程
const activityJoinRef = ref()
const onRedbagOpen = ()=>{
  activityJoinRef.value.init({})
}

//公众号点击添加一次机会
const onOfficialAccount = ()=>{
  activityJoinRef.value.officialAccount({})
}

//显示消息
const onMessageText = (text)=>{
  activityJoinRef.value.message({messageText:text},true)
}

//公众号显示与关闭
const showOfficialAccount = (value)=>{
  pageData.isShowOfficialAccount = value
}
</script>

<style lang="scss" scoped>

</style>