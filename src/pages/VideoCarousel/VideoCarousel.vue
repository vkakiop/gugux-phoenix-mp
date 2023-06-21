<template>
	<view v-if="pageData.lastVideoId">
		<dt-video :lastVideoId="pageData.lastVideoId" :opusid="pageData.id" />
	</view>
</template>

<script setup>
import { reactive, ref } from "vue";
import dtVideo from "../../components/index/dtVideo.vue"
import { onShow, onLoad } from "@dcloudio/uni-app"
const pageData = reactive({
	lastVideoId: '',
	id: ''
})
onLoad((option) => {
	pageData.lastVideoId = option.id
	pageData.id = option.id
})
</script>


<style></style>