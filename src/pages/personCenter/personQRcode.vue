<template>
	<view style="background-color: blue ;width: 100vw;height: 100vh" class="flex justify-center a">
		<view class="codeSty">
			<view class="flex flex-col  justify-center items-center">
				<view><u-avatar :src="src" size="60"></u-avatar></view>
				<view class="nickname">等等十三月</view>
				<view class="guguID">咕咕号:11123214</view>
			</view>
			<w-qrcode ref="qrcode" :options="options" @press="longtap" class="codeguguSTy"></w-qrcode>
			<view class="qdText">扫描上面的二维码图案，加我咕咕号</view>
			<view class="m-20">
				<image src="/static/logo.png" mode="heightFix" style="width: 167rpx;height: 167rpx;"></image>
			</view>
			<view class="flex justify-between mt-10">
				<button class="btnStyle1">保存图片</button>
				<button class="btnStyle2" open-type="share">分享</button>
			</view>
		</view>

	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad,
		onShareAppMessage,
		onShareTimeline
	} from "@dcloudio/uni-app"
	//二维码
	const codeId = ref('')
	onLoad((option) => {
		console.log('跳转到二维码页面携带的id:' + option.id);
		codeId.value = option.id
	})
	const options = ref({
		code: '这是你生成二维码的值', // 生成二维码的值
		size: 460, // 460代表生成的二维码的宽高均为460rpx
		img: { // 二维码log配置 非必传
			src: '/static/logo.png', // 图片地址
			size: 60, // 图片大小
			degree: 15, // 圆角大小 如果type为round生效
			type: 'round', //图片展示类型 默认none 可选值  round圆角  circle圆 如果为round 可以传入degree设置圆角大小 默认 5
			color: '#ffffff', //图片周围的白色边框
			width: 8 //图片周围白色边框的宽度 默认5
		},
	})
	// 分享到微信好友
	onShareAppMessage(() => {
		return {
			title: '分享二维码',
			path: `/pages/personCenter/personQRcode?id=${codeId.value}`,
			desc: '分享描述',
			imageUrl: "../../static/logo.png",
		}
	})
	// 2. 分享到朋友圈
	onShareTimeline(() => {
		return {
			title: '标题',
			path: '/pages/index/index',
			desc: '分享描述',
			imageUrl: "../../static/logo.png",
		}
	})
</script>

<style lang="scss" scoped>
	.nickname {
		width: 201rpx;
		height: 38rpx;
		font-size: 40rpx;
		font-weight: bold;
		color: #272A29;
		line-height: 23rpx;
	}

	.guguID {
		width: 212rpx;
		height: 26rpx;
		font-size: 27rpx;
		font-weight: 300;
		color: #666666;
		line-height: 23rpx;
	}

	.codeSty {
		width: 638rpx;
		height: 832rpx;
		background: #FFFFFF;
		border: 6px solid #FFFFFF;
		border-radius: 14rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: absolute;
		top: 10%;
		margin: 0 auto;
	}

	.btnStyle1 {
		width: 246rpx;
		height: 85rpx;
		text-align: center;
		line-height: 85rpx;
		background: #272A29;
		border-radius: 43rpx;
		color: #F8CF01;
	}

	.btnStyle2 {
		width: 371rpx;
		height: 85rpx;
		text-align: center;
		line-height: 85rpx;
		background: #F8CF01;
		color: #272A29;
		border-radius: 43rpx;
	}

	.codeguguSTy {
		width: 638rpx;
		height: 832rpx;
		background: #FFFFFF;
		border: 6px solid #FFFFFF;
		border-radius: 14rpx;
	}

	.qdText {
		width: 455rpx;
		height: 26rpx;
		font-size: 27rpx;
		font-family: Source Han Sans SC;
		font-weight: 300;
		color: #929292;
	}
</style>