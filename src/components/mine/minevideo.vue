<template>
	<view @click="handleVideo(0)" class="w-screen h-screen relative" v-if="pageData.opusdetail.cover">
		<video autoplay class="w-screen h-screen fixed" id='video0' :src="pageData.opusdetail.cover.content" loop
			:controls="true" :show-center-play-btn="true" :show-play-btn="false" :show-fullscreen-btn="false"
			@error="videoErrorCallback">
		</video>
		<view v-if="pageData.status == 1" class="icon_play w-full h-full fixed w-50 h-50">
			<image class="w-64 h-64" src="@/static/opus/icon_play.png" />
		</view>
		<view class="info w-275 pl-16">
			<view v-if="pageData.opusdetail.cover.name"
				class=" text-13 mb-15 rounded-9 w-180  h-19 flex items-center justify-center"
				style="background-color: rgba(244, 244, 244, 0.2);">
				<image src="@/static/opus/icon_location_white.png" class="w-9 h-11 mr-4" />
				{{ pageData.opusdetail.cover.name }}
			</view>
			<view class="font-bold h-17 leading-16 text-17 flex items-center">@{{ pageData.opusdetail.author }}
				<image src="/static/mine/shop.png" class="w-19 h-19 ml-4" v-if="pageData.opusdetail.hasShop" />
				<image src="/static/mine/vip.png" class="w-49 h-19 ml-4" v-if="pageData.opusdetail.isDr" />
			</view>
			<view class="text-14 leading-16 my-11">发布于：{{ pageData.opusdetail.createdTime }}</view>
			<view class="text-16 leading-25 flex items-center">
				<image src="/static/video/good.png" class="w-19 h-19 mr-4" v-if="pageData.opusdetail.boutique" />{{
					pageData.opusdetail.brief }}
			</view>
		</view>
		<view class="buttons text-sm">
			<debounce class="header_group">
				<image class="header" :src="pageData.opusdetail.icon" @click="gohomepage(pageData.opusdetail)"></image>
				<view class="add" v-if="!pageData.opusdetail.isFollow">
					<image src="@/static/video/attention.png" class="w-19 h-19"
						@click.stop="attention(pageData.opusdetail)"></image>
				</view>
			</debounce>
			<debounce @debounce="like(pageData.opusdetail)" class="button mb-10">
				<image v-if="pageData.opusdetail.isLike" class="w-36 h-36" src="@/static/video/likefill.png" />
				<image v-else class="w-36 h-36" src="@/static/video/like.png" />
				<view>{{ computedNumber(pageData.opusdetail.likeNum) }}</view>
			</debounce>
			<debounce @debounce="openBox(pageData.opusdetail)" class="button mb-10">
				<image class="w-36 h-36" src="@/static/video/evaluate.png" />
				<view>{{ computedNumber(pageData.opusdetail.commentNum) }}</view>
			</debounce>
			<debounce @debounce="collection(pageData.opusdetail)" class="button mb-10">
				<view class="button mb-10">
					<image v-if="pageData.opusdetail.isCollection" class="w-36 h-36" src="@/static/video/collectfill.png" />
					<image v-else class="w-36 h-36" src="@/static/video/collect.png" />
					<view>{{ computedNumber(pageData.opusdetail.collectionNum) }}</view>
				</view>
			</debounce>
			<view class="button mb-10" @click='handleShare'>
				<button open-type="share" style="background-color: transparent;">
					<image class="w-36 h-36" src="@/static/video/share.png" />
				</button>
			</view>
		</view>
		<u-popup :show="pageData.show" @close="pageData.show = false; fetchData()">
			<view class="container">
				<comment ref="commentRef" :id="pageData.opusdetail.id" :articleType="2"></comment>
			</view>
			<view
				class="flex items-center ml-14  mb-14 bg-[#f5f6f8]  h-39 w-350 rounded-19 border-1 border-[#E3E3E3] text-14"
				@click="open">
				<icon type="search" size="11" class="mx-10" />
				<input class="bg-[#f5f6f8]" placeholder="说点什么..." type="text" disabled />
			</view>
		</u-popup>
		<loginPop :isShow="pageData.isShowLoginPop" @close="pageData.isShowLoginPop = false"></loginPop>
	</view>
	<view v-else class="w-screen h-screen flex justify-center items-center">
		<u-empty mode="data" text="获取视频失败" icon="/static/img/nodata.png" />
	</view>
</template>

