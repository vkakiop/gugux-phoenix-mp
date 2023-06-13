<template>
	<view>
		<view class="relative p-10  mb-10 ">
			<icon type="search" size="26" class="absolute right-0" @click="skipHistory" />
		</view>
		<!-- 	<button @click="skipFriendDetail">好友详情</button> -->
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
}" itemStyle="padding-left: 15rpx; padding-right: 15rpx; height: 66rpx;" @change="menuClick">
					</u-tabs>
				</view>
				<view class="flex items-center">更多
					<uni-icons type="bottom" size="26" @click="drowDown('top')" v-if="iconType == 'bottom'"></uni-icons>
					<uni-icons type="top" size="26" @click="drowDown('bottom')" v-else></uni-icons>
				</view>
			</view>
		</view>
		<view class="gridBox" v-if="iconType == 'top'">
			<uni-grid :column="3" :show-border="false" :square="false" @change="change">
				<uni-grid-item v-for="(item, index) in list" :index="index" :key="index">
					<view class="grid-item-box  ">
						<text class="text">{{ item.text }}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
		<!-- 瀑布流 -->
		<view class="padding-top-lg">
			<view class="waterfalls-flow">
				<view v-for="(item, index) in data.column" :key="index" class="waterfalls-flow-column"
					:style="{ 'width': w, 'margin-left': index == 0 ? 0 : m }" :id="`waterfalls_flow_column_${index + 1}`">
					<view class="column-value" v-for="(item2, index2) in data[`column_${index + 1}`]" :key="index2">
						<view class="" v-if="item2.title">
							<!-- itemType=2是图片，itemtpye=3是视频 -->
							<view v-if="item2.cover.itemType == 2" @click="skipDetails(item2)">
								<image :src="item2.cover.content" mode="widthFix" @load="imgLoad(item2)"
									@error="imgError(item2)" class="imgsty">
								</image>
							</view>
							<view class="viewSty" v-else @click="skipVideo(item2)">
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
		<!-- 瀑布流 -->
		<u-modal :show="show" @confirm="confirmShow" @cancel="closeShow" title="紧急通知" confirmColor="#D9001B"
			cancelColor="#0000FF" showCancelButton ref="uModal" confirmText="去导航" cancelText="查看详情">
			<view class="slot-content">
				<rich-text :nodes="content"></rich-text>
			</view>
		</u-modal>

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
import {
	opusSearchNew,
	opusSearchArticle,
	opusSearchVideo
} from "@/api/worksSearch/index.js"
import {
	onShow,
	onReachBottom
} from "@dcloudio/uni-app"
const paramsForm = ref({
	"keyword": "",
	"pageNum": 1,
	"pageSize": 20,
	"searchTime": "",
	"type": 0
})
const loginToken = ref({})
const iconType = ref('bottom')
const menuList = reactive([{
	name: '推荐',
}, {
	name: '文章',
}, {
	name: '视频'
},
{
	name: '游记'
},
{
	name: '车友圈'
},
{
	name: '逛吃'
}
])
const show = ref(false);
const content = ref('');
content.value = '您的好友等第十三月(1511837394)在重庆市四川商会触发了紧急通知，请点击电话联系或导航前往。'
const confirmShow = () => {
	show.value = false;
	console.log('去导航');
	// uni.navigateTo({ url: '/pages/emergencycontact/index?id=' + encodeURIComponent(13333333333) })
	uni.navigateTo({ url: '/pages/safeguard/gonavigation?id=' + encodeURIComponent(123) })
}
const closeShow = () => {
	show.value = false;
	console.log('查看详情');
	uni.navigateTo({ url: '/pages/safeguard/safeguarddetail?id=' + encodeURIComponent(123) })
}

