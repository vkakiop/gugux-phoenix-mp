<template>
	<view>
		<view class="flex justify-between rounded text-700 p-10 lineView">
			<view class="">头像</view>
			<view>
				<image src="../../static/logo.png" class="w-24 " mode="widthFix" style="border-radius: 50%;"> </image>
			</view>
		</view>

		<view class="flex justify-between border-0 p-10  ">
			<view class="">昵称</view>
			<view>
				等等十三月
			</view>
		</view>
		<view class="flex justify-between mt-20  p-10 lineView">
			<view class="">手机号</view>
			<view>
				<text class="text-blue-500"> 绑定手机号</text>
			</view>
		</view>
		<view class="flex justify-between p-10 lineView">
			<view class="">咕咕号</view>
			<view>
				2311234<text class="text-blue-500"> 复制</text>
			</view>
		</view>
		<view class="flex justify-between  p-10 lineView">
			<view class="">名片</view>
			<view >
				<navigator url="/pages/personCenter/personQRcode">
				<image src="../../static/logo.png" class="w-24 " mode="widthFix" style="border-radius: 50%;"> </image>
				</navigator>
			</view>
		</view>
		<view class="flex justify-between  p-10 lineView">
			<view class="">签名</view>
			<view>
				韦斯特，大本钟，伦敦，议会
			</view>
		</view>
		<view class="flex justify-between p-10 lineView">
			<view class="">性别</view>
			<view>
				保密
			</view>
		</view>
		<view class="flex justify-between  p-10 lineView">
			<view class="">出生日期</view>
			<view>
				未设置
			</view>
		</view>
		<view class="flex justify-between  p-10 lineView">
			<view class="">所在城市</view>
			<view>
				未设置
			</view>
		</view>
		<view>
			<view style="line-height: 100px;text-align: center;" @click="logOff">  退出登录 </view>
		</view>
	</view>
</template>

<script setup>
const logOff = () => {
	uni.showModal({
		// title: '提示',
		content: '确定退出当前状态',
		cancelText: '确定退出',
		confirmText: '在逛一会',
		success: function (res) {
			if (res.confirm) {
				console.log('用户点击确定');
			} else if (res.cancel) {
				console.log('用户点击取消');
				uni.redirectTo({
					url:'/pages/login/logout'
				})
			}
		}
	});
}
</script>

<style lang="scss">
.lineView {
	border-bottom: 0.5px solid #838383;
}
</style>