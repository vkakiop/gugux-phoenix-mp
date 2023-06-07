<template>
	<view v-if="videos.length>0">
		<dt-video :list="videos" />
	</view>
</template>

<script setup>
	import {
		reactive,ref
	} from "vue";
	import {
		postVideorecommend
	} from "../../api/workList/work.js"
	import dtVideo from "../../components/index/dtVideo.vue"
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app"
	/* 	let videos = reactive([{
				title: '中国财富网11111',
				desc: "1111白酒板块又又又涨了!!!",
				src: 'https://media.caigetuxun.com/multi/article_video/1241697310384073000/248922853451524.mp4'
			},
			{
				title: '中国财富网22222',
				desc: "222白酒板块又又又涨了!!!",
				src: 'https://media.caigetuxun.com/multi/article_video/1241697310384073000/248922853451524.mp4'
			}, {
				title: '中国财富网3333',
				desc: "333白酒板块又又又涨了!!!",
				src: 'https://media.caigetuxun.com/multi/article_video/1241697310384073000/248922853451524.mp4'
			},
		]) */
	let videos = ref([])
	onLoad((option) => {
		console.log(option.id);
		postVideorecommend({
			"lastVideoId": option.id
		}).then(res => {
			let arr = []
			res.data.forEach(item => {
				let obj = {}
				obj.title = item.author
				obj.desc = item.introduce
				obj.src = item.cover.content
				arr.push(obj)
			})
			videos.value = [...arr]
		})
	})
</script>


<style>

</style>