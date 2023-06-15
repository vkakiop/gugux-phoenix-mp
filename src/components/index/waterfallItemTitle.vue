<template>
  <view class="w-172" v-if="item && item.cover">
    <view v-if="isVirtualCal" :style="{width:'100%',height:computedHeight(item.cover.width,item.cover.height)+'rpx'}"></view>
    <image v-else :src="item.cover.itemType == 2 ? item.cover.content : item.cover.thumbnail" :style="{width:'100%',height:computedHeight(item.cover.width,item.cover.height)+'rpx'}" @click="godetail(item)"></image>
    <view class="">
      <view class="">{{item.title}}</view>
    </view>
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
const godetail=(item)=>{
 if (item.cover.itemType == 2) {
 	uni.navigateTo({
 		url: `/pages/opus/index?id=${item.id}`
 	})
 } else if (item.cover.itemType == 3) {
 	uni.navigateTo({
 		url: '/pages/VideoCarousel/VideoCarousel?id=' + item.id
 	})
 }
}
</script>

<style lang="scss" scoped>
</style>
