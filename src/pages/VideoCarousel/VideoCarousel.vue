<template>
	<view v-if="pageData.lastVideoId">
		<dt-video :lastVideoId="pageData.lastVideoId" />
	</view>
</template>

<script setup>
import { reactive, ref } from "vue";
import dtVideo from "../../components/index/dtVideo.vue"
import { onShow, onLoad } from "@dcloudio/uni-app"
const pageData = reactive({
	lastVideoId: ''
})
onLoad((option) => {
	pageData.lastVideoId = option.id
})
</script>


<style></style>