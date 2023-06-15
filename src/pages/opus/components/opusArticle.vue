<template>
  <view>
    <view class="relative">
      <image v-if="detail.cover && ((detail.cover.itemType == 2 && detail.cover.content) || (detail.cover.itemType == 3 && detail.cover.thumbnail))"
             class="w-375 h-243"
             mode="aspectFill"
             :src="detail.cover.itemType == 2 ? detail.cover.content : detail.cover.thumbnail"
             @click="previewCover(detail.cover)"
      />
      <view class="absolute left-0 bottom-0 h-42 w-full text-white text-13">
        <view class="flex ml-14 mt-10">
          <image class="w-9 h-11 mt-3" src="@/static/opus/icon_location_white.png"></image>
          <view class="ml-5">{{detail.cover.name}} {{ computedLocation(detail.cover.x, detail.cover.y) }}</view>
        </view>
      </view>
    </view>
    <view class="mx-18">
      <view class="flex justify-between">
        <view>
          <h1 class="text-[#272a29] text-21 mt-20 font-bold">{{detail.title}}</h1>
          <view class="inline-block">
            <view class="flex px-10 h-24 justify-center items-center mt-19 bg-[#f4f5f6] rounded-full" v-if="detail.recommendedCity">
              <image class="w-9 h-11" src="@/static/opus/icon_location_black.png"></image>
              <view class="ml-5 text-13 line-clamp-1">{{detail.cover.name}} {{ computedLocation(detail.cover.x, detail.cover.y) }}</view>
            </view>
          </view>
          <view class="flex flex-wrap text-14 mt-10">
            <view class="flex">
              <view class="text-[#999999]">发布于：{{detail.createdTime ? detail.createdTime.split(' ')[0] : ''}}</view>
              <view class="text-[#999999] ml-17">阅读量：{{detail.browseNum}}</view>
            </view>
          </view>
        </view>
        <!-- <img v-if="detail.boutique" class="icon_jiajin w-45 h-45 mt-10" src="@/static/opus/icon_jiajin.png"/> -->
      </view>
    </view>
    <view class="mx-18 mt-10">
      <view class="text-16 leading-[170%]">
        <opus-content-info :content="detail.content" :geo_x="geo_x" :geo_y="geo_y"></opus-content-info>
      </view>
      <view v-if="detail.topics">
        <view class="float-left mr-5 mb-10 px-10 flex items-center h-28 leading-28 bg-[#f1f3f5] text-14 rounded-full" v-for="(item,index) in detail.topics" :key="index">
          <image class="w-13 h-13 -mt-2" src="@/static/opus/icon_topic.png"></image>
          <view class="ml-4 line-clamp-1">{{item}}</view>
        </view>
        <view class="clear-left"></view>
      </view>
      <view class="text-center mt-15">
        <view class="text-[#666666] text-14 mx-40">本作品著作权归作者所有，如有侵权请联系咕咕行官方删除。</view>
        <!--view class="mt-30">
          <b> - THE  END - </b>
        </view>
        <view class="text-[#959595] mt-30">
          本文章著作权归 <b class="text-[#181818]">{{detail.author}}</b> 所有<br/>
          未经允许，严禁转载，违法必究<br/>
          &copy; By {{new Date().getFullYear()}} 咕咕行
        </view-->
      </view>
    </view>
  </view>
</template>

<script setup>
import {computed, onMounted, ref} from "vue"
import {numberAdd,copyToClip,jumpAppStore,distanceOf,formatedDistance} from "@/utils/utils"
import OpusContentInfo from "./opusContentInfo.vue"
const props = defineProps({
  detail:{
    type:Object,
    default:{},
  },
})

const previewCover = (item)=>{
  if (item.itemType == 2) {
    previewImage(item.content)
  }
  else if (item.itemType == 3) {
    previewMedia(item.content)
  }
}

const previewImage = (url)=>{
  uni.previewImage({
    urls:[url],
    current:url
  })
}

const previewMedia = (url) => {
  let urls = [url]
  uni.navigateTo({url:'/pages/opus/videoplay?url='+encodeURIComponent(url)+'&urls='+encodeURIComponent(JSON.stringify(urls))})
}

onMounted(()=>{
  getGeoLocation()
})

//距离获取
const geo_x = ref(null);
const geo_y = ref(null);
const getGeoLocation = (res) => {
  uni.getLocation({
    type:'gcj02',
    success: function (res) {
      geo_x.value = res.longitude
      geo_y.value = res.latitude
    }
  })
}
const computedLocation = computed({
  get:(x,y) => {
    return function(x,y) { return geo_x.value != null ? '(距您'+formatedDistance(distanceOf({x:x,y:y},{x:geo_x.value,y:geo_y.value}),1)+')' : ''}
  }
})
</script>

<style lang="scss" scoped>
</style>
