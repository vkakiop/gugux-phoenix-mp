<template>
  <view class="w-172" v-if="item && item.cover">
    <view v-if="isVirtualCal" :style="{width:'100%',height:computedHeight(item.cover.width,item.cover.height)+'rpx'}"></view>
    <image v-else :src="item.cover.itemType == 2 ? item.cover.content : item.cover.thumbnail" :style="{width:'100%',height:computedHeight(item.cover.width,item.cover.height)+'rpx'}"></image>
  </view>
  <view class="h-14"></view>
</template>

<script setup>
import {computed} from 'vue'
const props = defineProps(['item','isVirtualCal'])
const computedHeight = computed({
  get: (w, h) => {
    return function(w, h) {
      return w <= 0 ? 344 : h*(344/w)
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
