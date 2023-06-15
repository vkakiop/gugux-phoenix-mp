<template>
	<view v-if="pageData.mineMessage.id">
		<view class="">
			<image src="/static/mine/mine-bg.jpg" class="w-full" mode="scaleToFill"></image>
		</view>
		<view class="bg-gray-100 w-screen  px-14 relative -top-20" style="border-radius: 35rpx 35rpx 0px 0px;">
			<view>
				<view class="relative bottom-24 border-2 border-[#fff] w-80 rounded-full h-80 iconShadow" @click="skipPerson">
					<image :src="pageData.mineMessage.icon" class="w-76 h-76 rounded-full "></image>
				</view>
				<view class="-mt-10 mb-10 font-bold text-21 flex items-center">
					{{ pageData.mineMessage.nickname }}
					<image src="/static/mine/vip.png" class="w-47 h-19 mx-5"></image>
					<image src="/static/mine/dealer.png" class="w-57 h-19"></image>
				</view>
				<view class="mb-10 text-14 flex items-center">
					<image src="/static/mine/ID.png" class="w-15 h-15 "></image>
					<text class="ml-5 mr-15">{{ pageData.mineMessage.guguId }}</text>
					<image src="/static/mine/copy.png" class="w-15 h-15 ml-10" @click.stop="copy(pageData.mineMessage.guguId)"></image>
				</view>
			</view>
			<view class="flex text-14">
				<view class="line relative w-60  flex items-center">
					<view class="font-bold">{{pageData.mineMessage.fans}}</view>
					<view class="textStyle">&nbsp;关注</view>
				</view>
				<view class="line relative w-60 ml-10 flex items-center">
					<view class="font-bold">{{pageData.mineMessage.focus}}</view>

					<view class="textStyle">&nbsp;收藏</view>
				</view>
				<view class="w-60  ml-10 flex items-center">
					<view class="font-bold">{{pageData.mineMessage.liked}}</view>
					<view class="textStyle">&nbsp;获赞</view>
				</view>
			</view>
			<view>
				<view class="Express text-14 " style="font-family: Source Han Sans SC;">
					<view class="info">
						<view :class="{ hide: !iSinfo }">
							<view v-if="pageData.mineMessage.introduce">
								{{pageData.mineMessage.introduce}}
							</view>
							<view v-else>
								这家伙很懒，连介绍都没写~~
							</view>
						</view>
						<!-- <text @tap="showinfo" v-if="!iSinfo">展开</text> -->
					</view>
					<!-- <text @tap="showinfo" v-if="iSinfo" class="hidebtn">收起</text> -->
				</view>
			</view>

			<view class="">
				<template>
					<u-tabs :list="menuList" lineWidth="30" lineColor="#f56c6c" :activeStyle="{
						color: '#303133',
						fontWeight: 'bold',
						transform: 'scale(1.05)'
					}" :inactiveStyle="{
						color: '#606266',
						transform: 'scale(1)'
					}" itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;" @click="menuClick">
					</u-tabs>
				</template>
			</view>
			<view class="flex collectView" v-if="cllectRadio == 2">
				<view class="p-5  ml-20" :class="lableCollect == 1 ? 'bg-gray-300' : 'bg-gray-200'">文章</view>
				<view class="p-5  ml-20" :class="lableCollect == 2 ? 'bg-gray-300' : 'bg-gray-200'">视频</view>
			</view>
			<view class="" v-if="isShow">
				<eimlFlow :list="waterlist" :columnNum="2"></eimlFlow>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		getUserBase
	} from "@/api/mine/index.js"
	import eimlFlow from "@/components/eiml-flow-layout/eiml-flow-layout.vue"
	import {
		ref,
		onMounted,
		reactive,
		watch,
		computed,
		getCurrentInstance
	} from 'vue'
	import {
		opusSearchNew,
		opusSearchArticle,
		opusSearchVideo
	} from "@/api/worksSearch/index.js"
	import {
		onShow,
		onLoad,
		onReachBottom
	} from "@dcloudio/uni-app"
	import {
		needLogin
	} from "@/utils/utils"
	onShow(() => {
		if (needLogin()) {
			fetchData()
		}
	})
	const internalInstance = getCurrentInstance()
	const isShow = ref(false)
	const cllectRadio = ref(0)
	const iSinfo = ref(false)
	const lableCollect = ref(1)
	const uReadMore = ref()
	const pageData = reactive({
		//个人信息数据
		mineMessage: {}
	})
	const menuList = reactive([{
		name: '作品(999)',
	}, {
		name: '喜欢',
	}, {
		name: '收藏'
	}])
	const show = ref(false);
	function menuClick(item) {
			cllectRadio.value = item.index
			console.log('item',item);
	}

	function copy(value) {
		uni.setClipboardData({
			data: value, //要被复制的内容
			success: () => { //复制成功的回调函数
				uni.showToast({ //提示
					title: '复制成功'
				})
			}
		});
	}
	// 数据赋值
	const showinfo = () => {
		iSinfo.value = !iSinfo.value
	}
	const skipPerson = () => {
		uni.navigateTo({
			url: '/pages/personCenter/personCenter'
		})
	}
	onReachBottom(() => {})
	const fetchData = () => {
		getUserBase({}).then(res => {
			pageData.mineMessage = {
				...res.data
			}
		})
	}
</script>

<style lang="scss" scoped>
	.iconShadow {
		box-shadow: 0rpx 1rpx 18rpx 0rpx rgba(0, 0, 0, 0.19);
	}

	.textStyle {
		font-family: Source Han Sans SC;
		font-weight: 300;
		color: #999999;
	}

	.Express {
		line-height: 24rpx;
		font-family: Source Han Sans SC;
		font-weight: 300;
		color: #999999;
		display: flex;
		flex-direction: column;
		padding: 30upx 0;
		position: relative;

		.info {
			display: flex;
			flex-direction: column;

			view {
				text-align: justify;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				word-break: break-word; //换行模式
			}

			text {
				width: 70px;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				color: #0078FF;
				position: absolute;
				bottom: 30upx;
				right: 30upx;
			}
		}

	}

	.hidebtn {
		display: flex;
		flex: 1;
		justify-content: flex-end;
		color: #0078FF;

	}

	.hide {
		word-break: break-word; //换行模式
		overflow: hidden;
		text-overflow: ellipsis; //修剪文字
		display: -webkit-box;
		-webkit-line-clamp: 2; //此处为上限行数
		-webkit-box-orient: vertical;
	}

	.collectView {
		view {
			border-radius: 20%;
		}
	}

	.line::after {
		position: absolute;
		left: 40%;
		bottom: 20%;
		z-index: 11;
		width: 100%;
		height: 100%;
		content: "";
		display: block;
		border-right: 1px solid gray;
		transform: scale(0.5);
		transform-origin: left bottom;
	}
</style>