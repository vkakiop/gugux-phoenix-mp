<template>
	<view>
		<view class="codeSty">
			<view class="flex">
				<view class="my-20 "><u-avatar :src="src" size="60"></u-avatar></view>
				<view class="flex flex-col  justify-center">
					<view class="p-2 ml-10">等等十三月</view>
					<view class="p-2 ml-10">咕咕号:11123214</view>
				</view>
			</view>
			<w-qrcode ref="qrcode" :options="options" @press="longtap"></w-qrcode>
			<view class="m-20">扫描上面的二维码图案，加我咕咕号</view>
			<view class="m-20">
				<image src="/static/logo.png" mode="heightFix" class="h-40"></image>
			</view>
			<view class="flex justify-evenly mt-50">
				<button class="mb-25 mx-20 h-40  w-150 leading-40 rounded-full bg-[#4ba1f8] text-white active-[#838383]"
					plain>保存图片</button>
				<button class="mb-25 h-40 w-150  leading-40 rounded-full bg-[#4ba1f8] text-white"
					open-type="share">分享</button>
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
const codeId=ref('')
onLoad((option)=>{
 console.log('跳转到二维码页面携带的id:'+option.id);
 codeId.value=option.id
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
.codeSty {
	width: 96%;
	margin: auto;
	height: 1000rpx;
	background-color: green;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: absolute;
	top: 10%;
	margin-left: 2%;
}
</style>