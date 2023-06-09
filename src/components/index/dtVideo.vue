<template>
	<view class="bg-black">
		<swiper class="swiper w-screen h-screen" vertical :current="pageData.current" :interval="2000" :duration="600"
			@animationfinish="animationfinish" @change="handleChange" :circular="false">
			<swiper-item v-for="(item, index) in pageData.list" :key="index">
				<view v-if="index == pageData.current" @click="handleVideo(index)" class="w-screen h-screen">
					<video autoplay class="w-screen h-screen fixed" :id="'video' + index" :src="item.src" loop
						:controls="false" :show-center-play-btn="true" :show-play-btn="false" :show-fullscreen-btn="false"
						@error="videoErrorCallback">
					</video>
					<view v-if="pageData.status == 1" class="icon_play w-full h-full absolute w-50 h-50">
						<image class="w-50 h-50" src="@/static/opus/icon_play.png" />
					</view>
					<view class="info">
						<view class="title">@{{ item.title }}</view>
						<view class="desc">{{ item.desc }}</view>
					</view>
					<view class="buttons">
						<view class="header_group">
							<image class="header" src="/static/logo.png"></image>
							<view class="add">+</view>
						</view>
						<view class="button mb-10" @click.stop="like">
							<image v-if="pageData.detail.isLike" class="w-24 h-24" src="@/static/opus/icon_heart_ed.png" />
							<image v-else class="w-24 h-24" src="@/static/opus/icon_heart.png" />
							<view>点赞</view>
						</view>
						<view class="button mb-10" @click.stop="comment">
							<img class="w-24 h-24" src="@/static/opus/icon_comment.png">
							<view>评价</view>
						</view>
						<view class="button mb-10" @click.stop="collection">
							<image v-if="pageData.detail.isCollection" class="w-24 h-24"
								src="@/static/opus/icon_star_ed.png" />
							<image v-else class="w-24 h-24" src="@/static/opus/icon_star.png" />
							<view>收藏</view>
						</view>
						<view class="button mb-10">
							<button open-type="share" style="background-color: transparent;">
								<image class="w-24 h-24" src="@/static/opus/icon_return.png" />
							</button>
							<view>分享</view>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<loginPop :isShow="pageData.isShowLoginPop" @close="pageData.isShowLoginPop = false"></loginPop>
	</view>
</template>
  
<script setup>
import { postVideorecommend } from "@/api/workList/work"
import { getTokenValue } from "@/utils/utils"
import { opusCollect, opusLike, userFans, userFansRemove } from "@/api/opus/index"
import { getCurrentInstance, reactive, watch } from 'vue'
const props = defineProps({
	lastVideoId: {
		type: String,
		default: ''
	}
})
const pageData = reactive({
	id: '',
	isShowLoginPop: false,
	detail: {
		"cover": {},
		"opusType": 1,
		"content": [
		],
		"recommendedCity": [],
	},
	lastVideoId: '',
	list: [],
	current: 0,
	status: 0,//0播放 1暂停
})
const getDataApi = () => {
	postVideorecommend({
		"lastVideoId": pageData.lastVideoId
	}).then(res => {
		let arr = []
		res.data.forEach(item => {
			let obj = {}
			obj.title = item.author
			obj.desc = item.introduce
			obj.src = item.cover.content
			arr.push(obj)
		})
		pageData.list = [...pageData.list, ...arr]
		pageData.lastVideoId = res.data[res.data.length - 1].id
	})
}
const { ctx } = getCurrentInstance()
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
const playVideo = () => {
	let currentId = 'video' + pageData.current; // 获取当前视频id
	pageData.videoContent = uni.createVideoContext(currentId, ctx).play();
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

const animationfinish = (e) => {
	pageData.current = e.detail.current;
	playVideo()
}

const handleChange = () => {
	let currentId = 'video' + pageData.current
	uni.createVideoContext(currentId, ctx).pause()
	pageData.status = 1
}

const videoErrorCallback = () => {
	uni.showToast({
		title: '视频播放错误',
		icon: 'none',
		duration: 2000
	});
}
const attention = () => {
	let action = pageData.detail.isFollow ? 0 : 1
	if (getTokenValue()) {
		let opusAttention = action ? userFans : userFansRemove
		opusAttention({ id: pageData.detail.createdBy }).then(res => {
			if (action) {
				pageData.detail.isFollow = true

			} else {
				pageData.detail.isFollow = false
			}
			uni.showToast({
				title: (action ? '' : '取消') + '关注成功',
				icon: 'none',
				duration: 2000
			})
		})
	}
	else {
		pageData.isShowLoginPop = true
	}

}

const collection = () => {
	let action = pageData.detail.isCollection ? 0 : 1
	if (getTokenValue()) {
		opusCollect({ opusId: pageData.id, action: action }).then(res => {
			if (action) {
				pageData.detail.isCollection = true
				pageData.detail.collectionNum++
			} else {
				pageData.detail.isAttention = false
				if (pageData.detail.collectionNum > 0) {
					pageData.detail.collectionNum--
				}
			}
			uni.showToast({
				title: (action ? '' : '取消') + '收藏成功',
				icon: 'none',
				duration: 2000
			})
		})
	}
	else {
		pageData.isShowLoginPop = true
	}
}

const like = () => {
	let action = pageData.detail.isLike ? 0 : 1
	if (getTokenValue()) {
		opusLike({ opusId: pageData.id, action: action }).then(res => {
			if (action) {
				pageData.detail.isLike = true
				pageData.detail.likeNum++
			} else {
				pageData.detail.isLike = false
				if (pageData.detail.likeNum > 0) {
					pageData.detail.likeNum--
				}
			}
			uni.showToast({
				title: (action ? '' : '取消') + '点赞成功',
				icon: 'none',
				duration: 2000
			})
		})
	}
	else {
		pageData.isShowLoginPop = true
	}
}
const comment = () => {
	uni.showToast({
		title: '评论',
		icon: 'none',
		duration: 2000
	});
}
const onShareAppMessage = () => {
	return {
		title: pageData.detail.brief,
		path: '/pages/opus/index?id=' + pageData.id,
		imageUrl: pageData.detail.cover.itemType == 2 ? pageData.detail.cover.content : pageData.detail.cover.thumbnail
	}
}

const onShareTimeline = () => {
	return onShareAppMessage()
}
</script>
  
<style lang="scss" scoped>
.icon_play {
	top: calc(50% - 50rpx);
	left: calc(50% - 50rpx);
}
.swiper {
	position: relative;
	width: 100%;
	height: 100vh;
	.info {
		z-index: 1;
		position: absolute;
		bottom: 200upx;
		color: white;
		text-indent: 1em;
		font-size: 30upx;
	}

	.buttons {
		display: flex;
		flex-direction: column;
		position: absolute;
		right: 5vw;
		bottom: 12vh;
		color: white;
		text-align: center;
		justify-content: center;
		z-index: 1;
		.header_group {
			margin-bottom: 50upx;
			height: 90upx;
			width: 90upx;
			position: relative;
			.header {
				border: 2px solid white;
				margin: 0 auto;
				border-radius: 90upx;
				height: 90upx;
				width: 90upx;
			}
			.add {
				position: absolute;
				bottom: -30upx;
				margin: 0 auto;
				right: 0upx;
				background-color: #f15b6c;
				left: 0upx;
				width: 50upx;
				height: 50upx;
				font-size: 50upx;
				line-height: 50upx;
				border-radius: 50upx;
			}
		}

		.button {
			text-align: center;
			font-size: 24upx;
		}
	}

}</style>
  