<template>
	<view class="content">
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
					<u-tabs :list="menuList" lineWidth="40" lineColor="#f56c6c" :activeStyle="{
	            color: '#303133',
	            fontWeight: 'bold',
	            transform: 'scale(1.05)'
	          }" :inactiveStyle="{
	  color: '#606266',
	  transform: 'scale(1)'
	}" itemStyle="padding-left: 15rpx; padding-right: 15rpx; height: 66rpx;" @click="menuClick">
					</u-tabs>
				</view>
				<view class="flex items-center">更多
					<uni-icons type="bottom" size="26" v-if="iconType == 'bottom'"></uni-icons>
					<uni-icons type="top" size="26" v-else></uni-icons>
				</view>
			</view>
		</view>
		<view class="" v-if="show">
			<eimlFlow :list="list" :columnNum="2"></eimlFlow>
		</view>
	</view>
</template>

<script setup>
	import eimlFlow from "@/components/eiml-flow-layout/eiml-flow-layout.vue"
	import {
		opusSearchNew,
		opusSearchArticle,
		opusSearchVideo
	} from "@/api/worksSearch/index.js"
	import {
		ref,
		reactive,
		watch,
		computed,
		getCurrentInstance,
		onMounted
	} from 'vue';
	import {
		onReachBottom,
		onLoad
	} from '@dcloudio/uni-app';
	const internalInstance = getCurrentInstance()
	const inputValue = ref('')
	const isShowHistory = ref(true)
	const show = ref(true)
	const iconType = ref('bottom')
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
	const list = ref([])
	const paramsForm = ref({
		"keyword": "",
		"pageNum": 1,
		"pageSize": 10,
		"searchTime": "",
		"type": 0
	})

	function menuClick(item) {
		paramsForm.value.pageSize=10
		paramsForm.value.type = item.index
		getDataApi()
	}
	const search = () => {
		if (inputValue.value == '') {
			uni.showModal({
				title: '搜索内容不能为空'
			});
		} else {
			paramsForm.value.pageSize=10
			paramsForm.value.keyword = inputValue.value
			isShowHistory.value = false
			getDataApi()
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
	onMounted(() => {
		getDataApi()
	})
	const getDataApi = () => {
		if (paramsForm.value.type == 0) {
			show.value = false
			opusSearchNew(paramsForm.value).then(res => {
				show.value = true
				list.value = [...res.data.list]
			})
		} else if (paramsForm.value.type == 1) {
			show.value = false
			opusSearchArticle(paramsForm.value).then(res => {
				show.value = true
				list.value = [...res.data.list]
			})
		} else if (paramsForm.value.type == 2) {
			show.value = false
			opusSearchVideo(paramsForm.value).then(res => {
				show.value = true
				list.value = [...res.data.list]
			})
		}
		//操作数据后更新视图
		internalInstance.ctx.$forceUpdate()
	}
	watch(() => paramsForm.value.type, (newV, oldV) => {
		getDataApi()
	}, {
		deep: true,
		immediate: true
	})
	onReachBottom(() => {
		console.log('触底了')
		paramsForm.value.pageSize+=10
		if (paramsForm.value.type == 0) {
			opusSearchNew(paramsForm.value).then(res => {
				list.value = [...res.data.list]
			})
		} else if (paramsForm.value.type == 1) {
			opusSearchArticle(paramsForm.value).then(res => {
				list.value = [...res.data.list]
			})
		} else if (paramsForm.value.type == 2) {
			opusSearchVideo(paramsForm.value).then(res => {
				list.value = [...res.data.list]
			})
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