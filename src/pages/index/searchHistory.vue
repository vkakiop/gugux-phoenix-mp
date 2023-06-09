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
				<view v-if="paramsForm.type === 0">
					<view class="waterfalls-flow">
						<view v-for="(item, index) in data.column" :key="index" class="waterfalls-flow-column"
							:style="{ 'width': w, 'margin-left': index == 0 ? 0 : m }"
							:id="`waterfalls_flow_column_${index + 1}`">
							<view class="column-value" v-for="(item2, index2) in data[`column_${index + 1}`]" :key="index2">
								<view class="" v-if="item2.title">
									<!-- itemType=2是图片，itemtpye=3是视频 -->
									<view v-if="item2.cover.itemType == 2" @click="skipDetails(item2)">
										<image :src="item2.cover.content" mode="widthFix" @load="imgLoad(item2)"
											@error="imgError(item2)" class="imgsty">
										</image>
									</view>
									<view class="viewSty" v-else @click="skipVideo">
										<image src="/static/img/video.png" class="imgSize"></image>
										<image :src="item2.cover.thumbnail" mode="widthFix" @load="imgLoad(item2)"
											@error="imgError(item2)" class="imgsty"></image>
									</view>
									<text>{{ item2.title }} 我是第{{ index + 1 }}列我是第{{ index2 }}个</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="paramsForm.type === 1">
					<view class="waterfalls-flow">
						<view v-for="(item, index) in data.column" :key="index" class="waterfalls-flow-column"
							:style="{ 'width': w, 'margin-left': index == 0 ? 0 : m }"
							:id="`waterfalls_flow_column_${index + 1}`">
							<view class="column-value" v-for="(item2, index2) in data[`column_${index + 1}`]" :key="index2">
								<view class="" v-if="item2.title">
									<!-- itemType=2是图片，itemtpye=3是视频 -->
									<view v-if="item2.cover.itemType == 2" @click="skipDetails(item2)">
										<image :src="item2.cover.content" mode="widthFix" @load="imgLoad(item2)"
											@error="imgError(item2)" class="imgsty">
										</image>
									</view>
									<view class="viewSty" v-else @click="skipVideo">
										<image src="/static/img/video.png" class="imgSize"></image>
										<image :src="item2.cover.thumbnail" mode="widthFix" @load="imgLoad(item2)"
											@error="imgError(item2)" class="imgsty"></image>
									</view>
									<text>{{ item2.title }} 我是第{{ index + 1 }}列我是第{{ index2 }}个</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="paramsForm.type === 2">
					<view class="waterfalls-flow">
						<view v-for="(item, index) in data.column" :key="index" class="waterfalls-flow-column"
							:style="{ 'width': w, 'margin-left': index == 0 ? 0 : m }"
							:id="`waterfalls_flow_column_${index + 1}`">
							<view class="column-value" v-for="(item2, index2) in data[`column_${index + 1}`]" :key="index2">
								<view class="" v-if="item2.title">
									<!-- itemType=2是图片，itemtpye=3是视频 -->
									<view v-if="item2.cover.itemType == 2" @click="skipDetails(item2)">
										<image :src="item2.cover.content" mode="widthFix" @load="imgLoad(item2)"
											@error="imgError(item2)" class="imgsty">
										</image>
									</view>
									<view class="viewSty" v-else @click="skipVideo">
										<image src="/static/img/video.png" class="imgSize"></image>
										<image :src="item2.cover.thumbnail" mode="widthFix" @load="imgLoad(item2)"
											@error="imgError(item2)" class="imgsty"></image>
									</view>
									<text>{{ item2.title }} 我是第{{ index + 1 }}列我是第{{ index2 }}个</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 搜索内容 -->
	</view>
</template>

