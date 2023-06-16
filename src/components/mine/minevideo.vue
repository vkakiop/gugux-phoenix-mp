<template>
	<view @click="handleVideo(0)" class="w-screen h-screen relative" v-if="pageData.opusdetail.cover">
		<video autoplay class="w-screen h-screen fixed" id='video0' :src="pageData.opusdetail.cover.content" loop :controls="false" :show-center-play-btn="true" :show-play-btn="false" :show-fullscreen-btn="false" @error="videoErrorCallback">
		</video>
		<view v-if="pageData.status == 1" class="icon_play w-full h-full absolute w-50 h-50">
			<image class="w-64 h-64" src="@/static/opus/icon_play.png" />
		</view>
		<view class="info">
			<view class="title">@{{ pageData.opusdetail.title }}</view>
			<view class="desc">{{ pageData.opusdetail.brief }}</view>
		</view>
		<cover-view>
			<view class="buttons text-sm">
				<debounce  class="header_group">
					<image class="header" :src="pageData.opusdetail.icon"></image>
					<view class="add" v-if="!pageData.opusdetail.isFollow" @click="attention(pageData.opusdetail)">
						<image src="@/static/video/attention.png" class="w-19 h-19" ></image>
					</view>
				</debounce>
				<debounce @debounce="like(pageData.opusdetail)" class="button mb-10">
					<image v-if="pageData.opusdetail.isLike" class="w-36 h-36" src="@/static/video/likefill.png" />
					<image v-else class="w-36 h-36" src="@/static/video/like.png" />
					<view>{{ pageData.opusdetail.likeNum }}</view>
				</debounce>
				<debounce @debounce="comment(pageData.opusdetail)" class="button mb-10">
					<image class="w-36 h-36" src="@/static/video/evaluate.png" />
					<view>{{ pageData.opusdetail.commentNum }}</view>
				</debounce>
				<debounce @debounce="collection(pageData.opusdetail)" class="button mb-10">
				<view class="button mb-10">
					<image v-if="pageData.opusdetail.isCollection" class="w-36 h-36" src="@/static/video/collectfill.png" />
					<image v-else class="w-36 h-36" src="@/static/video/collect.png" />
					<view>{{ pageData.opusdetail.collectionNum }}</view>
				</view>
				</debounce>
				<view class="button mb-10" @click='handleShare'>
					<button open-type="share" style="background-color: transparent;">
						<image class="w-36 h-36" src="@/static/video/share.png" />
					</button>
					<view>分享</view>
				</view>
			</view>
		</cover-view>
	</view>
</template>

<script setup>
	import {
		opusdetails
	} from "@/api/mine/index"
	import {
		getTokenValue
	} from "@/utils/utils"
	import {
		opusInfo,
		opusCollect,
		opusLike,
		userFans,
		userFansRemove
	} from "@/api/opus/index"
	import {
		getCurrentInstance,
		reactive,
		watch,
		ref
	} from 'vue'
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app'
	const isShare = ref(false)
	const pageData = reactive({
		opusdetail: {},
		status: 0, //0播放 1暂停
	})
	const {
		ctx
	} = getCurrentInstance()
	onLoad((option) => {
		if (!isShare.value) {
			opusdetails({
				opusId: option.id
			}).then(res => {
				pageData.opusdetail = res.data
				console.log('pageData.opusdetail', pageData.opusdetail);
			})
		}
	})
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

	const animationfinish = (e) => {
		playVideo()
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
					title:  '关注成功',
					icon: 'none',
					duration: 2000
				})
			})
	}
	//收藏
	const collection = (item) => {
		let action = item.isCollection ? 0 : 1
		if (getTokenValue()) {
			opusCollect({
				opusId: item.id,
				action: action
			}).then(res => {
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
			opusLike({
				opusId: item.id,
				action: action
			}).then(res => {
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
	const comment = () => {
		uni.showToast({
			title: '评论',
			icon: 'none',
			duration: 2000
		});
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
		bottom: 200upx;
		color: white;
		text-indent: 1em;
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
		z-index: 999;

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
				position: relative;
				left: -5rpx;
			}

			.add {
				position: absolute;
				bottom: -30upx;
				margin: 0 auto;
				right: 0upx;
				left: 0upx;
				width: 50upx;
				height: 50upx;
				line-height: 50upx;
				border-radius: 50upx;
			}
		}

		.button {
			text-align: center;
		}
	}
</style>