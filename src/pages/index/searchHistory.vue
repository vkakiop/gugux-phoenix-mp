<template>
	<view class="bg-gray-100">
		<view class="fixed -top-5 py-10 bg-[#fff] z-50 w-full">
			<!-- 搜索框 -->
			<view class="bg-white w-full py-10 ">
				<view class="search">
					<view class="flex items-center mx-14  bg-[#fff]  h-39 w-260 rounded-40 border-1 border-[#E3E3E3] text-14">
						<icon type="search" size="11" class="mx-10" />
						<input class="bg-[#fff]   w-220" v-model="searchvalue" @confirm="search"
							placeholder="请输入搜索关键字" type="text" />
					</view>
					<view @click="search">搜索</view>
				</view>
			</view>
			<!-- 搜索框 -->
			<!-- 搜索历史 -->
			<view class="w-full mt-5" v-if="isShowHistory">
				<view v-if="pageData.searchHistoryList.length">
					<view
						style="display: flex;align-items: center;justify-content: space-between;box-sizing: border-box;padding: 0px 5px;">
						<view>搜索历史:</view>
						<view style="color: red;font-size: 28px;" @click="empty"><uni-icons type="trash"
								size="30"></uni-icons>
						</view>
					</view>
					<view class="w-full flex flex-wrap">
						<view v-for="(item, index) in pageData.searchHistoryList" :key="index" class="h-20 mx-5">
							<text @click='handlehistory(item)' class="bg-gray-200 px-10 py-5 rounded-20">{{ item }}</text>
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
			<view class="w-full bg-white py-10" v-show="!isShowHistory">
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
		<view class="pt-100" v-show="!isShowHistory">
			<view v-for="(waterItem, waterIndex) in pageData.waterfallItems" :key="waterIndex">
				<view v-if="!waterItem.items.length && waterIndex == pageData.currentIndex" class="h-500 flex items-center justify-center">
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
watch(()=>useLoginTokenStore().get().accessToken,(newVal,oldVal)=>{
  pageData.waterfallItems = _.cloneDeep(waterfallItems)
  pageData.waterfallItems.forEach((item,index)=>{
	item.query.path.keyword=searchvalue.value
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
onReachBottom(() => {
	let currentIndex = pageData.currentIndex
	if (!pageData.waterfallItems[currentIndex].isComplete && !pageData.waterfallItems[currentIndex].isLoading) {
		pageData.waterfallItems[currentIndex].query.path.pageNum++
		getData()
	}
})
</script>

<style scoped lang="scss">
.search {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
}
</style>