<script setup>
import {
	ref,
	reactive,
	watch,
	computed,
	getCurrentInstance,
	onMounted
} from 'vue';
import { opusSearchNew, opusSearchArticle, opusSearchVideo } from "@/api/worksSearch/index.js"
import {
	onReachBottom
} from '@dcloudio/uni-app';
import { list } from 'postcss';
const paramsForm = reactive({
	"keyword": "",
	"pageNum": 1,
	"pageSize": 10,
	"searchTime": "",
	"type": 0
})
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
const _this = getCurrentInstance();
const data = reactive({
	list: [],
	column: 2,
	columnSpace: 2,
});
// 计算列宽
const w = computed(() => {
	const column_rate = `${100 / data.column - (+data.columnSpace)}%`;
	return column_rate;
})
// 计算margin
const m = computed(() => {
	const column_margin = `${(100 - (100 / data.column - (+data.columnSpace)).toFixed(5) * data.column) / (data.column - 1)}%`;
	return column_margin;
})
// 每列的数据初始化
for (let i = 1; i <= data.column; i++) {
	data[`column_${i}`] = [];
}
// 获取最小值的对象
const getMin = (a, s) => {
	let m = a[0][s];
	let mo = a[0];
	for (var i = a.length - 1; i >= 0; i--) {
		if (a[i][s] < m) {
			m = a[i][s];
		}
	}
	mo = a.filter(i => i[s] == m);
	return mo[0];
}
// 计算每列的高度
function getMinColumnHeight() {
	return new Promise(resolve => {
		const heightArr = [];
		for (let i = 1; i <= data.column; i++) {
			const query = uni.createSelectorQuery().in(_this);
			query.select(`#waterfalls_flow_column_${i}`).boundingClientRect(data => {
				heightArr.push({
					column: i,
					height: data.height
				});
			}).exec(() => {
				if (data.column <= heightArr.length) {
					// console.log(heightArr);
					resolve(getMin(heightArr, 'height'));
				}
			});
		}
	})
};
async function initValue(i) {
	if (i >= data.list.length) return false;
	const minHeightRes = await getMinColumnHeight();
	data[`column_${minHeightRes.column}`].push({
		...data.list[i],
		index: i
	});
}
onMounted(() => {
	initValue(0);
})
// 图片加载完成
function imgLoad(item) {
	const i = item.index;
	initValue(i + 1);
}
// 图片加载失败
function imgError(item) {
	const i = item.index;
	initValue(i + 1);
}
const menuClick = (item) => {
	paramsForm.type = item.index
	getDataApi()
}
const search = () => {
	if (inputValue.value == '') {
		uni.showModal({
			title: '搜索内容不能为空'
		});
	} else {
		paramsForm.keyword = inputValue.value
		isShowHistory.value = false
		getDataApi()
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
const getDataApi = () => {
	if (paramsForm.type === 0) {
		opusSearchNew(paramsForm).then(res => {
			// console.log('type === 0', res.data.list);
			for (let i = 1; i <= 2; i++) {
				data[`column_${i}`] = [];
			}
			data.list = [...res.data.list]
			initValue(0);
		})
	} else if (paramsForm.type === 1) {
		opusSearchArticle(paramsForm).then(res => {
			// console.log('type === 1', res.data.list);
			for (let i = 1; i <= 2; i++) {
				data[`column_${i}`] = [];
			}
			data.list = [...res.data.list]
			initValue(0);
		})
	} else if (paramsForm.type === 2) {
		opusSearchVideo(paramsForm).then(res => {
			// console.log('type === 2', res.data);
			for (let i = 1; i <= 2; i++) {
				data[`column_${i}`] = [];
			}
			data.list = [...res.data.list]
			initValue(0);
		})
	}
}
const skipDetails = (item) => {
	uni.navigateTo({
		url: `/pages/opus/index?id=${item.id}`
	})
}
</script>

<style scoped lang="scss">
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

.waterfalls-flow {
	padding-top: 50upx;

	&-column {
		float: left;
		padding: 0 0 200upx;
	}
}

.column-value {
	width: 100%;
}

.imgsty {
	width: 100%
}


.viewSty {
	position: relative;

	.imgSize {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 60px;
		height: 60px;
		margin-left: -30px;
		margin-top: -30px;
		z-index: 99;
	}
}
</style>


