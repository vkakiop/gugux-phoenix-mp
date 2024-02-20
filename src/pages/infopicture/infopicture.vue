<template>
	<customNav>
		<view @click="gotoBack" class="ml-3 mt-5"><uni-icons type="back" size="24"></uni-icons></view>
		<view>头像</view>
		<button :class="['flex-none', 'mt-5','ml-20', 'mr-5', 'w-80', 'h-26', 'leading-26', 'rounded-full', 'text-12','bg-[#f8cf01]']"
			open-type="chooseAvatar" @chooseavatar="onChooseAvatar">更换头像</button>
	</customNav>
	<view class="bg-black flex items-center h-screen w-screen" >
		<image  :src="pageData.avatarUrl" mode="widthFix" class="w-full fixed -mt-80">
		</image>
	</view>
  <ws-wx-privacy id="privacy-popup"></ws-wx-privacy>
</template>

<script setup>
import { infopicture } from "@/api/mine/index.js"
import { getTokenValue } from '@/utils/utils'
import { onLoad } from "@dcloudio/uni-app";
import { reactive, ref } from 'vue'
const pageData = reactive({
	avatarUrl: ''
})
onLoad(option => {
	pageData.avatarUrl = option.picture
})
const onChooseAvatar = (e) => {
	pageData.avatarUrl = e.detail.avatarUrl
	let baseUrl = import.meta.env.VITE_APP_BASE_API
	let token = getTokenValue()
	uni.uploadFile({
		url: baseUrl + '/gugux-services-poly-api/app/file/upload',
		filePath: pageData.avatarUrl,
		name: 'file',
		formData: {},
		header: {
			token: token
		},
		success: (res) => {
			let data = JSON.parse(res.data)
			if (data.status == 1) {
				infopicture({ picture: data.data, type: 1 }).then(res => {
					uni.showToast({
						title: '修改成功'
					})
					setTimeout(()=>{gotoBack()},500)	
				})
			}
			else {
				uni.showToast({
					title: '上传失败'
				})
			}

		}
	});
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
</script>

<style lang="scss"></style>
