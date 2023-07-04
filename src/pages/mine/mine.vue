<template>
	<view v-if="pageInfo.mineMessage.guguId" class="bg-[#F6F6F6] h-screen">
		<view class="bg-[#fff] w-screen py-20 px-14 ">
			<view class="flex  pb-15  ">
				<view class=" border-2 border-[#fff] w-80 rounded-full h-80 iconShadow" @click="skipPerson">
					<image :src="pageInfo.mineMessage.icon" class="w-76 h-76 rounded-full" />
				</view>
				<view class="mx-11 pt-10">
					<view class="text-21">
						{{ pageInfo.mineMessage.nickname }}
					</view>
					<view class=" text-14 flex items-center mt-18">
						<image src="/static/mine/ID.png" class="w-15 h-15 " />
						<text class="ml-5 mr-15">{{ pageInfo.mineMessage.guguId }}</text>
						<!-- 	<image src="/static/mine/copy.png" class="w-15 h-15 ml-10" @click.stop="copy(pageInfo.mineMessage.guguId)" /> -->
					</view>
				</view>
			</view>
			<view class="flex text-14">
				<view class="line relative w-60  flex items-center">
					<view class="font-bold">{{ computedNumber(pageInfo.mineMessage.fans) }}</view>
					<view class="textStyle">&nbsp;关注</view>
				</view>
				<view class="line relative w-60 ml-10 flex items-center">
					<view class="font-bold">{{ computedNumber(pageInfo.mineMessage.focus) }}</view>

					<view class="textStyle">&nbsp;收藏</view>
				</view>
				<view class="w-60  ml-10 flex items-center">
					<view class="font-bold">{{ computedNumber(pageInfo.mineMessage.liked) }}</view>
					<view class="textStyle">&nbsp;获赞</view>
				</view>
			</view>
			<view class="Express text-14">
				<view class="info">
					<view :class="{ hide: !iSinfo }">
						<view v-if="pageInfo.mineMessage.introduce">
							{{ pageInfo.mineMessage.introduce }}
						</view>
						<view v-else>
							这家伙很懒，连介绍都没写~~
						</view>
					</view>
					<!-- <text @tap="showinfo" v-if="!iSinfo">展开</text> -->
				</view>
				<!-- <text @tap="showinfo" v-if="iSinfo" class="hidebtn">收起</text> -->
			</view>

		</view>
		<!-- 菜单 -->
		<view class="bg-white pl-14 w-full  pt-10 fixed top-0  left-0   z-50" v-if="pageData.isshowfixed">
			<view class="flex  text-center">
				<view v-for="(waterItem, index) in pageData.waterfallItems" :key="index" class="mr-26"
					@click="changeWaterfall(index)">
					<view :class="pageData.currentIndex == index ? 'active' : 'inactive'">{{ waterItem.name }} <text
							v-if="waterItem.query.data.totalCount">({{ waterItem.query.data.totalCount }})</text></view>
					<view class="-mt-5">
						<image src="/static/mine/line.png" class="w-34 h-4 " v-show="pageData.currentIndex == index" />
					</view>
				</view>
			</view>
		</view>
		<view class="bg-white pl-14 w-full  -mt-25 pt-10">
			<view class="flex text-center">
				<view v-for="(waterItem, index) in pageData.waterfallItems" :key="index" class="mr-26"
					@click="changeWaterfall(index)">
					<view :class="pageData.currentIndex == index ? 'active' : 'inactive'">{{ waterItem.name }} <text
							v-if="waterItem.query.data.totalCount">({{ waterItem.query.data.totalCount }})</text></view>
					<view class="-mt-5">
						<image src="/static/mine/line.png" class="w-34 h-4 " v-show="pageData.currentIndex == index" />
					</view>
				</view>
			</view>
		</view>
		<!-- 菜单 -->
		<view class="pt-13 bg-[#F6F6F6] ">
			<view v-for="(waterItem, waterIndex) in pageData.waterfallItems" :key="waterIndex">
				<view v-if="!waterItem.items.length && waterIndex == pageData.currentIndex"
					class="flex items-center justify-center mt-30">
					<u-empty text="内容为空" mode="list" icon="/static/img/nodata.png" />
				</view>
				<view v-if="waterIndex == pageData.currentIndex && waterItem.items.length">
					<waterfall :isComplete="waterItem.isComplete" :itemType="waterItem.itemType" :value="waterItem.items"
						:waterIndex="waterIndex" :currentIndex="pageData.currentIndex" itemKey="mine">
					</waterfall>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import waterfall from '@/components/index/waterfall.vue'
