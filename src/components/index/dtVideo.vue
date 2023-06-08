<template>
	<view>
		<swiper class="swiper" vertical :interval="interval" :duration="duration" @animationfinish="animationfinish" @change="handleChange" circular>
			<swiper-item v-for="(item,index) in list" :key="index">
				<view class="swiper-item uni-bg-red">
					<view @click="handleVideo(index)" class="viewSty">
						<video class="video" :id="'video'+index" title="产品介绍" :src="item.src"   loop  :controls="false" :show-center-play-btn="true" :show-play-btn="false" :show-fullscreen-btn="false" @error="videoErrorCallback">
						</video>
						<image src="../../static/img/video.png"  class="imgSize" v-if="status===1"></image>
					</view>
					<view class="info">
						<view class="title">@{{item.title}}</view>
						<view class="desc">{{item.desc}}</view>
					</view>
					<view class="audio">
						<view class="text-group">
							<view class="text">这是一段音频</view>
						</view>
						<view>
							<image class="icon" src="/static/logo.png"></image>
						</view>
					</view>
					<view class="buttons">
						<view class="header_group">
							<image class="header" src="/static/logo.png"></image>
							<view class="add">+</view>
						</view>
						<view class="button">
							<image @click="collect()" mode="widthFix" class="icon" src="/static/img/shoucang.png"></image>
							<view>7.6w</view>
						</view>
						<view class="button">
							<image @click="message()" mode="widthFix" class="icon" src="/static/img/xiaoxi.png"></image>
							<view>7.6w</view>
						</view>
						<view class="button">
							<image @click="share()" mode="widthFix" class="icon" src="/static/img/fenxiang.png"></image>
							<view>7.6w</view>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name: "dt-video",
		props: {
			list: {
				type: Array,
				default: []
			},
		},
		data() {
			return {
				current: 0,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 600,
				//1代表播放状态需要暂停，0代表暂停播放
				status: 1
			};
		},
		created() {
			this.playVideo();
		},
		methods: {
			handleChange() {
				console.log('视频切换了', this.current);
				let currentId = 'video' + this.current
				let currentId2 = 'video' + (this.current + 1)
				uni.createVideoContext(currentId, this).pause()
				this.status = 1
			},
			//点击视频播放或者暂停
			handleVideo(idx) {
				let _this = this;
				let currentId = 'video' + this.current;
				if (this.status == 1) {
					uni.createVideoContext(currentId, _this).play()
					this.status = 0
					console.log('执行了播放', this.status);
				} else {
					uni.createVideoContext(currentId, _this).pause()
					this.status = 1
					console.log('执行了暂停', this.status);
				}

			},
			playVideo() {
				let _this = this;
				let currentId = 'video' + this.current; // 获取当前视频id
				this.videoContent = uni.createVideoContext(currentId, _this).play();
				this.status = 0;
				// 获取视频列表
				let trailer = this.list;
				trailer.forEach((item, index) => { // 获取json对象并遍历, 停止非当前视频
					if (item.src != null && item.src != "") {
						let temp = 'video' + index;
						if (temp != currentId) {
							// 暂停其余视频
							uni.createVideoContext(temp, _this).pause(); //暂停视频播放事件
						}
					}

				})
			},
			//分享
			share() {
				uni.showToast({
					title: "触发分享",
					icon: "none"
				})
			},
			//消息
			message() {
				uni.showToast({
					title: "触发消息",
					icon: "none"
				})
			},
			//收藏
			collect() {
				uni.showToast({
					title: "触发收藏",
					icon: "none"
				})
			},
			// 视频错误信息回调
			videoErrorCallback(e) {

			},
			animationfinish(e) {
				this.current = e.detail.current;
				this.playVideo()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.swiper {
		position: relative;
		width: 100%;
		//去除tabbar高度
		height: calc(100vh - 120rpx);

		.swiper-item {
			.info {
				z-index: 1;
				position: absolute;
				bottom: 60upx;
				color: white;
				text-indent: 1em;
				font-size: 30upx;
			}

			.audio {
				position: absolute;
				bottom: 20upx;
				z-index: 1;
				text-indent: 1em;
				color: white;
				font-size: 30upx;
				display: flex;
				width: 100%;
				flex-direction: row;
				justify-content: space-between;
				align-items: flex-end;

				@-webkit-keyframes move {
					0% {
						left: 100vw;
					}

					100% {
						left: -50vw;
					}
				}

				@-moz-keyframes move {
					0% {
						left: 100vw;
					}

					100% {
						left: -50vw;
					}
				}

				@-ms-keyframes move {
					0% {
						left: 100vw;
					}

					100% {
						left: -50vw;
					}
				}

				@keyframes move {
					0% {
						left: 100vw;
					}

					100% {
						left: -50vw;
					}
				}

				.text-group {
					position: relative;
					width: 50vw;
					height: 40upx;

					overflow: hidden;

					.text {
						position: absolute;
						top: 0upx;
						white-space: nowrap;
						/*文本不会换行，文本会在在同一行上继续*/
						-webkit-animation: 10s move infinite;
						-moz-animation: 10s move infinite;
						-ms-animation: 10s move infinite;
						animation: 10s move infinite;
						width: 50vw;
						left: 100vw;

					}
				}


				.icon {
					width: 60upx;
					height: 60upx;
					border-radius: 60upx;
					animation: turn 3s linear infinite;
					margin-right: 5vw;
					border: 10upx solid white;
				}

				/* 
				      turn : 定义的动画名称
				      1s : 动画时间
				      linear : 动画以何种运行轨迹完成一个周期
				      infinite :规定动画应该无限次播放
				     */
				@keyframes turn {
					0% {
						-webkit-transform: rotate(0deg);
					}

					25% {
						-webkit-transform: rotate(90deg);
					}

					50% {
						-webkit-transform: rotate(180deg);
					}

					75% {
						-webkit-transform: rotate(270deg);
					}

					100% {
						-webkit-transform: rotate(360deg);
					}
				}
			}

			.video {
				width: 100%;
				z-index: 0;
				height: calc(100vh - 120rpx);
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
					font-size: 25upx;

					.icon {
						margin: 20upx;
						width: 60upx;
					}
				}
			}

		}

	}
	.viewSty{
		position: relative;
		.imgSize {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 60px;
		height: 60px;
		margin-left: -30px;
		margin-top: -30px;
		z-index: 99;
	}
	}
</style>