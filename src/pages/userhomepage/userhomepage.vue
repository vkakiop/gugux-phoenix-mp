<template>
	<view v-if="pageInfo.mineMessage.guguId">
		<view class="">
			<image :src="pageInfo.mineMessage.background" class="w-full" mode="scaleToFill"></image>
		</view>
		<view class="bg-gray-100 w-screen  px-14 relative -top-20" style="border-radius: 35rpx 35rpx 0px 0px;">
			<view>
				<view class="relative bottom-24 border-2 border-[#fff] w-80 rounded-full h-80 iconShadow" @click="skipPerson">
					<image :src="pageInfo.mineMessage.icon" class="w-76 h-76 rounded-full "></image>
				</view>
				<view class="-mt-10 mb-10 font-bold text-21 flex items-center">
					{{ pageInfo.mineMessage.nickname }}
					<image src="/static/mine/vip.png" class="w-47 h-19 mx-5"></image>
					<image src="/static/mine/dealer.png" class="w-57 h-19"></image>
				</view>
				<view class="mb-10 text-14 flex items-center">
					<image src="/static/mine/ID.png" class="w-15 h-15 "></image>
					<text class="ml-5 mr-15">{{ pageInfo.mineMessage.guguId }}</text>
					<image src="/static/mine/copy.png" class="w-15 h-15 ml-10" @click.stop="copy(pageInfo.mineMessage.guguId)"></image>
				</view>
			</view>
			<view class="flex text-14">
				<view class="line relative w-60  flex items-center">
					<view class="font-bold">{{pageInfo.mineMessage.fans}}</view>
					<view class="textStyle">&nbsp;关注</view>
				</view>
				<view class="line relative w-60 ml-10 flex items-center">
					<view class="font-bold">{{pageInfo.mineMessage.focus}}</view>

					<view class="textStyle">&nbsp;收藏</view>
				</view>
				<view class="w-60  ml-10 flex items-center">
					<view class="font-bold">{{pageInfo.mineMessage.liked}}</view>
					<view class="textStyle">&nbsp;获赞</view>
				</view>
			</view>
			<view>
				<view class="Express text-14 " style="font-family: Source Han Sans SC;">
					<view class="info">
						<view :class="{ hide: !iSinfo }">
							<view v-if="pageInfo.mineMessage.introduce">
								{{pageInfo.mineMessage.introduce}}
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

		</view>
		<!-- 菜单 -->
		<view class="sticky -top-5 z-50 bg-white ml-10 w-full pb-10  -mt-25">
			<view class="flex bg-white py-10">
				<view v-for="(waterItem, index) in pageData.waterfallItems" class="mr-26" @click="changeWaterfall(index)">
					<view :class="pageData.currentIndex == index?'active':'inactive'">{{waterItem.name}} <text v-if="waterItem.query.data.totalCount">({{waterItem.query.data.totalCount}})</text></view>
					<view class="w-30 h-4 relative -top-5 ">
						<image src="/static/mine/line.png" class="w-34 h-4 " v-show="pageData.currentIndex == index" />
					</view>
				</view>
			</view>
		</view>
		<!-- 菜单 -->
		<view>
			<view v-for="(waterItem,waterIndex) in pageData.waterfallItems" :key="waterIndex">
				<view  v-if="!waterItem.items.length&&waterIndex == pageData.currentIndex">
				    <u-empty
				            mode="list"
				            icon="http://cdn.uviewui.com/uview/empty/car.png"
				    >
				    </u-empty>
				</view>
				<view v-show="waterIndex == pageData.currentIndex">
					<waterfall :isComplete="waterItem.isComplete" :itemType="waterItem.itemType" :value="waterItem.items" :waterIndex="waterIndex" :currentIndex="pageData.currentIndex">
					</waterfall>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import waterfall from '@/components/index/waterfall.vue'
	import { userhomepage, homepageopus } from "@/api/mine/index.js"
	import { ref, onMounted, reactive, watch, computed, getCurrentInstance } from 'vue'
	import { onShow, onReachBottom, onPageScroll, onLoad } from "@dcloudio/uni-app"
	import { needLogin } from "@/utils/utils"
	const waterlist = ref([])
	const pageData = reactive({
		masterId: '',
		scrollTop: 0,
		currentIndex: 0,
		waterfallItems: [{
			scrollTop: 0,
			isComplete: false,
			isLoading: false,
			itemType: 'title',
			name: '作品',
			items: [],
			query: {
				path: {
					pageNum: 1,
					pageSize: 10,
				},
				data: {
					totalCount: ''
				}
			}
		}],
	})
	onLoad((option) => {
		pageData.masterId = option.id
		userhomepage({
			masterId: option.id
		}).then(reslove => {
			pageInfo.mineMessage = reslove.data.userInfo
			changeWaterfall(0)
		})
	})
	const internalInstance = getCurrentInstance()
	const iSinfo = ref(false)
	const pageInfo = reactive({
		//个人信息数据
		mineMessage: {}
	})
	const changeWaterfall = (waterIndex) => {
		if (pageData.currentIndex != waterIndex) {
			//读取滚动条高度
			pageData.waterfallItems[pageData.currentIndex].scrollTop = pageData.scrollTop
		}
		pageData.currentIndex = waterIndex
		if (pageData.waterfallItems[waterIndex].items.length == 0) {
			getData()
		} else {
			//写入滚动条高度
			uni.pageScrollTo({
				scrollTop: pageData.waterfallItems[waterIndex].scrollTop,
				duration: 300
			});
		}
	}
	const getData = () => {
		let currentIndex = pageData.currentIndex
		pageData.waterfallItems[currentIndex].isLoading = true
		let query = pageData.waterfallItems[currentIndex].query
		homepageopus({
			masterId: pageData.masterId,
			...query.path
		}).then(res => {
			if (res.data.page == res.data.totalPage) {
				pageData.waterfallItems[currentIndex].isComplete = true
			}
			pageData.waterfallItems[currentIndex].query.data.totalCount = res.data.totalCount
			pageData.waterfallItems[currentIndex].items = pageData.waterfallItems[currentIndex].items.concat(res.data.list)
			pageData.waterfallItems[currentIndex].isLoading = false
		}).catch(e => {
			pageData.waterfallItems[currentIndex].isLoading = false
		})
	}
	onPageScroll((res) => {
		pageData.scrollTop = res.scrollTop
	})
	onReachBottom(() => {
		let currentIndex = pageData.currentIndex
		if (!pageData.waterfallItems[currentIndex].isComplete && !pageData.waterfallItems[currentIndex].isLoading) {
			pageData.waterfallItems[currentIndex].query.path.pageNum++
			getData()
		}
	})

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
</script>

<style lang="scss" scoped>
	.active {
		font-size: 17px;
		font-family: Source Han Sans SC;
		font-weight: bold;
		color: #272A29;
	}

	.inactive {
		font-size: 16px;
		font-family: Source Han Sans SC;
		font-weight: 400;
		color: #666666;
	}

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
