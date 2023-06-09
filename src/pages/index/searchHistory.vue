<template>
	<view>
		<!-- 搜索框 -->
		<view class="search">
			<view style="display: flex;align-items: center;">
				<text class="iconfont icon-sousuo position-absolute text-muted"></text>
				<input class="searchInput" v-model="inputValue" @confirm="search" placeholder="搜索" type="text" />
			</view>
			<view>取消</view>
		</view>
		<!-- 搜索框 -->

		<!-- 搜索历史 -->
		<view class="searchHistory">
			<view
				style="display: flex;align-items: center;justify-content: space-between;box-sizing: border-box;padding: 0px 5px;">
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
		<!-- 搜索内容 -->
		<view>
			<u-tabs :list="menuList" lineWidth="40" lineColor="#f56c6c" :activeStyle="{
				color: '#303133',
				fontWeight: 'bold',
				transform: 'scale(1.05)'
			}" :inactiveStyle="{
	color: '#606266',
	transform: 'scale(1)'
}" itemStyle="padding-left: 15rpx; padding-right: 15rpx; height: 66rpx;" @click="menuClick">
			</u-tabs>
			<view>
				<!-- <waterFall  :paramsForm="paramsForm"></waterFall> -->
			</view>
		</view>
		<!-- 搜索内容 -->
	</view>
</template>

<script setup>
// import waterFall from "@/components/index/waterfall.vue"
import { reactive, ref } from 'vue';
import { onLoad, onShow } from "@dcloudio/uni-app";
onLoad(() => {
})
const paramsForm = ref({
	"keyword": "",
	"pageNum": 1,
	"pageSize": 10,
	"searchTime": "",
	"type": 0
})
const addRef = ref();
const isShowHistory = ref(true)
const menuList = reactive([{
	name: '综合',
}, {
	name: '文章',
}, {
	name: '视频'
},
{
	name: '用户'
}
])
const inputValue = ref('')
const searchHistoryList = ref([])
const menuClick = (item) => {
	paramsForm.value.type = item.index
}
const search = () => {
	if (inputValue.value == '') {
		uni.showModal({
			title: '搜索内容不能为空'
		});
	} else {
		paramsForm.value.keyword = inputValue.value
		isShowHistory.value = false
		if (!searchHistoryList.value.includes(inputValue.value)) {
			searchHistoryList.value.unshift(inputValue.value);
			uni.setStorage({
				key: 'searchList',
				data: JSON.stringify(searchHistoryList.value)
			});
		} else {
			//有搜索记录，删除之前的旧记录，将新搜索值重新push到数组首位
			let i = searchHistoryList.value.indexOf(inputValue.value);
			searchHistoryList.value.splice(i, 1);
			searchHistoryList.value.unshift(inputValue.value);
			uni.showToast({
				title: '不能重复添加'
			});
			uni.setStorage({
				key: 'searchList',
				data: JSON.stringify(searchHistoryList.value)
			});
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
</script>

<style scoped>
.search {
	width: 100%;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
	padding: 0px 15px;
}

.searchInput {
	background-color: #f8f9fa;
	width: 220px;
	margin-left: 5px;
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


