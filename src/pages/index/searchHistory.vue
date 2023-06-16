搜索历史
<template>
	<view class="bg-gray-100">
		<view class="fixed -top-5 py-10 bg-[#fff] z-50">
			<!-- 搜索框 -->
			<view class="bg-white w-full pt-10 ">
				<view class="search ">
					<view class="flex items-center  bg-[#F7F7F7] w-300 rounded-40 border-1 border-[#E3E3E3]">
						<icon type="search" size="15" class="ml-10" />
						<input class="bg-[#F7F7F7] ml-10  w-220" v-model="searchvalue" placeholder="请输入搜索关键字" type="text" />
					</view>
					<view @click="search">搜索</view>
				</view>
			</view>
			<!-- 搜索框 -->
			<!-- 搜索历史 -->
			<view class="searchHistory" v-if="isShowHistory">
				<view style="display: flex;align-items: center;justify-content: space-between;box-sizing: border-box;padding: 0px 5px;">
					<view>搜索历史:</view>
					<view style="color: red;font-size: 28px;" @click="empty"><uni-icons type="trash" size="30"></uni-icons>
					</view>
				</view>
				<view class="searchHistoryItem">
					<view v-for="(item, index) in searchHistoryList" :key="index">
						<text>{{ item }}</text>
					</view>
				</view>
			</view>
			<!-- 搜索历史 -->
			<!-- 菜单 -->
			<view class="w-full bg-[#fff] py-10" v-show="!isShowHistory">
				<view class="flex ml-10">
					<view v-for="(waterItem, index) in pageData.waterfallItems" class="mr-28 w-36 " @click="changeWaterfall(index)">
						<view :class="pageData.currentIndex == index?'active':'inactive'">{{waterItem.name}}</view>
						<view class=" h-4 relative -top-5 ">
							<image src="/static/mine/line.png" class="w-30 h-4 " v-show="pageData.currentIndex == index" />
						</view>
					</view>
				</view>
			</view>
			<!-- 菜单 -->
		</view>
		<view class="pt-100" v-show="!isShowHistory">
			<view v-for="(waterItem,waterIndex) in pageData.waterfallItems">
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
	import {
		opusSearchNew
	} from "@/api/worksSearch/index.js"
	import {
		ref,
		onMounted,
		reactive,
		watch,
		computed,
		getCurrentInstance
	} from 'vue'
	import {
		onReachBottom,
		onLoad,
		onPageScroll
	} from '@dcloudio/uni-app';
	const internalInstance = getCurrentInstance()
	const searchvalue = ref('')
	const isShowHistory = ref(true)
	const waterlist = ref([])
	onMounted(() => {
		changeWaterfall(0)
	})
	const pageData = reactive({
		scrollTop: 0,
		currentIndex: 0,
		waterfallItems: [{
				scrollTop: 0,
				isComplete: false,
				isLoading: false,
				itemType: 'title',
				name: '综合',
				items: [],
				query: {
					path: {
						type: 1,
						pageNum: 1,
						pageSize: 10,
						searchTime: "",
						keyword: ''
					},
					data: {
						passTime: ''
					}
				}
			},
			{
				scrollTop: 0,
				isComplete: false,
				isLoading: false,
				itemType: 'title',
				name: '文章',
				items: [],
				query: {
					path: {
						type: 2,
						pageNum: 1,
						pageSize: 10,
						searchTime: "",
						keyword: ''
					},
					data: {
						passTime: ''
					}
				}
			},
			{
				scrollTop: 0,
				isComplete: false,
				isLoading: false,
				name: '视频',
				items: [],
				query: {
					path: {
						type: 3,
						pageNum: 1,
						pageSize: 10,
						searchTime: "",
						keyword: ''
					},
					data: {
						passTime: ''
					}
				}
			}
		],
	})
	const computedMenuItems = computed(() => {
		return pageData.waterfallItems.map(item => {
			return {
				name: item.name
			}
		})
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
		opusSearchNew({
			...query.path
		}).then(res => {
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
	const search = () => {
		isShowHistory.value = false
		pageData.waterfallItems.forEach(item => {
			item.query.path.keyword = searchvalue.value
			item.items = []
			item.scrollTop = 0
		})
		getData()
	}
	const empty = () => {
		uni.showToast({
			title: '已清空'
		});
		uni.removeStorage({
			key: 'searchList'
		});
		searchHistoryList.value = [];
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
	.uni-common-mt {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.search {
		width: 100%;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0px 15px;
	}

	.searchHistory {
		width: 100%;
		margin-top: 5px;
	}

	.searchHistoryItem {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	.searchHistoryItem view {
		/* width: 50px; */
		height: 20px;
		border: 1px solid #eee;
		margin: 0px 5px;
	}
</style>