function onClickItem(e) {
	if (current.value !== e.currentIndex) {
		console.log(e.currentIndex);
		current.value = e.currentIndex
	}
}
function drowDown(item) {
	iconType.value = item
	console.log('点击了下拉');
}
function skipHistory() {
	uni.navigateTo({
		url: `/pages/index/searchHistory`
	})
}
// 瀑布流数据
// 监听父子通信的数据的变化
const _this = getCurrentInstance();
const data = reactive({
	list: [{
		image: '',
	},],
	column: 2,
	columnSpace: 1,
});
const getDataApi = () => {
	if (paramsForm.value.type === 0) {
		opusSearchNew(paramsForm.value).then(res => {
			if (res.data.list.length >= 10) {
				data.list = [...data.list, ...res.data.list]
			} else {
				uni.showToast({
					title: '没有更多了',
					icon: 'none'
				})
			}
		})
	} else if (paramsForm.value.type === 1) {
		opusSearchArticle(paramsForm.value).then(res => {
			if (res.data.list.length >= 10) {
				data.list = [...data.list, ...res.data.list]
			} else {
				uni.showToast({
					title: '没有更多了',
					icon: 'none'
				})
			}
		})
	} else if (paramsForm.value.type === 2) {
		opusSearchVideo(paramsForm.value).then(res => {
			if (res.data.list.length >= 10) {
				data.list = [...data.list, ...res.data.list]
			} else {
				uni.showToast({
					title: '没有更多了',
					icon: 'none'
				})
			}
		})
	}
}
// 计算列宽
const w = computed(() => {
	const column_rate = `${100 / data.column - (+data.columnSpace)}%`;
	//49%
	return column_rate;
})
// 计算margin
const m = computed(() => {
	const column_margin = `${(100 - (100 / data.column - (+data.columnSpace)).toFixed(5) * data.column) / (data.column - 1)}%`;
	//2%
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

function skipDetails(item2) {
	uni.navigateTo({
		url: `/pages/opus/index?id=${item2.id}`
	})
}
onMounted(() => {
	initValue(0);
	getDataApi()
})
// 监听数据的变化
watch(() => data.list, (newValue, oldValue) => {
	const oldLength = oldValue ? oldValue.length : 0;
	data.list = newValue;
	if (oldLength > 0) initValue(oldLength);
}, {
	immediate: true
});
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
const skipVideo = (item) => {
	uni.navigateTo({
		url: '/pages/VideoCarousel/VideoCarousel?id=' + item.id
	})
}
// 瀑布流数据
function menuClick(item) {
	if (paramsForm.value.type != item.index) {
		paramsForm.value.type = item.index
		// 每列的数据初始化
		initValue(0);
		for (let i = 1; i <= data.column; i++) {
			data[`column_${i}`] = [];
		}
		if (paramsForm.value.type === 0) {
			opusSearchNew(paramsForm.value).then(res => {
				// console.log('paramsForm.value.type==0', res.data.list);
				if (res.data.list.length >= 10) {
					data.list = res.data.list
				} else {
					uni.showToast({
						title: '没有更多了',
						icon: 'none'
					})
				}
			})
		} else if (paramsForm.value.type === 1) {
			opusSearchArticle(paramsForm.value).then(res => {
				// console.log('paramsForm.value.type==1', res.data.list);
				if (res.data.list.length >= 10) {
					data.list = res.data.list
				} else {
					uni.showToast({
						title: '没有更多了',
						icon: 'none'
					})
				}
			})
		} else if (paramsForm.value.type === 2) {
			opusSearchVideo(paramsForm.value).then(res => {
				// console.log('paramsForm.value.type==2', res.data.list);
				if (res.data.list.length >= 10) {
					data.list = res.data.list
				} else {
					uni.showToast({
						title: '没有更多了',
						icon: 'none'
					})
				}
			})
		}
	}
}
onShow(() => {
	loginToken.value = getApp().globalData.loginToken
})

function change(e) {
	let {
		index
	} = e.detail
	uni.showToast({
		title: `点击第${index + 1}个宫格`,
		icon: 'none'
	})
}

const skipFriendDetail = () => {
	uni.navigateTo({
		url: '/pages/friendDetail/friendDetail'
	})
}
onReachBottom(() => {
	paramsForm.value.pageSize += 10
	getDataApi()
})
</script>

<style lang="scss" scoped>
.uni-common-mt {
	margin-top: 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.gridBox {
	border: 1px solid #838383;
	background-color: white;
	width: 100vw;
	position: absolute;
	top: 24vw;
	z-index: 999;

	.grid-item-box {
		padding: 20rpx 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.text {
			border: 1px solid blue;
			display: inline;
			width: 100rpx;
			text-align: center;
			border-radius: 8px;
			padding: 14px;
		}

	}
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
}</style>