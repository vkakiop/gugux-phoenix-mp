<template>
	<view>
		<customNav>
			<view @click="gotoBack" class="ml-3"><uni-icons type="back" size="24"></uni-icons></view>
			<!-- 搜索框 -->
			<view class="bg-white w-full py-10">
				<view class="w-full flex items-center">
					<view
						class="flex items-center ml-5  bg-[#F5F6F8]  h-30 w-175 rounded-40 border-1 border-[#E3E3E3] text-15 text-[#333]">
						<input class="ml-15" v-model="searchvalue" placeholder="搜索" type="text" @confirm="search" />
						<view class="px-12 relative z-50 flex items-center" @click.stop="search">
							<image :src="configStaticPath('/static/mine/searchhistory.png')" class="w-16 h-16" />
						</view>
					</view>
				</view>
			</view>
			<!-- 搜索框 -->
		</customNav>
		<view class="fixed  pt-10 bg-[#fff] z-50 w-full" :style="{'top':pageData.height+'px'}">
			<!-- 搜索历史 -->
			<view class="w-full mt-5 py-15" v-if="isShowHistory">
				<view v-if="pageData.searchHistoryList.length">
					<view class="flex px-15 justify-between mb-10">
						<view class="text-17 font-bold">历史搜索:</view>
						<view @click="empty">
							<image :src="configStaticPath('/static/mine/ashbin.png')" class="w-20 h-20" />
						</view>
					</view>
					<view class="w-full flex flex-wrap ">
						<view v-for="(item, index) in pageData.searchHistoryList" :key="index"
							class="bg-[#F5F6F8] px-24 h-38 my-5 ml-14 rounded-10 text-center leading-38">
							<text @click='handlehistory(item)'>{{ item }}</text>
						</view>
					</view>
				</view>
				<view v-else="!pageData.searchHistoryList.length">
					<u-empty mode="history" text="暂无历史记录" :icon="configStaticPath('/static/img/nodata.png')">
					</u-empty>
				</view>
			</view>
			<!-- 搜索历史 -->
			<!-- 菜单 -->
			<view class="w-full bg-white py-15" v-show="!isShowHistory">
				<view class="flex ml-10">
					<view v-for="(waterItem, index) in pageData.waterfallItems" :key="index" class="mr-28 "
						@click="changeWaterfall(index)">
						<view :class="pageData.currentIndex == index ? 'active' : 'inactive'">{{ waterItem.name }}</view>
						<view class=" h-4 relative -top-5 ">
							<image :src="configStaticPath('/static/mine/line.png')" class="w-30 h-4 "
								v-show="pageData.currentIndex == index" />
						</view>
					</view>
				</view>

			</view>
			<!-- 菜单 -->
		</view>
		<view v-show="!isShowHistory">
			<view class="h-70"></view>
			<view v-for="(waterItem, waterIndex) in pageData.waterfallItems" :key="waterIndex">
				<view v-if="waterIndex == pageData.currentIndex">
					<waterfall :isComplete="waterItem.isComplete" :itemType="waterItem.itemType" :value="waterItem.items"
						:waterIndex="waterIndex" :currentIndex="pageData.currentIndex">
					</waterfall>
				</view>
				<view class="u-page__loading-item" v-if="!pageData.isLoading && waterIndex == pageData.currentIndex">
					<u-loading-icon size="36"></u-loading-icon>
				</view>
				<view v-if="!waterItem.items.length && waterIndex == pageData.currentIndex && pageData.isLoading"
					class="flex items-center justify-center">
					<u-empty mode="search" text="对不起,没有找到您要的搜索内容" :icon="configStaticPath('/static/img/nodata.png')" />
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import waterfall from '@/components/index/waterfall.vue'
import { configStaticPath } from '@/config/index'
import { opusSearchNew } from "@/api/worksSearch/index.js"
import { ref, onMounted, reactive, watch, nextTick } from 'vue'
import { onShow, onReachBottom, onLoad } from '@dcloudio/uni-app';
import useLoginTokenStore from '@/store/modules/loginToken'
import _ from 'lodash'
const emits = defineEmits(["changeHeightInfo"]);
onMounted(() => {
	let systemInfo = uni.getSystemInfoSync()
	pageData.statusBarHeight = systemInfo.statusBarHeight
	let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
	pageData.titleBarHeight = (menuButtonInfo.top - pageData.statusBarHeight) * 2 + menuButtonInfo.height
	pageData.titleBarRight = menuButtonInfo.width + (systemInfo.windowWidth - menuButtonInfo.right)
	pageData.height = pageData.statusBarHeight + pageData.titleBarHeight
	pageData.isShow = true
	emits('changeHeightInfo', pageData)
})
const searchvalue = ref('')
const isShowHistory = ref(true)
const waterfallItems = [
	{
		scrollTop: -1, isComplete: false, isLoading: false, itemType: 'title', name: '综合', items: [],
		query: {
			path: { type: 1, pageNum: 1, pageSize: 20, searchTime: "", keyword: '' },
			data: { passTime: '' }
		}
	},
	{
		scrollTop: -1, isComplete: false, isLoading: false, itemType: 'title', name: '文章', items: [], query: {
			path: {
				type: 2, pageNum: 1, pageSize: 20, searchTime: "", keyword: ''
			},
			data: { passTime: '' }
		}
	},
	{
		scrollTop: -1, isComplete: false, isLoading: false, name: '视频', items: [], query: {
			path: {
				type: 3, pageNum: 1, pageSize: 20, searchTime: "", keyword: ''
			},
			data: { passTime: '' }
		}
	}
]
const pageData = reactive({
	isLoading: false,
	searchHistoryList: [],
	scrollTop: 0,
	currentIndex: 0,
	waterfallItems: _.cloneDeep(waterfallItems),
})
uni.getStorage({
	key: 'gugusearchList',
	success: function (res) {
		pageData.searchHistoryList = JSON.parse(res.data)
	}
})
onLoad(() => {
	nextTick(() => {
		changeWaterfall(0)
	})
})
// onShow(() => {
// 	nextTick(() => {
// 		changeWaterfall(0)
// 	})
// })
watch(() => useLoginTokenStore().get().accessToken, (newVal, oldVal) => {
	pageData.waterfallItems = _.cloneDeep(waterfallItems)
	pageData.waterfallItems.forEach((item, index) => {
		item.query.path.keyword = searchvalue.value
	})
	changeWaterfall(pageData.currentIndex)
})
const changeWaterfall = (waterIndex) => {
	// if (pageData.currentIndex != waterIndex) {
	// 	//读取滚动条高度
	// 	pageData.waterfallItems[pageData.currentIndex].scrollTop = pageData.scrollTop
	// }
	pageData.waterfallItems[waterIndex].query.path.searchTime = ''
	pageData.waterfallItems[waterIndex].query.path.pageNum = 1
	pageData.waterfallItems[waterIndex].items = []
	pageData.currentIndex = waterIndex
	if (pageData.waterfallItems[waterIndex].items.length == 0) {
		if (!isShowHistory.value) {
			getData()
		}
	}
	// else {
	// 	//写入滚动条高度
	// 	if (pageData.waterfallItems[waterIndex].scrollTop != -1) {
	// 		uni.pageScrollTo({
	// 			scrollTop: pageData.waterfallItems[waterIndex].scrollTop,
	// 			duration: 300
	// 		});
	// 	}
	// }
}
const getData = () => {
	pageData.isLoading = false
	let currentIndex = pageData.currentIndex
	pageData.waterfallItems[currentIndex].isLoading = true
	let query = pageData.waterfallItems[currentIndex].query
	opusSearchNew({ ...query.path }).then(res => {
		if (res.data.page == res.data.totalPage) {
			pageData.waterfallItems[currentIndex].isComplete = true
		}
		pageData.isLoading = true
		pageData.waterfallItems[currentIndex].query.path.searchTime = res.data.serviceTime
		pageData.waterfallItems[currentIndex].items = pageData.waterfallItems[currentIndex].items.concat(res.data.list)
		pageData.waterfallItems[currentIndex].isLoading = false

	}).catch(e => {
		pageData.waterfallItems[currentIndex].isLoading = false
	})

}
// onPageScroll((res) => {
// 	pageData.scrollTop = res.scrollTop
// })
const handlehistory = (item) => {
	searchvalue.value = item
	search()
}
const search = () => {
	//将搜索记录存在本地
	if (searchvalue.value != '') {
		if (!pageData.searchHistoryList.includes(searchvalue.value)) {
			pageData.searchHistoryList.unshift(searchvalue.value);
			uni.setStorage({
				key: 'gugusearchList',
				data: JSON.stringify(pageData.searchHistoryList)
			})
		} else {
			let i = pageData.searchHistoryList.indexOf(searchvalue.value);
			pageData.searchHistoryList.splice(i, 1);
			pageData.searchHistoryList.unshift(searchvalue.value);
			uni.setStorage({
				key: 'gugusearchList',
				data: JSON.stringify(pageData.searchHistoryList)
			})
		}
		isShowHistory.value = false
		pageData.waterfallItems.forEach(item => {
			item.query.path.keyword = searchvalue.value
			item.items = []
			item.scrollTop = -1
		})
		getData()
	}
}
const empty = () => {
	uni.removeStorage({
		key: "gugusearchList",
		success: (res) => {
			pageData.searchHistoryList = [];
			uni.showToast({
				title: '已清空'
			});
		}
	});

}
const gotoBack = () => {
	let pages = getCurrentPages()
	if (pages.length == 1) {
		uni.switchTab({ url: '/pages/index/index' })
	}
	else {
		uni.navigateBack({ delta: 1 })
	}
}

onReachBottom(() => {
	let currentIndex = pageData.currentIndex
	if (!pageData.waterfallItems[currentIndex].isComplete && !pageData.waterfallItems[currentIndex].isLoading) {
		pageData.waterfallItems[currentIndex].query.path.pageNum++
		getData()
	}
})
</script>

<style scoped lang="scss">
.active {
	font-size: 36rpx;
	font-family: Source Han Sans SC;
	font-weight: bold;
	color: #0E0E0E;
}

.inactive {
	font-size: 30rpx;
	font-family: Source Han Sans SC;
	font-weight: 400;
	color: #232323;
}
</style>