<script setup>
import comment from "@/components/common/comment.vue"
import { opusdetails } from "@/api/mine/index"
import { getTokenValue } from "@/utils/utils"
import { opusCollect, opusLike, userFans } from "@/api/opus/index"
import { getCurrentInstance, reactive, ref, computed } from 'vue'
import useLoginTokenStore from '@/store/modules/loginToken'
import { onLoad } from '@dcloudio/uni-app'
const computedNumber = computed({
	get: (num) => { return function (num) { return num > 9999 ? (num / 10000).toFixed(1) + 'w' : num } }
})
const isShare = ref(false)
const pageData = reactive({
	id: '',
	traceInfo: '',
	opusdetail: {},
	status: 0, //0播放 1暂停
})
const { ctx } = getCurrentInstance()
const commentRef = ref();
const open = () => {
	commentRef.value.init(true);
}
onLoad((option) => {
	pageData.id = option.id
	pageData.traceInfo = option.traceInfo
	fetchData()
})
const fetchData = () => {
	if (!isShare.value) {
		opusdetails({
			opusId: pageData.id
		}).then(res => {
			pageData.opusdetail = res.data
		})
	}
}
const gohomepage = (item) => {
	if (useLoginTokenStore().get().user) {
		if (item.createdBy == useLoginTokenStore().get().user.id) {
			uni.switchTab({
				url: '/pages/mine/mine'
			})
			return
		}
	}
	uni.navigateTo({
		url: '/pages/userhomepage/userhomepage?id=' + item.createdBy
	})

}
const playVideo = () => {
	let currentId = 'video0'; // 获取当前视频id
	uni.createVideoContext(currentId, ctx).play();
	pageData.status = 0;
}
//点击视频播放或者暂停
const handleVideo = (index) => {
	let currentId = 'video' + index
	if (pageData.status == 1) {
		uni.createVideoContext(currentId, ctx).play()
		pageData.status = 0
	} else {
		uni.createVideoContext(currentId, ctx).pause()
		pageData.status = 1
	}
}
const videoErrorCallback = () => {
	uni.showToast({
		title: '视频播放错误',
		icon: 'none',
		duration: 2000
	});
}
//关注
const attention = (item) => {
	userFans({
		id: item.createdBy
	}).then(res => {
		item.isFollow = true
		uni.showToast({
			title: '关注成功',
			icon: 'none',
			duration: 2000
		})
	})
}
//收藏
const collection = (item) => {
	let action = item.isCollection ? 0 : 1
	if (getTokenValue()) {
		opusCollect({ opusId: item.id, action: action }, { trackInfo: pageData.traceInfo }).then(res => {
			if (action) {
				item.isCollection = true
				item.collectionNum++
			} else {
				item.isCollection = false
				if (item.collectionNum > 0) {
					item.collectionNum--
				}
			}
			uni.showToast({
				title: (action ? '' : '取消') + '收藏成功',
				icon: 'none',
				duration: 2000
			})
		})
	} else {
		pageData.isShowLoginPop = true
		isShare.value = false
	}
}
//点赞
const like = (item) => {
	let action = item.isLike ? 0 : 1
	if (getTokenValue()) {
		opusLike({ opusId: item.id, action: action }, { trackInfo: pageData.traceInfo }).then(res => {
			if (action) {
				item.isLike = true
				item.likeNum++
			} else {
				item.isLike = false
				if (item.likeNum > 0) {
					item.likeNum--
				}
			}
			uni.showToast({
				title: (action ? '' : '取消') + '点赞成功',
				icon: 'none',
				duration: 2000
			})
		})
	} else {
		pageData.isShowLoginPop = true
		isShare.value = false
	}
}
const openBox = (item) => {
	pageData.show = true;
}
//分享
const onShareAppMessage = () => {
	return {
		title: pageData.opusdetail.brief,
		path: '/pages/opus/index?id=' + pageData.opusdetail.id,
		imageUrl: pageData.opusdetail.thumbnail
	}
}

const handleShare = () => {
	isShare.value = true
	uni.createVideoContext('video0', ctx).pause()
	pageData.status = 1
}
const onShareTimeline = () => {
	return onShareAppMessage()
}
</script>

<style lang="scss" scoped>
.icon_play {
	top: calc(50% - 64rpx);
	left: calc(50% - 64rpx);
}


.info {
	z-index: 1;
	position: absolute;
	bottom: 140upx;
	color: white;
}

.buttons {
	display: flex;
	flex-direction: column;
	position: fixed;
	right: 0vw;
	bottom: 140upx;
	color: white;
	text-align: center;
	justify-content: center;
	z-index: 999;

	.header_group {
		margin-bottom: 70upx;
		height: 90upx;
		width: 90upx;
		position: relative;

		.header {
			border: 2px solid white;
			margin: 0 auto;
			border-radius: 90upx;
			height: 90upx;
			width: 90upx;
			position: relative;
			left: 18rpx;
		}

		.add {
			position: absolute;
			bottom: -37upx;
			left: 46upx;
			width: 50upx;
			height: 50upx;
			line-height: 50upx;
		}
	}

	.button {
		text-align: center;
	}
}
</style>