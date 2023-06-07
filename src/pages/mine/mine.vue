<template>
	<view>
		<view class="flex" @click="skipPerson">
			<view><u-avatar :src="pageData.mineMessage.icon" size="60"></u-avatar></view>
			<view class="flex flex-col  justify-center">
				<view class="p-2 ml-10">{{ pageData.mineMessage.nickname }}</view>
				<view class="p-2 ml-10">咕咕号:{{ pageData.mineMessage.guguId }}</view>
			</view>
		</view>
		<view class="flex">
			<view class="p-5 border-r-2 border-gray-500">128&nbsp;关注</view>
			<view class="p-5 border-r-2 border-gray-500">157&nbsp;关注</view>
			<view class="p-5 border-r-2 border-gray-500">128&nbsp;关注</view>
			<view class="p-5">128&nbsp;关注</view>
		</view>
		<view>
			<view class="Express">
				<view class="info">
					<view :class="{ hide: !iSinfo }">
						swipeAction的跟手联动是非常考验性能的。为了提高交互体验，本组件在 app 端 vue 页面、h5、微信小程序使用了wxs 技术，nvue 页面使用 bindingx
						技术，可以达到流畅的体验。在其他小程序平台由于底层不支持优化技术，只能使用使用普通 js ，此时性能一般。uni-swipe-action 和 uni-swipe-action-item
						需要同时使用uni-swipe-action 不能嵌套在 swiper
						中使用长列表不建议使用autoClose属性，会影响组件性能，造成卡顿，原因是打开之后要通知其他已经打开的组件关闭，会导致多个组件重新渲染
					</view>
					<text @tap="showinfo" v-if="!iSinfo">展开</text>
				</view>
				<text @tap="showinfo" v-if="iSinfo" class="hidebtn">收起</text>
			</view>
		</view>
		<view class="flex">
			<view class="p-5  bg-gray-500  ml-20">31岁</view>
			<view class="p-5  bg-gray-500  ml-20">重庆渝北</view>
		</view>
		<view class="">
			<template>
				<u-tabs :list="list1" @click="click"></u-tabs>
			</template>
		</view>
		<view class="flex collectView" v-if="cllectRadio == 2">
			<view class="p-5  ml-20" :class="lableCollect == 1 ? 'bg-gray-300' : 'bg-gray-200'">文章</view>
			<view class="p-5  ml-20" :class="lableCollect == 2 ? 'bg-gray-300' : 'bg-gray-200'">视频</view>
		</view>
		<waterFall></waterFall>
	</view>
</template>

<script setup>
import { getUserBase } from "@/api/mine/index.js"
import { reactive, ref } from 'vue'
import waterFall from "@/components/index/waterfall.vue"
import { onShow, onLoad } from "@dcloudio/uni-app"
import { needLogin } from "@/utils/utils"
onShow(() => {
  if (needLogin()) {
    getDataApi()
  }
	needLogin()
	getUserBase({}).then(res => {
	pageData.mineMessage=res.data || {}
})
})
const content = ref('在大多数场景下，并不需要设置 background-color 属性，因为uni-popup的主窗口默认是透明的，在向里面插入内容的时候 ，样式完全交由用户定制，如果设置了背景色 ，例如 uni-popup-dialog 中的圆角就很难去实现，不设置背景色，更适合用户去自由发挥。')
const src = 'https://cdn.uviewui.com/uview/album/1.jpg'
const TabCur2 = ref('')
const cllectRadio = ref(0)
const iSinfo = ref(false)
const lableCollect = ref(1)
const uReadMore = ref()
const list1 = reactive([{
	name: '作品(999)',
}, {
	name: '喜欢',
}, {
	name: '收藏'
}])
const click = (item) => {
	console.log('item', item);
	cllectRadio.value = item.index
}
const load = () => {
	uReadMore.value.uReadMore.init();
}
const showinfo = () => {
	iSinfo.value = !iSinfo.value
}
const skipPerson = () => {
	uni.navigateTo({
		url: '/pages/personCenter/personCenter'
	})
}
const pageData = reactive({
		//数据全部列表
		mineMessage: {}
	})
const paramsForm = reactive({
	id: '',
	state: 1,
})

const getDataApi = ()=>{
  getMineMessage({}).then(res => {
    pageData.mineMessage={...res.data}
  })
}
</script>

<style lang="scss" scoped>
.Express {
	display: flex;
	// width: 100%;
	flex-direction: column;
	background-color: #fff;
	padding: 30upx;
	position: relative;

	.info {
		display: flex;
		flex-direction: column;

		view {
			text-align: justify;
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(102, 102, 102, 1);
			word-break: break-word; //换行模式
			background-color: #fff;
		}

		text {
			width: 70px;
			font-size: 14px;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 50%);
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
	font-size: 14px;
}

.hide {
	word-break: break-word; //换行模式
	overflow: hidden;
	text-overflow: ellipsis; //修剪文字
	display: -webkit-box;
	-webkit-line-clamp: 2; //此处为上限行数
	-webkit-box-orient: vertical;
}

.collectView {
	view {
		border-radius: 20%;
	}
}
</style>
