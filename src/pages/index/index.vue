<template>
  <view>
    <view class="fixed -top-5 z-50 bg-white w-full py-10 mb-14">
      <view class="bg-[#fff] w-full pt-7 pb-10 pl-14  pr-22 flex justify-between">
        <!-- 菜单 -->
        <scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" scroll-left="60">
          <view class="flex text-center ">
            <view v-for="(waterItem, index) in pageData.waterfallItems" :key="index" class="mr-20"
              @click="changeWaterfall(index)">
              <view :class="pageData.currentIndex == index ? 'active' : 'inactive'">{{ waterItem.name }}</view>
              <view class="">
                <image src="/static/mine/line.png" class="w-30 h-4 " v-show="pageData.currentIndex == index" />
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="flex items-center  relative -top-11 bg-[#fff] ">
          <image src="/static/mine/search.png" class="w-17 h-17" @click="gohistory"></image>
        </view>
        <!-- 菜单 -->
      </view>
    </view>
    <view class="pt-60">
      <view>
        <view v-for="(waterItem, waterIndex) in pageData.waterfallItems" :key="waterIndex">
          <view v-if="waterIndex == pageData.currentIndex">
            <waterfall :isComplete="waterItem.isComplete" :itemType="waterItem.itemType" itemKey="index"
              :value="waterItem.items" :waterIndex="waterIndex" :currentIndex="pageData.currentIndex"
              :categoryId="waterItem.query.path.categoryId + ''" @scrolltolower="scrolltolower">
            </waterfall>
          </view>
        </view>
      </view>
    </view>
    <safe-guard-confirm></safe-guard-confirm>
    <safe-guard></safe-guard>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive, watch, nextTick } from 'vue'
import { opusList } from '@/api/opus/list'
import waterfall from '@/components/index/waterfall.vue'
// import safeguardconfirm from '@/components/safeguard/safeguardconfirm.vue'
// import safeguard from '@/components/safeguard/safeguard.vue'
import { onShow } from "@dcloudio/uni-app"
import useRouterStore from '@/store/modules/router'
import useLoginTokenStore from '@/store/modules/loginToken'
import { frontpage } from "@/api/index/index";
import _ from 'lodash'
const gohistory = () => {
  uni.navigateTo({
    url: '/pages/index/searchHistory'
  })
}
//导航栏滚动条
const scrollX = ref(0)
const scroll = (e) => {
  scrollX.value = e.detail.scrollTop
}
const waterfallItems = []
const pageData = reactive({
  scrollTop: 0,
  currentIndex: 0,
  waterfallItems: [],
})
frontpage({}).then(res => {
  const opusCategoryVOS = res.data.opusCategoryVOS
  opusCategoryVOS.forEach((item, index) => {
    let obj = {
      scrollTop: -1, isComplete: false, isLoading: false, itemType: 'title', name: '', items: [], query: {
        path: { categoryId: '', pageNum: 1, getNum: 20 }
      }
    }
    obj.name = item.name
    obj.query.path.categoryId = item.id
    waterfallItems.push(obj)
  })
  pageData.waterfallItems = _.cloneDeep(waterfallItems)
  nextTick(() => { changeWaterfall(0) })
})
onShow(() => {
  useRouterStore().setRouter('/pages/mine/mine', false)

})
watch(() => useLoginTokenStore().get().accessToken, (newVal, oldVal) => {
  pageData.waterfallItems = _.cloneDeep(waterfallItems)
  changeWaterfall(pageData.currentIndex)
})


const changeWaterfall = (waterIndex) => {
  // if (pageData.currentIndex != waterIndex) {
  //   //读取滚动条高度
  //   pageData.waterfallItems[pageData.currentIndex].scrollTop = pageData.scrollTop
  // }
  pageData.currentIndex = waterIndex
  if (pageData.waterfallItems[waterIndex].items.length == 0) {
    getData()
  }
  // else {
  //   //写入滚动条高度
  //   if (pageData.waterfallItems[waterIndex].scrollTop != -1) {
  //     uni.pageScrollTo({
  //       scrollTop: pageData.waterfallItems[waterIndex].scrollTop,
  //       duration: 300
  //     });
  //   }
  // }
}

const getData = () => {
  let currentIndex = pageData.currentIndex
  pageData.waterfallItems[currentIndex].isLoading = true
  let query = pageData.waterfallItems[currentIndex].query
  opusList(query.path).then(res => {
    if (res.data.length < 10) {
      pageData.waterfallItems[currentIndex].isComplete = true
    }
    pageData.waterfallItems[currentIndex].items = pageData.waterfallItems[currentIndex].items.concat(res.data)
    pageData.waterfallItems[currentIndex].isLoading = false
  }).catch(e => {
    pageData.waterfallItems[currentIndex].isLoading = false
  })
}

// onReachBottom(() => {
//   let currentIndex = pageData.currentIndex
//   if (!pageData.waterfallItems[currentIndex].isComplete && !pageData.waterfallItems[currentIndex].isLoading) {
//     // pageData.waterfallItems[currentIndex].query.path.pageNum++
//     getData()
//   }
// })

// onPageScroll((res) => {
//   pageData.scrollTop = res.scrollTop
// })

const scrolltolower = (waterIndex) => {
  let currentIndex = pageData.currentIndex
  if (!pageData.waterfallItems[currentIndex].isComplete && !pageData.waterfallItems[currentIndex].isLoading) {
    // pageData.waterfallItems[currentIndex].query.path.pageNum++
    getData()
  }
}
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



.scroll-view_H {
  white-space: nowrap;
  width: 90%;
}
</style>


