<template>
	<view class="content">
		页面 - 1
	</view>
</template>

<script setup>
	var h = uni.getSystemInfoSync().statusBarHeight;
		console.log('Statusbar Height: '+h);

</script>

<style>
.content {
	text-align: center;
	height: 400upx;
	margin-top: 200upx;
}
</style>
