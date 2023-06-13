<template>
  <view v-if="pageData.traceInfo.id" class="h-123 relative">
    <image src="@/static/opus/locus_bg.png" class="absolute w-full h-123 -z-1"></image>
    <view>
      <view class="w-90 absolute left-0 bottom-63 w-77 h-32">
        <view class="relative">
          <image class="w-77 h-32 absolute left-0 top-0" src="@/static/opus/locus_tip.png"/>
          <view class="absolute w-full left-0 top-0 text-10 text-[#272a2] text-center leading-25 line-clamp-1">{{pageData.traceInfo.startPlace}}</view>
        </view>
      </view>
      <view class="w-90 absolute right-0 bottom-63 w-77 h-32">
        <view class="relative">
          <image class="w-77 h-32 absolute left-0 top-0" src="@/static/opus/locus_tip.png"/>
          <view class="absolute w-full left-0 top-0 text-10 text-[#272a2] text-center leading-25 line-clamp-1">{{pageData.traceInfo.endPlace}}</view>
        </view>
      </view>
      <view v-if="pageData.traceInfo.middlePlaceNum" class="w-90 absolute right-140 bottom-63 w-77 h-32">
        <view class="relative">
          <image class="w-77 h-32 absolute left-0 top-0" src="@/static/opus/locus_tip.png"/>
          <view class="absolute w-full left-0 top-0 text-10 text-[#272a2] text-center leading-25 line-clamp-1">途径{{pageData.traceInfo.middlePlaceNum}}个点</view>
        </view>
      </view>
      <view>
        <image class="w-267 h-30 absolute left-29 top-60" src="@/static/opus/locus_line.png"/>
        <image class="w-24 h-24 absolute left-27 top-60" src="@/static/opus/locus_start.png"/>
        <image class="w-24 h-24 absolute right-27 top-60" src="@/static/opus/locus_end.png"/>
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
</style>
