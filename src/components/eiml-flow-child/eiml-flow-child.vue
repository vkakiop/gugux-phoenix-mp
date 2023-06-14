<template>
	<view style="padding: 10rpx 5rpx 0rpx 5rpx;">
		<view style="padding: 10rpx;border-radius: 10rpx;background: white;" @click="hanldeToView(item)">
			<view v-if="item.cover.itemType==2">
				<image :src="item.cover.content" mode="widthFix" style="width: 100%;">
				</image>
			</view>
			<view v-if="item.cover.itemType==3" class="relative">
				  <image src="/static/video/videoplay.png" mode="" class="imageStyle"></image>
				<image :src="item.cover.thumbnail" mode="widthFix" style="width: 100%;"></image>
			</view>
			<view  class="bg-[rgba(0,0,0,0.5)] absolute left-5 bottom-5 px-10 text-white text-12 rounded">
			  <uni-icons type="location-filled" size="16"></uni-icons>{{item.cover.name}} 
			</view>
			<view class="titleSty">
				{{item.title}}
			</view>
			<view class="flex justify-between textStyle items-center h-30">
				<view class="">	{{item.author}}</view>
				<view class="">	<image src="/static/waterfalls/like.png"  class="w-13 h-13"></image>
				{{item.likeNum}}</view>
			</view>

		</view>
	</view>
</template>

<script setup>
	import { distanceOf,formatedDistance } from "@/utils/utils"
import { computed } from 'vue';
	const props = defineProps({
		item: {
			type: Object,
			default: {}
		}
	})
	// const computedLocation = computed({
	//   get:(x,y) => {
	//     return function(x,y) { return x != null ? '(距您'+formatedDistance(distanceOf({x:x,y:y},{x:props.geo_x,y:props.geo_y}),1)+')' : ''}
	//   }
	// })
	const hanldeToView = (item) => {
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

<style scoped lang="scss">
	.imageStyle{
		position: absolute;
		top: 50%;
		left: 50%;
		width: 64rpx;
		height: 64rpx;
		margin-left: -32rpx;
		margin-top: -32rpx;
		z-index: 99;
	}
	.textStyle{
		vertical-align: top;
		line-height: 24rpx;
		font-size: 25rpx;
		font-family: Source Han Sans SC;
		font-weight: 300;
		color: #999999;
		image{
			vertical-align: top;
		}
	}
	.titleSty{
		overflow-x: hidden;
		width: 324rpx;
		height: 80rpx;
		font-size: 26rpx;
		font-family: Source Han Sans SC;
		font-weight: 400;
		color: #272A29;
		line-height: 40rpx;
	}
</style>