<template>
	<view v-if="pageData.lastVideoId">
		<dt-video :lastVideoId="pageData.lastVideoId" :opusid="pageData.id"  :traceInfo="pageData.traceInfo"  />
	</view>
</template>

<script setup>
import { reactive} from "vue";
import dtVideo from "../../components/index/dtVideo.vue"
import { onLoad } from "@dcloudio/uni-app"
const pageData = reactive({
	lastVideoId: '',
	id: '',
	traceInfo:'',
})
onLoad((option) => {
	pageData.lastVideoId = option.id
	pageData.id = option.id
	pageData.traceInfo=option.traceInfo
})
</script>


<style></style>