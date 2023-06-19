<template>
	<view class="w-172 bg-[#fff] rounded-5" v-if="item && item.cover">
		<view class="relative rounded-5">
			<view v-if="isVirtualCal" :style="{width:'100%',height:computedHeight(item.cover.width,item.cover.height)+'rpx'}" class="rounded-5"></view>
			<image v-else :src="imageThumb(item.cover.itemType == 2 ? item.cover.content : item.cover.thumbnail,400,400)" :style="{width:'100%',height:computedHeight(item.cover.width,item.cover.height)+'rpx'}" @click="godetail(item)" class="rounded-5"></image>
			<image v-if="item.cover.itemType==3" src="/static/video/videoplay.png" mode="" class="absolute w-36 h-36 top-[50%] left-[50%] -ml-18 -mt-18 z-50" @click="godetail(item)"></image>
			<view v-if="item.cover.itemType==2&&item.cover.name" class="absolute  bottom-10 z-40  px-10 text-white text-12 rounded mb-11">
				<image src="@/static/opus/icon_location_white.png" class="w-9 h-11 -mt-2 align-middle"></image> {{item.cover.name}}{{computedLocation(item.cover.x,item.cover.y)}}
			</view>
		</view>
		<view class=" line-clamp-2 text-14 font-bold text-[#272A29] leading-20 px-4">
			<view class="">{{item.title}}</view>
		</view>
		<view class="flex justify-between  text-13 items-center h-30  font-light text-[#999]  px-4">
			<view class="flex items-center" @click="gohomepage(item)">
				<image :src="item.icon" class="w-16 h-16 rounded-full"></image>{{item.author}}
			</view>
			<view class="" @click="like(item)">
				<image src="/static/waterfalls/like.png" class="w-13 h-12" v-if="!item.isLike"></image>
				<image src="/static/waterfalls/likefill.png" class="w-13 h-12" v-if="item.isLike"></image>
				{{item.likeNum}}
			</view>
		</view>
	</view>
	<view class="h-14"></view>
		<loginPop :isShow="pageData.isShowLoginPop" @close="pageData.isShowLoginPop = false"></loginPop>
</template>

<script setup>
import { opusLike } from "@/api/opus/index"
import {distanceOf,formatedDistance,getTokenValue,imageThumb} from "@/utils/utils"
import {computed,ref,onMounted,reactive} from 'vue';
const pageData = reactive({
  id: '',
  isShowLoginPop: false,
})
const props = defineProps(['item', 'isVirtualCal','itemKey'])
const computedHeight = computed({
  get: (w, h) => {
    return function(w, h) {
      return w <= 0 ? 344 : h * (344 / w)
    }
  }
})
const gohomepage=(item)=>{
  uni.navigateTo({
    url:'/pages/userhomepage/userhomepage?id='+item.createdBy
  })
}
const godetail = (item) => {
  if (item.cover.itemType == 2) {
    uni.navigateTo({
      url: `/pages/opus/index?id=${item.id}`
    })
  } else if (item.cover.itemType == 3) {
    if(props["itemKey"]=='mine'){
      uni.navigateTo({
        url: `/components/mine/minevideo?id=${item.id}`
      })
    }else{
      uni.navigateTo({
        url: `/pages/VideoCarousel/VideoCarousel?id=${item.id}`
      })
    }
  }
}
//距离获取
const geo_x = ref(null);
const geo_y = ref(null);
const getGeoLocation = (res) => {
  uni.getLocation({
    type: 'gcj02',
    success: function(res) {
      geo_x.value = res.longitude
      geo_y.value = res.latitude
    }
  })
}
onMounted(() => {
  getGeoLocation()
})
//点赞
const like = (item) => {
  let action = item.isLike ? 0 : 1
  if (getTokenValue()) {
    opusLike({
      opusId: item.id,
      action: action
    }).then(res => {
      if (action) {
        item.isLike = true
        item.likeNum++
      } else {
        item.isLike = false
        if (item.likeNum > 0) {
          item.likeNum--
        }
      }
      uni.showToast({
        title: (action ? '' : '取消') + '点赞成功',
        icon: 'none',
        duration: 2000
      })
    })
  } else {
    pageData.isShowLoginPop = true
  }
}
const computedLocation = computed({
  get: (x, y) => {
    return function(x, y) {
      return geo_x.value != null ? '(距您' + formatedDistance(distanceOf({
        x: x,
        y: y
      }, {
        x: geo_x.value,
        y: geo_y.value
      }), 1) + ')' : ''
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
