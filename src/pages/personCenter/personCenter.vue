<template>
	<customNav>
		<view @click="gotoBack" class="ml-3 mt-5"><uni-icons type="back" size="24"></uni-icons></view>
		<view>个人信息</view>
	</customNav>
	<view class="bg-gray-100 content text-17 text-[#272A29] h-full">
		<view class="mb-10">
			<view class="flex justify-between  px-10  items-center h-56">
				<view class="">头像</view>
				<view class="flex items-center">
					<view class="mr-8">
						<image :src="pageData.userInfo.icon" class="w-40 h-40 rounded-full"> </image>
					</view>
				</view>
			</view>
			<view class="flex justify-between items-center px-10  h-56">
				<view class="">昵称</view>
				<view class=" flex items-center">
					<view class="mr-8">{{ pageData.userInfo.nickname }}</view>
				</view>
			</view>
		</view>
		<view class="mb-10">
			<view class="flex justify-between  items-center  px-10   h-56">
				<view class="">手机号</view>
				<view class=" flex items-center">
					<view class="mr-8"><text> {{ pageData.userInfo.phone }}</text></view>
				</view>
			</view>
			<view class="flex justify-between  items-center px-10   h-56">
				<view class="">咕咕号</view>
				<view class=" flex items-center">
					{{ pageData.userInfo.guguId }}<text class="text-[#F8CF01] ml-11"
						@click="copy(pageData.userInfo.guguId)"> 复制</text>
				</view>
			</view>
		</view>
		<view class="mb-10">
			<view class="flex justify-between items-center px-10   h-56">
				<view class="">签名</view>
				<view class=" flex items-center">
					<view class="mr-8">{{ pageData.userInfo.introduce ? pageData.userInfo.introduce : '未设置' }}</view>
				</view>
			</view>
			<view class="flex justify-between px-10  h-56  items-center">
				<view class="">性别</view>
				<view class=" flex items-center">
					<view class="mr-8">
						<text v-if="pageData.userInfo.sex === 0">保密</text>
						<text v-else-if="pageData.userInfo.sex === 1">男</text>
						<text v-else>女</text>
					</view>
				</view>
			</view>
			<view class="flex justify-between  px-10   h-56 items-center">
				<view class="">出生日期</view>
				<view class=" flex items-center">
					<view class="mr-8">{{ pageData.userInfo.birth ? pageData.userInfo.birth : '未设置' }}</view>
				</view>
			</view>
			<view class="flex justify-between  px-10   h-56 items-center">
				<view class="">所在城市</view>
				<view class="flex items-center ">
					<view class="mr-8">{{ pageData.userInfo.city ? pageData.userInfo.city : '未设置' }}</view>
					<!-- <view class=""> <uni-icons type="right" size="20"></uni-icons></view> -->
				</view>
			</view>
		</view>
		<view class="h-42 leading-42 text-center ">
			<text @click="logOff" style="color: #EC5938;">退出登录</text>
		</view>
	</view>
</template>

<script setup>
import { getUserInfo } from "@/api/mine/index.js"
import { onLoad } from "@dcloudio/uni-app";
import { ref, reactive } from 'vue'
const pageData = reactive({
	//数据全部列表
	userInfo: {}
})
onLoad(() => {
	getUserInfo({}).then(res => {
		pageData.userInfo = {
			...res.data
		}
	})
})
const skipQRcode = () => {
	uni.navigateTo({
		url: `/pages/personCenter/personQRcode?id=${pageData.userInfo.id}`
	})
}
const gotoBack = () => {
	let pages = getCurrentPages()
	if (pages.length == 1) {
		uni.switchTab({ url: '/pages/index/index' })
	}
	else {
		uni.navigateBack({ delta: 1 })
	}
}
function copy(value) {
	uni.setClipboardData({
		data: value, //要被复制的内容
		success: () => { //复制成功的回调函数
			uni.showToast({ //提示
				title: '复制成功'
			})
		}
	});
}
const logOff = () => {
	uni.showModal({
		title: '提示',
		content: '确定退出当前状态',
		cancelText: '确定退出',
		confirmText: '在逛一会',
		success: function (res) {
			if (res.cancel) {
				uni.redirectTo({
					url: '/pages/login/logout'
				})
			}
		}
	});
}
</script>

<style lang="scss" scoped>
.content>view {
	background-color: #fff;
	color: #272A29;
}
</style>