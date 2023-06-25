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
    <u-modal :show="show"
      :showConfirmButton="false" ref="uModal" >
      <view class="slot-content">
        <view class="title"><text class="alarm-red">{{ alarmData.data.name}}</text>发出了<text class="alarm-red">紧急求助！</text>
        这是{{ alarmData.data.name}}的位置，请前往救助！
        </view>
        <view class="map">
          <view class="page-section page-section-gap" style="width: 100%; background: #ddd; height: 300rpx;">
            <map style="width: 100%; height: 300rpx;" :latitude="alarmData.data.latitude" :longitude="alarmData.data.longitude" :markers="alarmData.data.covers">
            </map>
          </view>
          <view class="map-name">
            <image  src="/static/img/user.png"  mode="widthFix"/>
             {{ alarmData.data.address }}
          </view>
        </view>
        <view class="foot-btn">
          <view class="btn btn1" @click="closeShow">查看详情</view>
          <view class="btn btn2" @click="confirmShow">去导航</view>
        </view>
      </view>
    </u-modal>
    <!-- <u-modal :show="show" @confirm="confirmShow" @cancel="closeShow" confirmColor="#D9001B"
      cancelColor="#0000FF" showCancelButton ref="uModal" confirmText="去导航" cancelText="查看详情">
      <view class="slot-content">
        <view>{{ content }}</view>
      </view>
    </u-modal> -->
  </view>
</template>

<script setup>
import { ref, onMounted, reactive, watch, computed, getCurrentInstance } from 'vue'
import { opusList } from '@/api/opus/list'
import waterfall from '@/components/index/waterfall.vue'
import { onShow, onReachBottom, onPageScroll } from "@dcloudio/uni-app"
import useRouterStore from '@/store/modules/router'
import useLoginTokenStore from '@/store/modules/loginToken'
import _ from 'lodash'
const show = ref(false);
const alarmData = reactive({
  data:{
    id: '1',
    name: '张三',
    phone: '13333333333',
    address: '重庆市四川商会重庆市四川商会商会',
    latitude: 39.909,
    longitude: 116.39742,
    covers: [{
      latitude: 39.909,
      longitude: 116.39742,
      // iconPath: '../../../static/location.png'
    }]
  }
})
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
.slot-content{
  width: 100%;
  .title{
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 32rpx;
    .alarm-red{
      font-size: 38rpx;
      color: #EC5938;
    }
  }
  .map{
    margin: 20rpx 0;
    .map-name{
      background: #F5F5F5;
      opacity: 0.95;
      border-radius: 0rpx 0rpx 10rpx 10rpx;
      font-size: 28rpx;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #272A29;
      padding:10rpx;
      display: flex;
      align-items: center;
      image{
        width: 30rpx;
        margin-right: 10rpx;
      }
    }
  }
  .foot-btn{
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 20rpx;
    .btn{
      width: 256rpx;
      height: 85rpx;
      line-height: 85rpx;
      border-radius: 43rpx;
      text-align: center;
    }
    .btn1{
      background: #F4F5F6;
      color: #666666;
      
    }
    .btn2{
      background: #FACC0A;
      color: #272A29;
    }
  }
}
</style>


