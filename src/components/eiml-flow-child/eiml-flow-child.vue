<template>
	<view style="padding: 10rpx 5rpx 0rpx 5rpx;">
		<view style="padding: 10rpx;border-radius: 10rpx;background: white;">
			<image :src="item.img" mode="widthFix" style="width: 100%;"></image>
			<view class="itemName">
				{{item.name}}
			</view>
			<view class="itemTitle">
				{{item.title}}
			</view>
			<view class="itemPrice">
				{{item.price}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:["item"],
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

	.itemTitle{
		font-size: 24rpx;
	}
	.itemName{
		font-weight: bold;
		font-size: 30rpx;
	}
	.itemPrice{
		font-size: 30rpx;
		color: red;
	}
</style>
