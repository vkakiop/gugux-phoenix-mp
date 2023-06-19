<template>
  <view class="bg-gray-100">
    <view class="fixed -top-5 z-50 bg-white w-full py-10 mb-14" >
      <view class="py-15">
        <view class="flex items-center ml-14  bg-[#fff] ml-10 h-39 w-302 rounded-40 border-1 border-[#E3E3E3] text-14" @click="gohistory">
          <icon type="search" size="11" class="mx-10" />
          <input class="bg-[#fff]"  placeholder="搜索" type="text"  disabled/>
        </view>
      </view>
	  <view class="bg-white w-full pt-7 pb-5 ml-14 flex">
	   <!-- 菜单 -->
	   	<view v-for="(waterItem, index) in pageData.waterfallItems" :key="index"  class="mr-28 " @click="changeWaterfall(index)">
	   		<view :class="pageData.currentIndex == index?'active':'inactive'">{{waterItem.name}}</view>
	   		<view class=" h-4 relative -top-5 ">
	   			<image src="/static/mine/line.png" class="w-30 h-4 " v-show="pageData.currentIndex == index" />
	   		</view>
	   	</view>
	   <!-- 菜单 -->
	  </view>
    </view>

    <view class="pt-140 bg-gray-100">
      <view>
        <view v-for="(waterItem, waterIndex) in pageData.waterfallItems" :key="waterIndex">
          <view v-show="waterIndex == pageData.currentIndex">
            <waterfall :isComplete="waterItem.isComplete" :itemType="waterItem.itemType" :itemKey="waterItem.itemKey" :value="waterItem.items"
              :waterIndex="waterIndex" :currentIndex="pageData.currentIndex">
            </waterfall>
          </view>
        </view>
      </view>
    </view>
    <u-modal :show="show" @confirm="confirmShow" @cancel="closeShow" title="紧急通知" confirmColor="#D9001B"
      cancelColor="#0000FF" showCancelButton ref="uModal" confirmText="去导航" cancelText="查看详情">
      <view class="slot-content">
        <rich-text :nodes="content"></rich-text>
      </view>
    </u-modal>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive, watch, computed, getCurrentInstance } from 'vue'
import { opusList } from '@/api/opus/list'
import waterfall from '@/components/index/waterfall.vue'
import { onShow, onReachBottom, onPageScroll } from "@dcloudio/uni-app"
import useLoginTokenStore from '@/store/modules/loginToken'
const loginTokenStore = useLoginTokenStore()
const internalInstance = getCurrentInstance()
const waterlist = ref([])
const show = ref(false);
const content = ref('');
content.value = '您的好友等第十三月(1511837394)在重庆市四川商会触发了紧急通知，请点击电话联系或导航前往。'
const confirmShow = () => {
  show.value = false;
  console.log('去导航');
  // uni.navigateTo({ url: '/pages/emergencycontact/index?id=' + encodeURIComponent(13333333333) })
  uni.navigateTo({ url: '/pages/safeguard/gonavigation?id=' + encodeURIComponent('1601683533353328702') })
}
const closeShow = () => {
  show.value = false;
  console.log('查看详情');
  uni.navigateTo({ url: '/pages/safeguard/safeguarddetail?id=' + encodeURIComponent(123) })
}

const gohistory = () => {
  uni.navigateTo({
    url: '/pages/index/searchHistory'
  })
}

onMounted(() => {
  changeWaterfall(0)
})

const pageData = reactive({
  scrollTop: 0,
  currentIndex: 0,
  waterfallItems: [
    {
     scrollTop: -1, isComplete: false, isLoading: false, itemKey:'testestse', itemType: 'title', name: '推荐', items: [], query: {
        path: { category: '0', pageNum: 1, pageSize: 10 },
        data: { passTime: '' }
      }
    },
    {
      scrollTop: -1, isComplete: false, isLoading: false, itemType: 'image', name: '徒步', items: [], query: {
        path: { category: '2431436580328327949', pageNum: 1, pageSize: 10 },
        data: { passTime: '' }
      }
    },
    {
      scrollTop: -1, isComplete: false, isLoading: false, name: '风景', items: [], query: {
        path: { category: '1622581366744965137', pageNum: 1, pageSize: 10 },
        data: { passTime: '' }
      }
    },
    {
      scrollTop: -1, isComplete: false, isLoading: false, name: '骑行', items: [], query: {
        path: { category: '1622581366744965136', pageNum: 1, pageSize: 10 },
        data: { passTime: '' }
      }
    },
  ],
})
watch(()=>loginTokenStore.get().accessToken,(newVal,oldVal)=>{
  pageData.waterfallItems=[
    {
     scrollTop: -1, isComplete: false, isLoading: false, itemKey:'testestse', itemType: 'title', name: '推荐', items: [], query: {
        path: { category: '0', pageNum: 1, pageSize: 10 },
        data: { passTime: '' }
      }
    },
    {
      scrollTop: -1, isComplete: false, isLoading: false, itemType: 'title', name: '徒步', items: [], query: {
        path: { category: '2431436580328327949', pageNum: 1, pageSize: 10 },
        data: { passTime: '' }
      }
    },
    {
      scrollTop: -1, isComplete: false, isLoading: false, name: '风景', items: [], query: {
        path: { category: '1622581366744965137', pageNum: 1, pageSize: 10 },
        data: { passTime: '' }
      }
    },
    {
      scrollTop: -1, isComplete: false, isLoading: false, name: '骑行', items: [], query: {
        path: { category: '1622581366744965136', pageNum: 1, pageSize: 10 },
        data: { passTime: '' }
      }
    },
  ]
    changeWaterfall(0)
})
const computedMenuItems = computed(() => {
  return pageData.waterfallItems.map(item => { return { name: item.name } })
})

const changeWaterfall = (waterIndex) => {
  if (pageData.currentIndex != waterIndex) {
    //读取滚动条高度
    pageData.waterfallItems[pageData.currentIndex].scrollTop = pageData.scrollTop
  }
  pageData.currentIndex = waterIndex
  if (pageData.waterfallItems[waterIndex].items.length == 0) {
    getData()
  }
  else {
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
  opusList(query.path, query.data).then(res => {
	  console.log('opusList',res.data);
    if (res.data.page == res.data.totalPage) {
      pageData.waterfallItems[currentIndex].isComplete = true
    }
    pageData.waterfallItems[currentIndex].items = pageData.waterfallItems[currentIndex].items.concat(res.data.list)
    pageData.waterfallItems[currentIndex].isLoading = false
  }).catch(e => {
    pageData.waterfallItems[currentIndex].isLoading = false
  })
}

onReachBottom(() => {
  let currentIndex = pageData.currentIndex
  if (!pageData.waterfallItems[currentIndex].isComplete && !pageData.waterfallItems[currentIndex].isLoading) {
    pageData.waterfallItems[currentIndex].query.path.pageNum++
    getData()
  }
})

onPageScroll((res) => {
  pageData.scrollTop = res.scrollTop
})
</script>

<style lang="scss" scoped>
	.active {
		font-size: 16px;
		font-family: Source Han Sans SC;
		font-weight: bold;
		color: #272A29;
	}

	.inactive {
		font-size: 15px;
		font-family: Source Han Sans SC;
		font-weight: 400;
		color: #999999;
	}


.uni-common-mt {
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
</style>


