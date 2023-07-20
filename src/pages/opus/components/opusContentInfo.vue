<template>
  <view class="w-full">
    <template v-for="(element,index) in content" :key="index">
          <view class="text-left pb-20">
            <p v-if="element.itemType == 1" class="text-16 text-[#272a29]">{{element.content}}</p>
            <view v-if="element.itemType == 2">
              <view class="relative">
                <image @click="previewImage(element.content)" :src="element.content" class="rounded-5 w-full align-top" mode="widthFix"/>
                <view v-if="element.name" class="absolute left-0 bottom-0 h-42 w-full text-white text-13">
                  <view class="flex ml-14 mt-10">
                    <image class="w-9 h-11 mt-3" :src="configStaticPath('/static/opus/icon_location_white.png')"></image>
                    <view class="ml-5 leading-17 line-clamp-1">{{element.name}} {{computedLocation(element.x,element.y)}}</view>
                  </view>
                </view>
              </view>
            </view>
            <view v-if="element.itemType == 3">
              <view class="relative" @click="previewMedia(element.content)">
                <image :src="element.thumbnail" class="rounded-5 w-full align-top" mode="widthFix"/>
                <view v-if="element.name" class="absolute left-0 bottom-0 h-42 w-full text-white text-13">
                  <view class="flex ml-14 mt-10">
                    <image class="w-9 h-11 mt-3" :src="configStaticPath('/static/opus/icon_location_white.png')"></image>
                    <view class="ml-5 leading-17 line-clamp-1">{{element.name}} {{computedLocation(element.x,element.y)}}</view>
                  </view>
                </view>
                <view class="top-[calc(50%-64rpx)] left-[calc(50%-64rpx)] absolute w-50 h-50"><image class="w-64 h-64" :src="configStaticPath('/static/opus/icon_play.png')"/></view>
              </view>
            </view>
            <view v-if="element.itemType == 4">
              <locusTip :item="element"></locusTip>
            </view>
          </view>
    </template>
  </view>
</template>
<script setup>
import {ref, reactive, watch, onMounted, computed} from "vue";
import { distanceOf,formatedDistance } from "@/utils/utils"
import {configStaticPath} from '@/config/index'
import locusTip from './locusTip.vue'
const props = defineProps({
  content:{
    type:Array,
    default:{},
  },
  geo_x:{
    type:Object,
    default:null,
  },
  geo_y:{
    type:Object,
    default:null,
  }
})



onMounted(()=>{

})


const previewMedia = (url) => {
  let urls = props.content.filter(item=>{
    return item.itemType == 3
  }).map(item=>{
    return item.content
  })
  uni.navigateTo({url:'/pages/opus/videoplay?url='+encodeURIComponent(url)+'&urls='+encodeURIComponent(JSON.stringify(urls))})
}

const previewImage = (url)=>{
  let urls = props.content.filter(item=>{
    return item.itemType == 2
  }).map(item=>{
    return item.content
  })

  uni.previewImage({
    urls:urls,
    current:url
  })
}

const computedLocation = computed({
  get:(x,y) => {
    return function(x,y) { return props.geo_x != null ? '(距您'+formatedDistance(distanceOf({x:x,y:y},{x:props.geo_x,y:props.geo_y}),1)+')' : ''}
  }
})
</script>
<style scoped lang="scss">
</style>
