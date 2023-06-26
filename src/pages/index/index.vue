<template>
  <view>
    <view class="fixed -top-5 z-50 bg-white w-full py-10 mb-14">
      <view class="bg-white w-full pt-7 pb-5 pl-14  pr-22 flex justify-between">
        <!-- 菜单 -->
        <view class="flex ">
          <view v-for="(waterItem, index) in pageData.waterfallItems" :key="index" class="mr-29"
            @click="changeWaterfall(index)">
            <view :class="pageData.currentIndex == index ? 'active' : 'inactive'">{{ waterItem.name }}</view>
            <view class=" h-4 relative -top-5 ">
              <image src="/static/mine/line.png" class="w-30 h-4 " v-show="pageData.currentIndex == index" />
            </view>
          </view>
        </view>
        <view class="flex items-center">
          <image src="/static/mine/search.png" class="w-17 h-17" @click="gohistory"></image>
        </view>
        <!-- 菜单 -->
      </view>
    </view>
    <view class="pt-60">
      <view>
        <view v-for="(waterItem, waterIndex) in pageData.waterfallItems" :key="waterIndex">
          <view v-show="waterIndex == pageData.currentIndex">
            <waterfall :isComplete="waterItem.isComplete" :itemType="waterItem.itemType" :itemKey="waterItem.itemKey"
              :value="waterItem.items" :waterIndex="waterIndex" :currentIndex="pageData.currentIndex">
            </waterfall>
          </view>
        </view>
      </view>
    </view>
    <safeguardconfirm></safeguardconfirm>
    <safeguard></safeguard>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import { opusList } from '@/api/opus/list'
import waterfall from '@/components/index/waterfall.vue'
import safeguardconfirm from '@/components/safeguard/safeguardconfirm.vue'
import safeguard from '@/components/safeguard/safeguard.vue'
import { onShow, onReachBottom, onPageScroll } from "@dcloudio/uni-app"
import useRouterStore from '@/store/modules/router'
import useLoginTokenStore from '@/store/modules/loginToken'
import _ from 'lodash'
const gohistory = () => {
  uni.navigateTo({
    url: '/pages/index/searchHistory'
  })
}
onMounted(() => {
  changeWaterfall(0)
})

const waterfallItems = [
  {
    scrollTop: -1, isComplete: false, isLoading: false, itemKey: 'testestse', itemType: 'title', name: '推荐', items: [], query: {
      path: { category: '1', pageNum: 1, getNum: 10 },
    }
  },
  {
    scrollTop: -1, isComplete: false, isLoading: false, itemType: 'title', name: '徒步', items: [], query: {
      path: { category: '2431436580328327949', pageNum: 1, getNum: 10 },
    }
  },
  {
    scrollTop: -1, isComplete: false, isLoading: false, name: '风景', items: [], query: {
      path: { category: '1622581366744965137', pageNum: 1, getNum: 10 },
    }
  },
  {
    scrollTop: -1, isComplete: false, isLoading: false, name: '骑行', items: [], query: {
      path: { category: '1622581366744965136', pageNum: 1, getNum: 10 },
    }
  },
]

const pageData = reactive({
  scrollTop: 0,
  currentIndex: 0,
  waterfallItems: _.cloneDeep(waterfallItems),
})
watch(() => useLoginTokenStore().get().accessToken, (newVal, oldVal) => {
  pageData.waterfallItems = _.cloneDeep(waterfallItems)
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
  opusList(query.path).then(res => {
    if (res.data.length<10) {
      pageData.waterfallItems[currentIndex].isComplete = true
    }
    pageData.waterfallItems[currentIndex].items = pageData.waterfallItems[currentIndex].items.concat(res.data)
    pageData.waterfallItems[currentIndex].isLoading = false
  }).catch(e => {
    pageData.waterfallItems[currentIndex].isLoading = false
  })
}

onReachBottom(() => {
  let currentIndex = pageData.currentIndex
  if (!pageData.waterfallItems[currentIndex].isComplete && !pageData.waterfallItems[currentIndex].isLoading) {
    // pageData.waterfallItems[currentIndex].query.path.pageNum++
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
</style>