import { userhomepage, homepagelike, homepageopus, homepagecollection } from "@/api/mine/index.js"
import { ref, reactive, computed } from 'vue'
import { onShow, onReachBottom, onPageScroll } from "@dcloudio/uni-app"
import { getTokenValue } from "@/utils/utils"
import useLoginTokenStore from '@/store/modules/loginToken'
import useRouterStore from '@/store/modules/router'
import _ from 'lodash'
const computedNumber = computed({
	get: (num) => { return function (num) { return num > 9999 ? (num / 10000).toFixed(1) + 'w' : num } }
})
onShow(() => {
	if (getTokenValue()) {
		pageData.masterId = useLoginTokenStore().get().user.id
		fetchData()
		gettolcount()
	} else {
		useRouterStore().routerTo('/pages/mine/mine')
		// if (useRouterStore().getRouter('/pages/mine/mine')) {
		//   uni.switchTab({url:'/pages/index/index'})
		// }
		// else {
		//   needLogin()
		// }
	}
})
const waterfallItems = [{
	isshowfixed: false,
	scrollTop: -1,
	isComplete: false,
	isLoading: false,
	itemType: 'image',
	name: '作品',
	items: [],
	query: {
		path: { pageNum: 1, pageSize: 20, },
		data: { totalCount: '' }
	}
},
{
	scrollTop: -1,
	isComplete: false,
	isLoading: false,
	itemType: 'title',
	name: '喜欢',
	items: [],
	query: {
		path: { pageNum: 1, pageSize: 20, },
		data: { totalCount: '' }
	}
},
{
	scrollTop: -1,
	isComplete: false,
	isLoading: false,
	name: '收藏',
	items: [],
	query: {
		path: { pageNum: 1, pageSize: 20, },
		data: { totalCount: '' }
	}
}
]
const pageData = reactive({
	masterId: '',
	scrollTop: 0,
	currentIndex: 0,
	waterfallItems: _.cloneDeep(waterfallItems),
})
const iSinfo = ref(false)
const pageInfo = reactive({
	//个人信息数据
	mineMessage: {}
})
const changeWaterfall = (waterIndex) => {
	// if (pageData.currentIndex != waterIndex) {
	// 	//读取滚动条高度
	// 	pageData.waterfallItems[pageData.currentIndex].scrollTop = pageData.scrollTop
	// }
	pageData.waterfallItems[waterIndex].items = []
	pageData.currentIndex = waterIndex
	if (pageData.waterfallItems[waterIndex].items.length == 0) {
		getData()
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
	let currentIndex = pageData.currentIndex
	pageData.waterfallItems[currentIndex].isLoading = true
	let query = pageData.waterfallItems[currentIndex].query
	if (currentIndex === 0) {
		homepageopus({ masterId: pageData.masterId, ...query.path }).then(res => {
			if (res.data.page == res.data.totalPage) {
				pageData.waterfallItems[currentIndex].isComplete = true
			}
			pageData.waterfallItems[currentIndex].query.data.totalCount = res.data.totalCount
			pageData.waterfallItems[currentIndex].items = pageData.waterfallItems[currentIndex].items.concat(res.data.list)
			pageData.waterfallItems[currentIndex].isLoading = false
		}).catch(e => {
			pageData.waterfallItems[currentIndex].isLoading = false
		})
	} else if (currentIndex === 1) {
		homepagelike({ ...query.path }).then(res => {
			if (res.data.page == res.data.totalPage) {
				pageData.waterfallItems[currentIndex].isComplete = true
			}
			pageData.waterfallItems[currentIndex].query.data.totalCount = res.data.totalCount
			pageData.waterfallItems[currentIndex].items = pageData.waterfallItems[currentIndex].items.concat(res.data.list)
			pageData.waterfallItems[currentIndex].isLoading = false
		}).catch(e => {
			pageData.waterfallItems[currentIndex].isLoading = false
		})
	} else if (currentIndex === 2) {
		homepagecollection({ ...query.path }).then(res => {
			if (res.data.page == res.data.totalPage) {
				pageData.waterfallItems[currentIndex].isComplete = true
			}
			pageData.waterfallItems[currentIndex].query.data.totalCount = res.data.totalCount
			pageData.waterfallItems[currentIndex].items = pageData.waterfallItems[currentIndex].items.concat(res.data.list)
			pageData.waterfallItems[currentIndex].isLoading = false
		}).catch(e => {
			pageData.waterfallItems[currentIndex].isLoading = false
		})
	}
}
onPageScroll((res) => {
	// pageData.scrollTop = res.scrollTop
	// pageData.isshowfixed=true
	// console.log('滚动条',res.scrollTop);
	res.scrollTop > 172 ? pageData.isshowfixed = true : pageData.isshowfixed = false
})
onReachBottom(() => {
	let currentIndex = pageData.currentIndex
	if (!pageData.waterfallItems[currentIndex].isComplete && !pageData.waterfallItems[currentIndex].isLoading) {
		pageData.waterfallItems[currentIndex].query.path.pageNum++
		getData()
	}
})

const gettolcount = () => {
	pageData.waterfallItems.forEach((item, index) => {
		if (index === 0) {
			homepageopus({ masterId: pageData.masterId, pageNum: 1, pageSize: 10 }).then(res => {
				pageData.waterfallItems[index].query.data.totalCount = res.data.totalCount
			})
		} else if (index === 1) {
			homepagelike({ pageNum: 1, pageSize: 10 }).then(res => {
				pageData.waterfallItems[index].query.data.totalCount = res.data.totalCount
			})
		} else if (index === 2) {
			homepagecollection({ pageNum: 1, pageSize: 10 }).then(res => {
				pageData.waterfallItems[index].query.data.totalCount = res.data.totalCount
			})
		}
	})
}

function copy(value) {
	uni.setClipboardData({
		data: value, //要被复制的内容
		success: () => { //复制成功的回调函数
			uni.showToast({ //提示
				title: '复制成功'
			})
		}
	});
}
// 数据赋值
const showinfo = () => {
	iSinfo.value = !iSinfo.value
}
const skipPerson = () => {
	uni.navigateTo({
		url: '/pages/personCenter/personCenter'
	})
}
const fetchData = () => {
	changeWaterfall(0)
	userhomepage({
		masterId: pageData.masterId
	}).then(reslove => {
		pageInfo.mineMessage = reslove.data.userInfo
	}).catch((e) => {
		uni.redirectTo({
			url: '/pages/login/logout'
		})
	})
}
</script>

<style lang="scss" scoped>
.active {
	font-size: 34rpx;
	font-family: Source Han Sans SC;
	font-weight: bold;
	color: #272A29;
}

.inactive {
	font-size: 32rpx;
	font-family: Source Han Sans SC;
	font-weight: 400;
	color: #666666;
}

.iconShadow {
	box-shadow: 0rpx 1rpx 18rpx 0rpx rgba(0, 0, 0, 0.19);
}

.textStyle {
	font-family: Source Han Sans SC;
	font-weight: 300;
	color: #999999;
}

.Express {
	// line-height: 24rpx;
	font-weight: 300;
	color: #999999;
	display: flex;
	flex-direction: column;
	padding: 30upx 0 40upx;
	position: relative;

	.info {
		display: flex;
		flex-direction: column;

		view {
			text-align: justify;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			word-break: break-word; //换行模式
		}

		text {
			width: 70px;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #0078FF;
			position: absolute;
			bottom: 30upx;
			right: 30upx;
		}
	}

}

.hidebtn {
	display: flex;
	flex: 1;
	justify-content: flex-end;
	color: #0078FF;

}

.hide {
	word-break: break-word; //换行模式
	overflow: hidden;
	text-overflow: ellipsis; //修剪文字
	display: -webkit-box;
	-webkit-line-clamp: 2; //此处为上限行数
	-webkit-box-orient: vertical;
}

.line::after {
	position: absolute;
	left: 40%;
	bottom: 20%;
	z-index: 11;
	width: 100%;
	height: 100%;
	content: "";
	display: block;
	border-right: 1px solid gray;
	transform: scale(0.5);
	transform-origin: left bottom;
}
</style>