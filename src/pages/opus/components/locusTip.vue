<template>
  <view v-if="pageData.traceInfo.id" class="h-100 relative">
    <image src="@/static/opus/locus_bg.png" class="absolute w-full h-98 -z-1"></image>
    <view class="relative mx-10 pt-20">
      <view class="bg-[#6aa4ff] absolute h-4 top-62 ml-50 w-190"></view>
      <view class="w-90 absolute left-0">
        <view :class="['title_tip','h-26','p-3','pt-3','overflow-hidden']">
          <view class="h-16 overflow-hidden leading-16 text-center justify-center items-center text-white text-10">{{pageData.traceInfo.startPlace}}</view>
        </view>
        <view :class="['line_border','locus_icon_sanjiao','mx-auto']"></view>
        <image class="w-12 h-12 absolute left-40" src="@/static/opus/locus_start.png"/>
      </view>
      <view class="w-90 absolute right-0">
        <view :class="['title_tip','h-26','p-3','pt-3','overflow-hidden']">
          <view class="h-16 overflow-hidden leading-16 text-center justify-center items-center text-white text-10">{{pageData.traceInfo.endPlace}}</view>
        </view>
        <view :class="['line_border','locus_icon_sanjiao','mx-auto']"></view>
        <image class="w-12 h-12 absolute right-40" src="@/static/opus/locus_end.png"></image>
      </view>
      <view class="absolute mx-auto w-50 left-[50%] -ml-25 top-33" v-if="pageData.traceInfo.middlePlaceNum">
        <view class="h-26 leading-26 text-center locus_tip_txt text-10">途径{{pageData.traceInfo.middlePlaceNum}}地</view>
        <view class="flex justify-between">
          <view class="w-10 h-10 rounded-full locus_cycyle_bg"></view>
          <view class="w-10 h-10 rounded-full locus_cycyle_bg"></view>
          <view class="w-10 h-10 rounded-full locus_cycyle_bg"></view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import {onMounted, reactive, ref, watch} from "vue"
import {jumpAppStore} from "@/utils/utils"
import { getOpusTrack} from "@/api/opus/index"

const props = defineProps({
  item: {
    type: Object,
    default: {},
  },
  width: {
    type: Number,
    default: 578,
  }
})

const pageData = reactive({
  trackId:'',
  traceInfo:{}
})

const getDataApi = ()=>{
  if (pageData.trackId) {
    getOpusTrack({trackId:pageData.trackId}).then(res=>{
      pageData.traceInfo = res.data
    })
  }
}

watch(props.item,(val,oldVal)=>{
  pageData.trackId = val.content || ''
  getDataApi()
},{immediate: true,deep: true})
</script>

<style lang="scss" scoped>
.title_tip {
  border:4rpx solid #fff;
  border-radius: 6rpx;
  background: #4b8ae6;
  line-height: 30rpx;
  overflow: hidden;
}
.locus_icon_sanjiao {
  width: 0rpx;
  height: 0rpx;
  border-bottom: 10rpx solid transparent;
  border-left: 10rpx solid transparent;
  border-right: 10rpx solid transparent;
  border-top: 15rpx solid #fff;
  position: relative;
}
.locus_icon_sanjiao:after {
  content:'';
  width: 0rpx;
  height: 0rpx;
  border-bottom: 8rpx solid transparent;
  border-left: 8rpx solid transparent;
  border-right: 8rpx solid transparent;
  border-top: 12rpx solid #4b8ae6;
  position: absolute;
  left: -8rpx;
  top: -18rpx;
}
.locus_cycyle_bg {
  background: #6aa4ff;
}
.locus_tip_txt {
  color: #4b8ae6;
}
</style>
