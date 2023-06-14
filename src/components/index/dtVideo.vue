<template>
	<view class="bg-black">
		<swiper class="swiper w-screen h-screen" vertical :current="pageData.current" :interval="2000" :duration="600" @animationfinish="animationfinish" @change="handleChange" :circular="false">
			<swiper-item v-for="(item, index) in pageData.list" :key="index">
				<view v-if="index == pageData.current" @click="handleVideo(index)" class="w-screen h-screen">
					<video autoplay class="w-screen h-screen fixed" :id="'video' + index" :src="item.cover.content" loop :controls="false" :show-center-play-btn="true" :show-play-btn="false" :show-fullscreen-btn="false" @error="videoErrorCallback">
					</video>
					<view v-if="pageData.status == 1" class="icon_play w-full h-full absolute w-50 h-50">
						<image class="w-64 h-64" src="@/static/opus/icon_play.png" />
					</view>
					<view class="info">
						<view class="title">@{{ item.title }}</view>
						<view class="desc">{{ item.brief }}</view>
					</view>
					<cover-view>
						<view class="buttons text-sm">
							<debounce @debounce="attention(item)" class="header_group">
								<image class="header" :src="item.icon"></image>
								<view class="add">
									<image src="@/static/video/attention.png" class="w-19 h-19" v-if="!item.isFollow"></image>
									<image src="@/static/video/reture.png" class="w-19 h-19" v-else></image>
								</view>
							</debounce>
							<debounce @debounce="like(item)" class="button mb-10">
								<image v-if="item.isLike" class="w-36 h-36" src="@/static/video/likefill.png" />
								<image v-else class="w-36 h-36" src="@/static/video/like.png" />
								<view>{{ item.likeNum }}</view>
							</debounce>
							<debounce @debounce="comment(item)" class="button mb-10">
								<img class="w-36 h-36" src="@/static/video/evaluate.png">
								<view>{{ item.commentNum }}</view>
							</debounce>
							<debounce @debounce="collection(item)" class="button mb-10">
							<view class="button mb-10">
								<image v-if="item.isCollection" class="w-36 h-36" src="@/static/video/collectfill.png" />
								<image v-else class="w-36 h-36" src="@/static/video/collect.png" />
								<view>{{ item.collectionNum }}</view>
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
			</swiper-item>
		</swiper>
		<loginPop :isShow="pageData.isShowLoginPop" @close="pageData.isShowLoginPop = false"></loginPop>
	</view>
</template>

<script setup>
	import {
		postVideorecommend
	} from "@/api/workList/work"
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
	const props = defineProps({
		lastVideoId: {
			type: String,
			default: ''
		}
	})
	const isShare = ref(false)
	const pageData = reactive({
		id: '',
		isShowLoginPop: false,
		lastVideoId: '',
		list: [],
		current: 0,
		status: 0, //0播放 1暂停
	})
	const getDataApi = () => {
		postVideorecommend({
			"lastVideoId": pageData.lastVideoId
		}).then(res => {
			pageData.list = [...pageData.list, ...res.data]
			pageData.lastVideoId = res.data[res.data.length - 1].id
			console.log(pageData.list);
		})
	}
	const {
		ctx
	} = getCurrentInstance()
	watch(() => props.lastVideoId, (newV, oldV) => {
		if (newV) {
			pageData.lastVideoId = newV
			getDataApi()
		}
	}, {
		deep: true,
		immediate: true
	})
	watch(() => pageData.current, (newV, oldV) => {
		if (newV == pageData.list.length - 1) {
			getDataApi()
		}
	}, {
		deep: true,
		immediate: true
	})
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
		pageData.id = pageData.list[pageData.current].id
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
	//关注
	const attention = (item) => {
		let action = item.isFollow ? 0 : 1
		if (getTokenValue()) {
			let opusAttention = action ? userFans : userFansRemove
			opusAttention({
				id: item.createdBy
			}).then(res => {
				if (action) {
					item.isFollow = true
				} else {
					item.isFollow = false
				}
				uni.showToast({
					title: (action ? '' : '取消') + '关注成功',
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
			title: pageData.list[pageData.current].brief,
			path: '/pages/opus/index?id=' + pageData.list[pageData.current].id,
			imageUrl: pageData.list[pageData.current].thumbnail
		}
	}

	const fetch = () => {
		postVideorecommend({
			"lastVideoId": pageData.list[pageData.current].id
		}).then(res2 => {
			pageData.list = res2.data
			pageData.status = 0;
			pageData.current = 0
			pageData.lastVideoId = res2.data[res2.data.length - 1].id
		})
	}
	const handleShare = () => {
		isShare.value = true
	}
	onShow(() => {
		if (!isShare.value) {
			fetch()
		}
	})
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
					background-color: #f15b6c;
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

	}
</style>
