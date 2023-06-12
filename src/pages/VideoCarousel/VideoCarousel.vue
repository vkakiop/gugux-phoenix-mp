<template>
	<view v-if="pageData.lastVideoId">
		<dt-video :lastVideoId="pageData.lastVideoId" />
	</view>
</template>

<script setup>
	import {
		reactive,ref
	} from "vue";
	import dtVideo from "../../components/index/dtVideo.vue"
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app"
	const pageData=reactive({
		lastVideoId:''
	})
	onLoad((option) => {
		// console.log(option.id);
		pageData.lastVideoId=option.id
		// postVideorecommend({
		// 	"lastVideoId": option.id
		// }).then(res => {
		// 	let arr = []
		// 	res.data.forEach(item => {
		// 		let obj = {}
		// 		obj.title = item.author
		// 		obj.desc = item.introduce
		// 		obj.src = item.cover.content
		// 		arr.push(obj)
		// 	})
		// 	videos.value = [...arr]
		// })
	})
</script>


<style>

</style>