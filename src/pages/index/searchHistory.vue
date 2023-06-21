<template>
	<view>
		<customNav>
			<view @click="gotoBack" class="ml-3"><uni-icons type="back" size="24"></uni-icons></view>
			<!-- 搜索框 -->
			<view class="bg-white w-full py-10 ">
				<view class="w-full flex items-center">
					<view
						class="flex items-center ml-5  bg-[#F5F6F8]  h-30 w-175 rounded-40 border-1 border-[#E3E3E3] text-15 text-[#333]">
						<input class="ml-15" v-model="searchvalue" placeholder="搜索" type="text" @confirm="search" />
						<image src="/static/mine/searchhistory.png" class="w-16 h-16 px-12 relative z-50" @click="search" />
					</view>
				</view>
			</view>
			<!-- 搜索框 -->
		</customNav>
		<view class="fixed top-70 pt-10 bg-[#fff] z-50 w-full">
			<!-- 搜索历史 -->
			<view class="w-full mt-5" v-if="isShowHistory">
				<view v-if="pageData.searchHistoryList.length">
					<view class="flex px-15 justify-between mb-10">
						<view class="text-17 font-bold">历史搜索:</view>
						<view @click="empty">
							<image src="/static/mine/ashbin.png" class="w-20 h-20" />
						</view>
					</view>
					<view class="w-full flex flex-wrap px-15">
						<view v-for="(item, index) in pageData.searchHistoryList" :key="index"
							class="bg-[#F5F6F8] w-76 h-38 my-5 mr-14 rounded-10 text-center leading-38">
							<text @click='handlehistory(item)'>{{ item }}</text>
						</view>
					</view>
				</view>

			</view>
			<view v-if="!pageData.searchHistoryList.length">
				<u-empty mode="history" icon="http://cdn.uviewui.com/uview/empty/history.png">
				</u-empty>
			</view>
			<!-- 搜索历史 -->
			<!-- 菜单 -->
			<view class="w-full bg-white pb-15" v-show="!isShowHistory">
				<view class="flex ml-10">
					<view v-for="(waterItem, index) in pageData.waterfallItems" :key="index" class="mr-28 "
						@click="changeWaterfall(index)">
						<view :class="pageData.currentIndex == index ? 'active' : 'inactive'">{{ waterItem.name }}</view>
						<view class=" h-4 relative -top-5 ">
							<image src="/static/mine/line.png" class="w-30 h-4 " v-show="pageData.currentIndex == index" />
						</view>
					</view>
				</view>

			</view>
			<!-- 菜单 -->
		</view>
		<view class="mt-70" v-show="!isShowHistory">
			<view v-for="(waterItem, waterIndex) in pageData.waterfallItems" :key="waterIndex">
				<view v-if="!waterItem.items.length && waterIndex == pageData.currentIndex"
					class="h-screen flex items-center justify-center">
					<u-empty mode="search" icon="http://cdn.uviewui.com/uview/empty/search.png">
					</u-empty>
				</view>
				<view v-show="waterIndex == pageData.currentIndex">
					<waterfall :isComplete="waterItem.isComplete" :itemType="waterItem.itemType" :value="waterItem.items"
						:waterIndex="waterIndex" :currentIndex="pageData.currentIndex">
					</waterfall>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import waterfall from '@/components/index/waterfall.vue'
import { opusSearchNew } from "@/api/worksSearch/index.js"
import { ref, onMounted, reactive, watch, computed, getCurrentInstance } from 'vue'
import { onReachBottom, onLoad, onPageScroll, onShow } from '@dcloudio/uni-app';
import useLoginTokenStore from '@/store/modules/loginToken'
import _ from 'lodash'
const searchvalue = ref('')
const isShowHistory = ref(true)
onMounted(() => {
	changeWaterfall(0)
	uni.getStorage({
		key: 'gugusearchList',
		success: function (res) {
			pageData.searchHistoryList = JSON.parse(res.data)
		}
	})
})
const waterfallItems = [
	{
		scrollTop: -1, isComplete: false, isLoading: false, itemType: 'title', name: '综合', items: [],
		query: {
			path: { type: 1, pageNum: 1, pageSize: 10, searchTime: "", keyword: '' },
			data: { passTime: '' }
		}
	},
	{
		scrollTop: -1, isComplete: false, isLoading: false, itemType: 'title', name: '文章', items: [], query: {
			path: {
				type: 2, pageNum: 1, pageSize: 10, searchTime: "", keyword: ''
			},
			data: { passTime: '' }
		}
	},
	{
		scrollTop: -1, isComplete: false, isLoading: false, name: '视频', items: [], query: {
			path: {
				type: 3, pageNum: 1, pageSize: 10, searchTime: "", keyword: ''
			},
			data: { passTime: '' }
		}
	}
]
const pageData = reactive({
	searchHistoryList: [],
	scrollTop: 0,
	currentIndex: 0,
	waterfallItems: _.cloneDeep(waterfallItems),
})
watch(() => useLoginTokenStore().get().accessToken, (newVal, oldVal) => {
	pageData.waterfallItems = _.cloneDeep(waterfallItems)
	pageData.waterfallItems.forEach((item, index) => {
		item.query.path.keyword = searchvalue.value
	})
	changeWaterfall(pageData.currentIndex)
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
		if (pageData.waterfallItems[waterIndex].scrollTop != -1) {
			uni.pageScrollTo({
				scrollTop: pageData.waterfallItems[waterIndex].scrollTop,
				duration: 300
			});
		}
	}
}
const getData = () => {
	let currentIndex = pageData.currentIndex
	pageData.waterfallItems[currentIndex].isLoading = true
	let query = pageData.waterfallItems[currentIndex].query
	opusSearchNew({ ...query.path }).then(res => {
		if (res.data.page == res.data.totalPage) {
			pageData.waterfallItems[currentIndex].isComplete = true
		}
		pageData.waterfallItems[currentIndex].query.path.searchTime = res.data.serviceTime
		pageData.waterfallItems[currentIndex].items = pageData.waterfallItems[currentIndex].items.concat(res.data.list)
		pageData.waterfallItems[currentIndex].isLoading = false
	}).catch(e => {
		pageData.waterfallItems[currentIndex].isLoading = false
	})

}
onPageScroll((res) => {
	pageData.scrollTop = res.scrollTop
})
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
	font-size: 16px;
	font-family: Source Han Sans SC;
	font-weight: bold;
	color: #272A29;
}

.inactive {
	font-size: 15px;
	font-family: Source Han Sans SC;
	font-weight: 400;
	color: #999999;
}
</style>