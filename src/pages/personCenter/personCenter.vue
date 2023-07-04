<template>
	<customNav>
		<view @click="gotoBack" class="ml-3 mt-5"><uni-icons type="back" size="24"></uni-icons></view>
		<view>个人信息</view>
	</customNav>
	<view class="bg-gray-100 content text-17 text-[#272A29]  w-full" style="height: 89vh;">
		<view class="mb-10">
			<view class="flex justify-between  items-center px-15  h-56 border-t-1 border-[#ebebeb]">
				<view class="">头像</view>
				<view class="flex items-center">
					<view class="mr-8" @click="gopicture(pageData.userInfo.icon)">
						<image :src="pageData.userInfo.icon" class="w-40 h-40 rounded-full"> </image>
					</view>
				</view>
			</view>
			<view class="flex justify-between  items-center px-15  h-56 border-t-1 border-[#f1f3f5]">
				<view class="">昵称</view>
				<view class=" flex items-center" @click="dropInput">
					<view class="mr-8">{{ pageData.userInfo.nickname }}</view>
				</view>
			</view>
		</view>
		<view class="mb-10">
			<view class="flex justify-between  items-center  px-15   h-56">
				<view class="">手机号</view>
				<view class=" flex items-center">
					<view class="mr-8"><text> {{ pageData.userInfo.phone }}</text></view>
				</view>
			</view>
			<view class="flex justify-between  items-center pl-15  pr-23 h-56 border-t-1 border-[#f1f3f5]">
				<view class="">咕咕号</view>
				<view class="flex items-center">
					<text>{{ pageData.userInfo.guguId }}</text>
					<text class="text-[#F8CF01]  ml-12" @click="copy(pageData.userInfo.guguId)"> 复制</text>
				</view>
			</view>
		</view>
		<view class="mb-10">
			<view class="flex justify-between items-center px-15   h-56">
				<view class="">签名</view>
				<view class=" flex items-center">
					<view class="mr-8">{{ pageData.userInfo.introduce ? pageData.userInfo.introduce : '未设置' }}</view>
				</view>
			</view>
			<view class="flex justify-between  items-center px-15  h-56 border-t-1 border-[#f1f3f5]">
				<view class="">性别</view>
				<view class=" flex items-center">
					<view class="mr-8">
						<text v-if="pageData.userInfo.sex === 0">保密</text>
						<text v-else-if="pageData.userInfo.sex === 1">男</text>
						<text v-else>女</text>
					</view>
				</view>
			</view>
			<view class="flex justify-between  items-center px-15  h-56 border-t-1 border-[#f1f3f5]">
				<view class="">出生日期</view>
				<view class=" flex items-center">
					<view class="mr-8">{{ pageData.userInfo.birth ? pageData.userInfo.birth : '未设置' }}</view>
				</view>
			</view>
			<view class="flex justify-between  items-center px-15  h-56 border-t-1 border-[#f1f3f5]">
				<view class="">所在城市</view>
				<view class="flex items-center ">
					<view class="mr-8">{{ pageData.userInfo.city ? pageData.userInfo.city : '未设置' }}</view>
					<!-- <view class=""> <uni-icons type="right" size="20"></uni-icons></view> -->
				</view>
			</view>
		</view>
		<view class="h-42 leading-42 text-center">
			<text @click="logOff" style="color: #EC5938;">退出登录</text>
		</view>
		<view>
			<uni-popup ref="popup" background-color="#fff">
				<view class="px-15  py-10">
					<view class="font-bold py-20 text-center ">修改昵称</view>
					<view
						class="flex items-center ml-5  border-dashed border-dashed bg-[#f8fbff]  h-50 w-300 rounded-10 border-2 border-gray-300  text-15 text-[#333]">
						<input v-model="pageData.name" type="nickname" class="ml-15" placeholder="请输入昵称"
							@blur="changeNickName" maxlength="16" minlength="2" @change="changeNickName" />
					</view>
					<view class="flex justify-between text-[#c0c0c0] text-12 ml-5 py-10">
						<view>好名字更容易被记住,2-16个字符</view>
						<view>还可输入{{ 16 - pageData.name.length }}/16</view>
					</view>
					<view class="flex itemx-center justify-evenly mt-20 ">
						<button @click="handlesure"
							class="bg-[#609ef0] text-white w-100 h-38 my-5  rounded-20 text-center leading-38">确认</button>
						<button @click="handleoff"
							class="bg-[#bfc0c3] text-white w-100  h-38 my-5  rounded-20 text-center leading-38">取消</button>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script setup>
import { getUserInfo, infoname } from "@/api/mine/index.js"
import { onLoad, onShow } from "@dcloudio/uni-app";
import { reactive, ref } from 'vue'
const popup = ref()
const dropInput = () => {
	popup.value.open('center')
}
const handlesure = () => {
	infoname({ name: pageData.name, type: 1 }).then(res => {
		fetchData()
		uni.showToast({
			title: '修改成功'
		})
		popup.value.close('center')
		pageData.name = ''
	})
}
const handleoff = () => {
	popup.value.close('center')
	pageData.name = ''
}
const gopicture = (picture) => {
	uni.navigateTo({
		url: `/pages/infopicture/infopicture?picture=${picture}`
	})
}
const pageData = reactive({
	//数据全部列表
	userInfo: {},
	name: ''
})
const changeNickName = (e) => {
	let name = e.detail.value;
	if (name.length === 0) return;
	pageData.name = name
}
onShow(() => {
	fetchData()
})
const fetchData = () => {
	getUserInfo({}).then(res => {
		pageData.userInfo = { ...res.data }
	})
}
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