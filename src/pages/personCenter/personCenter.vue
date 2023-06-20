<template>
	<view class="bg-gray-100 content text-17 ">
		<view class="mb-10">
			<view class="flex justify-between text-700 p-10  items-center">
				<view class="">头像</view>
				<view class="flex items-center">
					<view class="mr-8">
						<image :src="pageData.userInfo.icon" class="w-40 h-40 rounded-full"> </image>
					</view>
					<!-- 	<view class=""> <uni-icons type="right" size="20"></uni-icons></view> -->
				</view>
			</view>
			<view class="flex justify-between border-0 p-10  ">
				<view class="">昵称</view>
				<view class="text-14 text-[#999] font-light flex items-center">
					<view class="mr-8">{{ pageData.userInfo.nickname }}</view>
					<!-- <view class=""> <uni-icons type="right" size="20"></uni-icons></view> -->

				</view>
			</view>
		</view>
		<view class="mb-10">
			<view class="flex justify-between   p-10 ">
				<view class="">手机号</view>
				<view class="text-14 text-[#999] font-light flex items-center">
					<view class="mr-8"><text> {{ pageData.userInfo.phone }}</text></view>
					<!-- <view class=""> <uni-icons type="right" size="20"></uni-icons></view> -->
				</view>
			</view>
			<view class="flex justify-between p-10 ">
				<view class="">咕咕号</view>
				<view class="text-14 text-[#999] font-light">
					{{ pageData.userInfo.guguId }}<text class="text-[#F8CF01] ml-11"
						@click="copy(pageData.userInfo.guguId)"> 复制</text>
				</view>
			</view>
			<!-- <view class="flex justify-between p-10 ">
				<view class="">邀请码</view>
				<view class="text-14 text-[#999] font-light flex items-center">
					<view class="mr-8">{{pageData.userInfo.inviteGuguid}}暂无</view>
					<view class=""> <uni-icons type="right" size="20"></uni-icons></view>
				</view>
			</view> -->
			<view class="flex justify-between  p-10 ">
				<view class="">签名</view>
				<view class="text-14 text-[#999] font-light flex items-center">
					<view class="mr-8">{{ pageData.userInfo.introduce ? pageData.userInfo.introduce : '未设置' }}</view>
					<!-- <view class=""> <uni-icons type="right" size="20"></uni-icons></view> -->
				</view>
			</view>
			<view class="flex justify-between p-10 ">
				<view class="">性别</view>
				<view class="text-14 text-[#999] font-light flex items-center">
					<view class="mr-8">
						<text v-if="pageData.userInfo.sex === 0">保密</text>
						<text v-else-if="pageData.userInfo.sex === 1">男</text>
						<text v-else>女</text>
					</view>
					<!-- <view class=""> <uni-icons type="right" size="20"></uni-icons></view> -->
				</view>
			</view>
			<view class="flex justify-between  p-10 ">
				<view class="">出生日期</view>
				<view class="text-14 text-[#999] font-light flex items-center">
					<view class="mr-8">{{ pageData.userInfo.birth ? pageData.userInfo.birth : '未设置' }}</view>
					<!-- <view class=""> <uni-icons type="right" size="20"></uni-icons></view> -->
				</view>
			</view>
			<view class="flex justify-between  p-10 ">
				<view class="">所在城市</view>
				<view class="text-14 text-[#999] font-light flex items-center ">
					<view class="mr-8">{{ pageData.userInfo.city ? pageData.userInfo.city : '未设置' }}</view>
					<!-- <view class=""> <uni-icons type="right" size="20"></uni-icons></view> -->
				</view>
			</view>
			<!-- 	<view class="flex justify-between text-700 px-10 pb-10  items-center">
				<view class="">名片</view>
				<view class="flex items-center">
					<view class="mr-8">
						<image :src="pageData.userInfo.card" class="w-40 h-40 rounded-full"> </image>
					</view>
					<view class="" @click="skipQRcode"> <uni-icons type="right" size="20"></uni-icons></view>
				</view>
			</view> -->
		</view>
		<view>
			<view style="line-height: 100px;text-align: center;" @click="logOff"> 退出登录 </view>
		</view>
	</view>
</template>

<script setup>
import {getUserInfo} from "@/api/mine/index.js"
import {onLoad} from "@dcloudio/uni-app";
import {ref,reactive} from 'vue'
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
const popup = ref()
const skipQRcode = () => {
	uni.navigateTo({
		url: `/pages/personCenter/personQRcode?id=${pageData.userInfo.id}`
	})
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