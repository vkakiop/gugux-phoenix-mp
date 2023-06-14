<template>
	<view class="">
		<view class="">
			<image src="/static/mine/mine-bg.jpg" class="h-160 w-screen"></image>
		</view>
		<view v-if="pageData.mineMessage.id" class="bg-gray-100 w-screen  px-14 relative -top-20" style="border-radius: 35rpx 35rpx 0px 0px;">
			<view >
				<view class="relative bottom-24" @click="skipPerson">
					<image :src="pageData.mineMessage.icon" class="w-76 h-76 rounded-full "></image>
				</view>
				<view class="-mt-10 mb-10 font-bold">{{ pageData.mineMessage.nickname }}
					<image src="/static/mine/vip.png" class="w-47 h-20 mx-5"></image>
					<image src="/static/mine/dealer.png" class="w-47 h-20"></image>
				</view>
				<view class="mb-10 text-sm">
					<image src="/static/mine/ID.png" class="w-15 h-15"></image>
					{{ pageData.mineMessage.guguId }}
					<image src="/static/mine/copy.png" class="w-15 h-15 ml-10" @click.stop="copy(pageData.mineMessage.guguId)"></image>
				</view>
			</view>
			<view class="flex text-sm" style="font-family: Source Han Sans SC;">
				<view class="line relative w-60  flex items-center">
					<view class="font-bold">{{pageData.mineMessage.fans}}</view>
					<view class="textStyle">&nbsp;关注</view>
				</view>
				<view class="line relative w-60 ml-10 flex items-center">
					<view class="font-bold">{{pageData.mineMessage.focus}}</view>
				
				<view class="textStyle">&nbsp;收藏</view></view>
				<view class="w-60  ml-10 flex items-center">
					<view class="font-bold">{{pageData.mineMessage.liked}}</view>
				<view class="textStyle">&nbsp;获赞</view></view>
			</view>
			<view>
				<view class="Express text-sm " style="font-family: Source Han Sans SC;">
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
	const paramsForm = reactive({
		"keyword": "",
		"pageNum": 1,
		"pageSize": 10,
		"searchTime": "",
		"type": 0
	})
	const internalInstance = getCurrentInstance()
	const content = ref('在大多数场景下，并不需要设置 background-color 属性，因为uni-popup的主窗口默认是透明的，在向里面插入内容的时候 ，样式完全交由用户定制，如果设置了背景色 ，例如 uni-popup-dialog 中的圆角就很难去实现，不设置背景色，更适合用户去自由发挥。')
	const src = 'https://cdn.uviewui.com/uview/album/1.jpg'
	const TabCur2 = ref('')
	const isShow = ref(false)
	const cllectRadio = ref(0)
	const iSinfo = ref(false)
	const lableCollect = ref(1)
	const uReadMore = ref()
	const menuList = reactive([{
		name: '作品(999)',
	}, {
		name: '喜欢',
	}, {
		name: '收藏'
	}])
	const waterlist = ref([])
	const show = ref(false);
	const click = (item) => {}

	function menuClick(item) {
		if (paramsForm.type != item.index) {
			cllectRadio.value = item.index
			paramsForm.pageSize = 10
			paramsForm.type = item.index
			getDataApi()
		}

	}
	function copy(value) {
	  uni.setClipboardData({
	    data: value,//要被复制的内容
	    success: () => {//复制成功的回调函数
	      uni.showToast({//提示
	        title: '复制成功'
	      })
	    }
	  });
	  }
	// 数据赋值
	onMounted(() => {
		getDataApi()
	})
	const getDataApi = () => {
		if (paramsForm.type == 0) {
			isShow.value = false
			opusSearchNew(paramsForm).then(res => {
				isShow.value = true
				waterlist.value = [...res.data.list]
			})
		} else if (paramsForm.type == 1) {
			isShow.value = false
			opusSearchArticle(paramsForm).then(res => {
				isShow.value = true
				waterlist.value = [...res.data.list]
			})
		} else if (paramsForm.type == 2) {
			isShow.value = false
			opusSearchVideo(paramsForm).then(res => {
				isShow.value = true
				waterlist.value = [...res.data.list]
			})
		}
		//操作数据后更新视图
		internalInstance.ctx.$forceUpdate()
	}
	watch(() => paramsForm.type, (newV, oldV) => {
		getDataApi()
	}, {
		deep: true,
		immediate: true
	})
	const load = () => {
		uReadMore.value.uReadMore.init();
	}
	const showinfo = () => {
		iSinfo.value = !iSinfo.value
	}
	const skipPerson = () => {
		uni.navigateTo({
			url: '/pages/personCenter/personCenter'
		})
	}
	onReachBottom(() => {
		console.log('触底了')
		paramsForm.pageSize += 10
		if (paramsForm.type == 0) {
			opusSearchNew(paramsForm).then(res => {
				waterlist.value = [...res.data.list]
			})
		} else if (paramsForm.type == 1) {
			opusSearchArticle(paramsForm).then(res => {
				waterlist.value = [...res.data.list]
			})
		} else if (paramsForm.type == 2) {
			opusSearchVideo(paramsForm).then(res => {
				waterlist.value = [...res.data.list]
			})
		}

	})
	const pageData = reactive({
		//数据全部列表
		mineMessage: {}
	})

	const fetchData = () => {
		getUserBase({}).then(res => {
			pageData.mineMessage = {
				...res.data
			}
			console.log('个人主页', pageData.mineMessage);
		})
	}
</script>

<style lang="scss" scoped>
	.textStyle {
		font-size: 30rpx;
		font-family: Source Han Sans SC;
		font-weight: 300;
		color: #999999;
	}
	
	.Express {
		line-height: 24rpx;
		font-size: 30rpx;
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