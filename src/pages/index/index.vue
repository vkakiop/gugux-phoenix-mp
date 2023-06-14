<template>
  <view class="bg-gray-100">
    <view class="relative p-10  mb-10 ">
      <icon type="search" size="26" class="absolute right-0" @click="skipHistory" />
    </view>
    <view>
      <view class="uni-common-mt">
        <view style="flex:2">
          <u-tabs :list="computedMenuItems" lineWidth="40" lineColor="#f56c6c" :activeStyle="{
            color: '#303133',
            fontWeight: 'bold',
            transform: 'scale(1.05)'
          }" :inactiveStyle="{
  color: '#606266',
  transform: 'scale(1)'
}" itemStyle="padding-left: 15rpx; padding-right: 15rpx; height: 66rpx;" @click="(item)=>changeWaterfall(item.index)">
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
    <view>
    <view>
      <view v-for="(waterItem,waterIndex) in pageData.waterfallItems">
        <view v-show="waterIndex == pageData.currentIndex">
          <waterfall :isComplete="waterItem.isComplete" :value="waterItem.items" :column="2" :columnSpace="1" :seat="2" :waterIndex="waterIndex" :currentIndex="pageData.currentIndex">
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
import { ref, onMounted, reactive,watch,computed,getCurrentInstance } from 'vue'
import { opusList } from '@/api/opus/list'
import waterfall from '@/components/index/waterfall.vue'
import { onShow,onReachBottom,onPageScroll } from "@dcloudio/uni-app"
const isShow = ref(true)
const internalInstance = getCurrentInstance()
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
	const paramsForm = reactive({
		"keyword": "",
		"pageNum": 1,
		"pageSize": 10,
		"searchTime": "",
		"type": 0
	})
		const waterlist = ref([])
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


onMounted(()=>{
  changeWaterfall(0)
})

const pageData = reactive({
  scrollTop:0,
  currentIndex:0,
  waterfallItems : [
    {scrollTop:0,isComplete:false,name:'推荐',items:[],query:{
        path:{category:'0',pageNum:1,pageSize:10},
        data:{passTime:''}
      }
    },
    {scrollTop:0,isComplete:false,name:'徒步',items:[],query:{
        path:{category:'2431436580328327949',pageNum:1,pageSize:10},
        data:{passTime:''}
      }
    },
    {scrollTop:0,isComplete:false,name:'风景',items:[],query:{
        path:{category:'1622581366744965137',pageNum:1,pageSize:10},
        data:{passTime:''}
      }
    },
    {scrollTop:0,isComplete:false,name:'骑行',items:[],query:{
        path:{category:'1622581366744965136',pageNum:1,pageSize:10},
        data:{passTime:''}
      }
    },
  ],
})

const computedMenuItems = computed(()=>{
  return pageData.waterfallItems.map(item=>{return {name:item.name}})
})

const changeWaterfall = (waterIndex)=>{
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
    uni.pageScrollTo({
      scrollTop: pageData.waterfallItems[waterIndex].scrollTop,
      duration: 300
    });
  }
}

const getData = () => {
  let query = pageData.waterfallItems[pageData.currentIndex].query
  opusList(query.path,query.data).then(res => {
    if (res.data.page == res.data.totalPage) {
      pageData.waterfallItems[pageData.currentIndex].isComplete = true
    }
    pageData.waterfallItems[pageData.currentIndex].items = pageData.waterfallItems[pageData.currentIndex].items.concat(res.data.list)
  })
}

onReachBottom(() => {
  if (!pageData.waterfallItems[pageData.currentIndex].isComplete) {
    pageData.waterfallItems[pageData.currentIndex].query.path.pageNum ++
    getData()
  }
})

onPageScroll((res)=>{
  pageData.scrollTop = res.scrollTop
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
</style>


