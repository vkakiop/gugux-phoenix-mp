<template>
	<view class="bg-gray-100">
		<!-- 搜索框 -->
		<view class="search ">
			<view class="flex items-center  bg-[#F7F7F7] w-300 rounded-40 border-1 border-[#E3E3E3]">
				<icon type="search" size="26" class="ml-10" />
				<input class="bg-[#F7F7F7] ml-10  w-220" v-model="searchvalue" placeholder="请输入搜索关键字" type="text" />
			</view>
			<view @click="search">搜索</view>
		</view>
		<!-- 搜索框 -->
		<!-- 搜索历史 -->
		<view class="searchHistory">
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
		<view>
			<view class="uni-common-mt">
				<view style="flex:2">
					<u-tabs :list="computedMenuItems" lineWidth="40" lineColor="#f56c6c" :activeStyle="{
	            color: '#303133',
	            fontWeight: 'bold',
	            transform: 'scale(1.05)'
	          }" :inactiveStyle="{
	  color: '#606266',
	  transform: 'scale(1)'
	}" itemStyle="padding-left: 15rpx; padding-right: 15rpx; height: 66rpx;" @click="(item)=>changeWaterfall(item.index)">
					</u-tabs>
				</view>
			</view>
		</view>
		<view >
			<view v-for="(waterItem,waterIndex) in pageData.waterfallItems">
				<view v-show="waterIndex == pageData.currentIndex">
					<waterfall :isComplete="waterItem.isComplete" :itemType="waterItem.itemType" :value="waterItem.items" :waterIndex="waterIndex">
					</waterfall>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import waterfall from '@/components/index/waterfall.vue'
	import {
		opusList
	} from '@/api/opus/list'
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
	const list = ref([])
	const paramsForm = reactive({
		"keyword": "",
		"pageNum": 1,
		"pageSize": 10,
		"searchTime": "",
		"type": 0
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
		if (searchvalue.value == '') {
			uni.showModal({
				title: '搜索内容不能为空'
			});
		} else {
			if (pageData.waterfallItems[0].query.path.keyword == searchvalue.value) {
				uni.showModal({
					title: '请修改搜索内容'
				});
			} else {
				pageData.waterfallItems.forEach((item) => {
					item.scrollTop = 0
					item.isComplete = false
					item.isLoading= false
					item.items = []
					item.query.path.keyword = searchvalue.value
					item.query.path.pageNum = 1
					item.query.path.searchTime = ''
				})

				getData()
			}
		}
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
	// 数据赋值

	const computedMenuItems = computed(() => {
		return pageData.waterfallItems.map(item => {
			return {
				name: item.name
			}
		})
	})
	onMounted(() => {
		changeWaterfall(0)
	})
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
		margin-top: 30rpx;
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