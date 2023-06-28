<template>
	<view class="bg-black">
		<swiper class="swiper w-screen h-screen" vertical :current="pageData.current" :interval="2000" :duration="600"
			@animationfinish="animationfinish" @change="handleChange" :circular="false">
			<swiper-item v-for="(item, index) in pageData.list" :key="index">
				<view v-if="index == pageData.current" @click="handleVideo(index)" class="w-screen h-screen">
					<video autoplay class="w-screen h-screen fixed" :id="'video' + index" :src="item.cover.content" loop
						:controls="true" :show-center-play-btn="true" :show-play-btn="false" :show-fullscreen-btn="false"
						@error="videoErrorCallback">
					</video>
					<view v-if="pageData.status == 1" class="icon_play w-full h-full absolute w-50 h-50">
						<image class="w-64 h-64" src="@/static/opus/icon_play.png" />
					</view>
					<view class="info w-275 pl-14">
						<view v-if="item.cover.name"
							class="flex items-center text-13 mb-15 rounded-9 w-180 justify-center  h-19 "
							style="background-color: rgba(244, 244, 244, 0.2);">
							<image src="@/static/opus/icon_location_white.png" class="w-9 h-11 mr-4" />
							{{item.cover.name }}
						</view>
						<view class="font-bold h-17 leading-16 text-17 flex items-center">@{{ item.author }}
							<image src="/static/mine/shop.png" class="w-19 h-19 ml-4" v-if="item.hasShop" />
							<image src="/static/mine/vip.png" class="w-49 h-19 ml-4" v-if="item.isDr" />
						</view>
						<view class="text-14 leading-16 my-11">发布于：{{ item.createdTime }}</view>
						<view class="text-16 leading-25 flex items-center">
							<image src="/static/video/good.png" class="w-19 h-19 mr-4" v-if="item.boutique" />{{ item.brief
							}}
						</view>
					</view>
					<view class="buttons text-sm">
						<debounce class="header_group">
							<image class="header" :src="item.icon" @click="gohomepage(item)"></image>
							<view class="add" v-if="!item.isFollow">
								<image src="@/static/video/attention.png" class="w-19 h-19" @click.stop="attention(item)">
								</image>
							</view>
						</debounce>
						<debounce @debounce="like(item)" class="button mb-10">
							<image v-if="item.isLike" class="w-36 h-36" src="@/static/video/likefill.png" />
							<image v-else class="w-36 h-36" src="@/static/video/like.png" />
							<view>{{ computedNumber(item.likeNum) }}</view>
						</debounce>
						<debounce @debounce="openBox(item)" class="button mb-10">
							<image class="w-36 h-36" src="@/static/video/evaluate.png" />
							<view>{{ computedNumber(item.commentNum) }}</view>
						</debounce>
						<debounce @debounce="collection(item)" class="button mb-10">
							<view class="button mb-10">
								<image v-if="item.isCollection" class="w-36 h-36" src="@/static/video/collectfill.png" />
								<image v-else class="w-36 h-36" src="@/static/video/collect.png" />
								<view>{{ computedNumber(item.collectionNum) }}</view>
							</view>
						</debounce>
						<view class="button mb-10" @click='handleShare'>
							<button open-type="share" style="background-color: transparent;">
								<image class="w-36 h-36" src="@/static/video/share.png" />
							</button>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<u-popup :show="pageData.show" @close="closeBox">
			<view class="container">
				<comment ref="commentRef" :id="pageData.commentid" :articleType="2" :createdBy="pageData.createdBy">
				</comment>
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
</template>

<script setup>
import comment from "@/components/common/comment.vue"
import { opusdetails } from "@/api/mine/index"
import { opusrecommend } from "@/api/recvideo/index"
import { getTokenValue } from "@/utils/utils"
import { opusCollect, opusLike, userFans } from "@/api/opus/index"
import { getCurrentInstance, reactive, watch, ref, computed } from 'vue'
import useLoginTokenStore from '@/store/modules/loginToken'
import { onShow } from '@dcloudio/uni-app'
const props = defineProps(['lastVideoId', 'opusid', 'traceInfo'])
const commentRef = ref();
const open = () => {
	commentRef.value.init(true);
}
const isShare = ref(false)
const pageData = reactive({
	createdBy: '',
	commentid: '',
	id: '',
	isShowLoginPop: false,
	lastVideoId: '',
	list: [],
	current: 0, //当前下标
	status: 0, //0播放 1暂停
})
const opusDetail = () => {
	opusdetails({
		opusId: props.opusid
	}).then(res => {
		pageData.list.unshift(res.data)
	})
}
opusDetail()
const getDataApi = () => {
	opusrecommend({}).then(res => {
		pageData.list = [...pageData.list, ...res.data]
		// pageData.lastVideoId = res.data[res.data.length - 1].id
	})
}
const computedNumber = computed({
	get: (num) => { return function (num) { return num > 9999 ? (num / 10000).toFixed(1) + 'w' : num } }
})
const { ctx } = getCurrentInstance()
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
watch(() => props.lastVideoId, (newV, oldV) => {
	if (newV) {
		pageData.lastVideoId = newV
		getDataApi()
	}
}, { deep: true, immediate: true })
watch(() => pageData.current, (newV, oldV) => {
	if (newV == pageData.list.length - 1) {
		getDataApi()
	}
}, { deep: true, immediate: true })
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

const animationfinish = (e) => {
	pageData.current = e.detail.current;
	let currentId = 'video' + pageData.current; // 获取当前视频id
	pageData.videoContent = uni.createVideoContext(currentId, ctx).play();
	pageData.status = 0;
}
const handleChange = () => {
	let currentId = 'video' + pageData.current
	uni.createVideoContext(currentId, ctx).pause()
	pageData.status = 1
	// pageData.id = pageData.list[pageData.current].id
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
	if (getTokenValue()) {
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
	} else {
		pageData.isShowLoginPop = true
		isShare.value = false
	}

}
//收藏
const collection = (item) => {
	let action = item.isCollection ? 0 : 1
	if (getTokenValue()) {
		opusCollect({ opusId: item.id, action: action }, { trackInfo: props.traceInfo }).then(res => {
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
		opusLike({ opusId: item.id, action: action }, { trackInfo: props.traceInfo }).then(res => {
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
	pageData.createdBy = item.createdBy
	pageData.commentid = item.id
	pageData.show = true;
}
const closeBox = () => {
	pageData.show = false
	isShare.value = true
	fetch()
}
//分享
const onShareAppMessage = () => {
	return {
		title: pageData.list[pageData.current].brief,
		path: '/pages/opus/index?id=' + pageData.list[pageData.current].id,
		imageUrl: pageData.list[pageData.current].thumbnail
	}
}
const fetch = () => {
	opusdetails({
		opusId: pageData.list[pageData.current].id
	}).then(res => {
		pageData.list[pageData.current] = res.data
	})
}
const handleShare = () => {
	isShare.value = true
}
// onShow(() => {
// 	if (!isShare.value) {
// 		fetch()
// 	}
// })
const onShareTimeline = () => {
	return onShareAppMessage()
}
</script>

<style lang="scss" scoped>
.icon_play {
	top: calc(50% - 64rpx);
	left: calc(50% - 64rpx);
}

.swiper {
	position: relative;
	width: 100%;
	height: 100vh;

	.info {
		z-index: 1;
		position: absolute;
		bottom: 140upx;
		color: white;
	}

	.buttons {
		display: flex;
		flex-direction: column;
		position: absolute;
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

}

.container {
	height: 600rpx;
	overflow: auto;
}
</style>
