<template>
  <view>
    <view v-if="pageData.isShow">
      活动按钮
    </view>
  </view>
</template>

<script setup>
import {reactive} from "vue";

const pageData = reactive({
  isShow:false,
})

const init = (row) => {
  if (row) {
    uni.showToast({title: 'test',icon:'none',duration: 2000
    });
    pageData.isShow = true
  }
}
defineExpose({ init })
</script>

<style lang="scss" scoped>

</style>