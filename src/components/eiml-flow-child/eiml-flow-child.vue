<template>
	<view style="padding: 10rpx 5rpx 0rpx 5rpx;">
		<view style="padding: 10rpx;border-radius: 10rpx;background: white;" @click="hanldeToView(item)">
			<view v-if="item.cover.itemType==2">
				<image :src="item.cover.content" mode="widthFix" style="width: 100%;">
				</image>
			</view>
			<view v-if="item.cover.itemType==3" class="relative">
				  <image src="/static/video/视频播放按钮@3x.png" mode="" class="imageStyle"></image>
				<image :src="item.cover.thumbnail" mode="widthFix" style="width: 100%;"></image>
			</view>
			<view class="itemName">
				{{item.author}}
			</view>
			<view class="itemTitle">
				{{item.title}}
			</view>
			<view class="itemPrice">
				{{item.brief}}
			</view>
		</view>
	</view>
</template>

<script setup>
	const props = defineProps({
		item: {
			type: Object,
			default: {}
		}
	})
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
	.itemTitle {
		font-size: 24rpx;
	}

	.itemName {
		font-weight: bold;
		font-size: 30rpx;
	}

	.itemPrice {
		font-size: 30rpx;
		color: red;
	}
</style>