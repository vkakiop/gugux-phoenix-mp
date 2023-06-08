<template>
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
	onReachBottom,
} from '@dcloudio/uni-app';
import {
	getClassify
} from "@/api/workList/work.js"
const props = defineProps({
	paramsForm: {
		type: Object,
		default: {}
	}
})
const paramsForm = ref(
	{
		"keyword": "",
		"pageNum": 1,
		"pageSize": 10,
		"searchTime": "",
		"type": 0
	}
)
// 监听父子通信的数据的变化
watch(props.paramsForm, (newValue, oldValue) => {
	console.log(newValue);
	paramsForm.value = newValue
	getDataApi()
});
const pageData = reactive({
})

const _this = getCurrentInstance();
const data = reactive({
	list: [{
		image: '',
	},],
	column: 2,
	columnSpace: 1,
});
// 数据赋值
let s = 1
const getDataApi = () => {
	if (paramsForm.value.type === 0) {
		opusSearchNew(paramsForm.value).then(res => {
			console.log('type === 0', res.data);
			let {
				list
			} = res.data
			if (list.length == 10) {
				data.list = [...list]
				s++
			} else {
				uni.showToast({
					title: '没有更多了',
					icon: 'none'
				})
			}
		})
	} else if (paramsForm.value.type === 1) {
		opusSearchArticle(paramsForm).then(res => {
			console.log('type === 1', res.data);
			let {
				list
			} = res.data
			if (list.length == 10) {
				data.list = [...list]
				s++
			} else {
				uni.showToast({
					title: '没有更多了',
					icon: 'none'
				})
			}
		})
	} else if (paramsForm.value.type === 2) {
		opusSearchVideo(paramsForm).then(res => {
			console.log('type === 2', res.data);
			let {
				list
			} = res.data
			if (list.length == 10) {
				data.list = [...list]
				s++
			} else {
				uni.showToast({
					title: '没有更多了',
					icon: 'none'
				})
			}
		})
	}
}
const fetch = () => {
	getClassify({}, s).then(res => {
		let {
			list
		} = res.data
		if (list.length == 10) {
			data.list = [...data.list, ...list]
			s++
		} else {
			uni.showToast({
				title: '没有更多了',
				icon: 'none'
			})
		}
	})
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
	// fetch()
	getDataApi()
})
onReachBottom(() => {
	// fetch()
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
const skipVideo = () => {
	uni.navigateTo({
		// url:'/pages/VideoCarousel/VideoCarousel?id=2271797284497418261'
		url: '/pages/VideoCarousel/VideoCarousel?id=1805042228997966063'
	})
}
</script>

<style scoped lang="scss">
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