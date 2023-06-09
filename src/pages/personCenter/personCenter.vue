<template>
	<view>
		<view class="flex justify-between text-700 p-10 lineView items-center">
			<view class="">头像</view>
			<view>
				<image :src="pageData.userInfo.cover" class="w-60 rounded" mode="widthFix" style="border-radius: 50%;"> </image>
			</view>
		</view>

		<view class="flex justify-between border-0 p-10  ">
			<view class="">昵称</view>
			<view>
				{{ pageData.userInfo.nickname }}
			</view>
		</view>
		<view class="flex justify-between mt-20  p-10 lineView">
			<view class="">手机号</view>
			<view>
				<text class="text-blue-500"> {{pageData.userInfo.phone  }}</text>
			</view>
		</view>
		<view class="flex justify-between p-10 lineView">
			<view class="">咕咕号</view>
			<view>
				{{ pageData.userInfo.guguId }}<text class="text-blue-500" @click="copy(pageData.userInfo.guguId)"> 复制</text>
			</view>
		</view>
		<view class="flex justify-between  p-10 lineView">
			<view class="">名片</view>
			<view  @click="skipQRcode">
				<image :src="pageData.userInfo.icon" class="w-24 " mode="widthFix" style="border-radius: 50%;"> </image>
			</view>
		</view>
		<view class="flex justify-between  p-10 lineView">
			<view class="">签名</view>
			<view>
				{{pageData.userInfo.introduce}}
			</view>
		</view>
		<view class="flex justify-between p-10 lineView">
			<view class="">性别</view>
			<view>
				<text v-if="pageData.userInfo.sex===0">未知</text>
				<text v-else-if="pageData.userInfo.sex===1">男</text>
				<text v-else>女</text>
			</view>
		</view>
		<view class="flex justify-between  p-10 lineView">
			<view class="">出生日期</view>
			<view>
				{{pageData.userInfo.birth?pageData.userInfo.city:'未知'}}
			</view>
		</view>
		<view class="flex justify-between  p-10 lineView">
			<view class="">所在城市</view>
			<view>
				{{pageData.userInfo.city?pageData.userInfo.city:'未知'}}
			</view>
		</view>
		<view>
			<view style="line-height: 100px;text-align: center;" @click="logOff">  退出登录 </view>
		</view>
	</view>
</template>

<script setup>
import { getUserBase } from "@/api/mine/index.js"
import { onLoad } from "@dcloudio/uni-app";
import {ref,reactive} from 'vue'
const pageData = reactive({
		//数据全部列表
		userInfo: {}
	})
onLoad(()=>{
	getUserBase({}).then(res=>{
		pageData.userInfo={...res.data}
	})

})
const skipQRcode=()=>{
	uni.navigateTo({
		url:`/pages/personCenter/personQRcode?id=${pageData.userInfo.id}`
	})
}
const copyText=ref('我是复制的文本111')
function copy(value) {
  uni.setClipboardData({
    data: value,//要被复制的内容
    success: () => {//复制成功的回调函数
      uni.showToast({//提示
        title: '复制成功'
      })
    }
  });
}
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