<template>
  <canvas :canvas-id="`canvas_${waterIndex}`" class="hidden"></canvas>
  <!--view :id="'waterDom_'+waterIndex" style="position: absolute;width:100%; visibility: hidden">
    <view v-for="(columnItem,columnIndex) in 1" :key="columnIndex">
      <view class="w-172" v-for="(item,index) in [pageData.currentItem]" :key="index">
        <waterfallItemTitle v-if="itemType == 'title'" :item="item" :itemKey="itemKey" :isVirtualCal="true"></waterfallItemTitle>
        <waterfallItemImage v-else :item="item" :itemKey="itemKey" :isVirtualCal="true"></waterfallItemImage>
      </view>
    </view>
  </view-->
  <!--u-list @scrolltolower="scrolltolower" lowerThreshold="200"-->
      <view class="flex justify-between">
        <view v-for="(columnItem,columnIndex) in 2" :key="columnIndex" :id="`waterfalls_flow_column_${waterIndex}_${columnIndex+1}`" :class="['flex-none',columnIndex == 0 ? 'ml-14' : 'mr-14']">
          <view :id="`waterDom_${item.index}`" class="w-172" v-for="(item,index) in pageData[`column_values_${columnIndex}`]" :key="index">
            <waterfallItemTitle v-if="itemType == 'title'" :item="item" :itemKey="itemKey" :traceInfo="traceInfo"  :categoryId="categoryId" @popLoginShow="pageData.isShowLoginPop = true"></waterfallItemTitle>
            <waterfallItemImage v-else :item="item" :itemKey="itemKey" :traceInfo="traceInfo"  :categoryId="categoryId" @popLoginShow="pageData.isShowLoginPop = true"></waterfallItemImage>
          </view>
            <!--waterfallGroup v-for="(items,groupIndex) in pageData[`column_values_group_${columnIndex}`]" :waterIndex="waterIndex" :groupIndex="groupIndex" :currentIndex="currentIndex" :itemType="itemType" :itemKey="itemKey"  :traceInfo="traceInfo"  :categoryId="categoryId" :items="items" :height="pageData[`column_height_group_${columnIndex}`][groupIndex]" :key="groupIndex"></waterfallGroup-->
        </view>
      </view>
      <view v-if="pageData.isComplete && value.length" class="text-center h-50 leading-50 text-12 text-[#666666]">
        暂无更多
      </view>
  <!--/u-list-->
  <loginPop :isShow="pageData.isShowLoginPop" @close="pageData.isShowLoginPop = false"></loginPop>
</template>
<script setup>
import { ref, reactive, onMounted, watch, nextTick, computed, getCurrentInstance } from 'vue'
import _ from 'lodash'
//import waterfallGroup from './waterfallGroup.vue'
import waterfallItemTitle from './waterfallItemTitle.vue'
import waterfallItemImage from './waterfallItemImage.vue'
import {rpxTopx,pxTorpx} from '@/utils/utils'
import useOpusStore from '@/store/modules/opus'

const _this = getCurrentInstance()
const pageData = reactive({
  isLoading:false,
  isComplete:false,
  timer:null,
  list:[],
  currentItem:{},
  column_values_0:[],
  column_values_1:[],
  // column_values_group_0:[],
  // column_values_group_1:[],
  column_height_0:0,
  column_height_1:0,
  // column_height_group_0:[],
  // column_height_group_1:[],
  isShowLoginPop: false,
})

const props = defineProps({
  value: Array,
  waterIndex: {
    type: Number,
    default: 0
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  itemType: {
    type: String,
    default: 'title'
  },
  itemKey: {
    type: String,
    default: ''
  },
  traceInfo: {
    type: String,
    default: ''
  },
  categoryId: {
    type: String,
    default: ''
  },
})

//const emit = defineEmits(['scrolltolower'])


let canvasctx = null
onMounted(()=>{
  canvasctx = uni.createCanvasContext('canvas_'+props.waterIndex,_this)

  //watch immediate
  pageData.list = props.value;
  if (!pageData.isLoading) {
    init()
  }
})

const calcHeight = ((w,h)=>{
  return w <= 0 ? 344 : h * (344 / w)
})

// 数据赋值
//pageData.list = props.value ? props.value : [];

/*
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
    for (let i = 1; i <= pageData.column; i++) {
      const query = uni.createSelectorQuery().in(_this);
      query.select(`#waterfalls_flow_column_${props.waterIndex}_${i}`).boundingClientRect(pageData => {
        console.log('高度'+`${props.waterIndex}_${i}`,pageData.height)
        heightArr.push({ column: i, height: pageData.height });
      }).exec(() => {
        if (pageData.column <= heightArr.length) {
          resolve(getMin(heightArr, 'height'));
        }
      });
    }
  })
};
 */

async function initValue(i) {
  if (i >= pageData.list.length) return false;
  pageData.currentItem = pageData.list[i]

  let measureTextWidth = 0
  if (props.itemType == 'title') {
    if (canvasctx == null) {
      canvasctx = uni.createCanvasContext('canvas_'+props.waterIndex,_this)
    }
    measureTextWidth = canvasctx.measureText(pageData.currentItem.title).width
  }

  let column = 0
  if (pageData.column_height_1>=pageData.column_height_0) {
    column = 0
  }
  else {
    column = 1
  }
  let imageHeightRpx = calcHeight(pageData.list[i].cover.width, pageData.list[i].cover.height)
  let textHeightRpx = 20
  if (pxTorpx(measureTextWidth) > 164*2){
    textHeightRpx = 40
  }
  let heightRpx = imageHeightRpx + 60 //30*2
  if (props.itemType == 'title') {
    heightRpx = imageHeightRpx + textHeightRpx + 108 //30*2 + 28 *2
  }
  pageData[`column_values_${column}`].push({ ...pageData.list[i], index: i,imageHeightRpx,textHeightRpx,heightRpx });
  let startTime = new Date().getTime()

  //获取当前dom高度
  let height = rpxTopx(heightRpx)
  if (pageData.column_height_1>=pageData.column_height_0) {
    pageData.column_height_0 = pageData.column_height_0 + height
  }
  else {
    pageData.column_height_1 = pageData.column_height_1 + height
  }

  //添加到分组中
  // let groupItems = []
  // if (pageData[`column_values_group_${column}`].length > 0) {
  //   groupItems = pageData[`column_values_group_${column}`][pageData[`column_values_group_${column}`].length - 1]
  // }
  // if (groupItems.length >= 10) {
  //   groupItems = []
  // }
  // groupItems.push({ ...pageData.list[i], index: i, height:height})
  // if (groupItems.length == 1) {
  //   pageData[`column_values_group_${column}`].push(groupItems)
  // }
  // else {
  //   pageData[`column_values_group_${column}`][pageData[`column_values_group_${column}`].length - 1] = groupItems
  // }
  // //计算最后一列的高度
  // let lastIndex = pageData[`column_values_group_${column}`].length - 1
  // let lastHeight = pageData[`column_values_group_${column}`][lastIndex].map(item=>{
  //   return item.height
  // }).reduce((a,b)=>{return a+b})
  // pageData[`column_height_group_${column}`][lastIndex] = lastHeight
  //

  if (props.currentIndex == props.waterIndex) {
    init()
  }
  else {
    pageData.isLoading = false
  }
  //获取当前dom结束

  //const minHeightRes = await getMinColumnHeight();
  //pageData[`column_${minHeightRes.column}_values`].push({ ...pageData.list[i], index: i });
}

const init = ()=>{
  pageData.isLoading = true
  let isAddCount = pageData.column_values_0.length + pageData.column_values_1.length
  if (props.value.length == 0 && isAddCount > 0) {
    pageData.column_values_0 = []
    pageData.column_values_1 = []
    pageData.column_values_group_0 = []
    pageData.column_values_group_1 = []
    pageData.column_height_0 = 0
    pageData.column_height_1 = 0
    pageData.isLoading = false
  }
  else if (isAddCount <= props.value.length) {
    initValue(isAddCount)
    if (isAddCount == props.value.length) {
      pageData.isLoading = false
      if (props.isComplete) {
        pageData.isComplete = true
      }
      //console.log('已加载完成：',isAddCount)
    }
  }
}
defineExpose({init})

// // 图片加载完成
// function imgLoad(item) {
//   const i = item.index;
//   initValue(i + 1);
// }
// // 图片加载失败
// function imgError(item) {
//   const i = item.index;
//   initValue(i + 1);
//   item[pageData.imageKey] = null;
// }

// 监听数据的变化
watch(() => props.value, (newValue, oldValue) => {
  const oldLength = oldValue ? oldValue.length : 0;
  pageData.list = newValue;
  //if (oldLength > 0) initValue(oldLength);
  if (!pageData.isLoading) {
    init()
  }
}, { immediate: false })

watch (() => props.currentIndex == props.waterIndex,(newVal,oldValue)=>{
  if (!pageData.isLoading && newVal) {
    init()
  }
  if (!newVal) {
    clearTimeout(pageData.timer)
    pageData.timer = null
    pageData.isLoading = false
  }
})

watch(()=>useOpusStore().getLike(),(newValue,oldValue)=>{
  if (newValue.id) {
    //查找总数据
    let index = pageData.list.findIndex(item=>{return item.id == newValue.id})
    if (index != -1) {
      pageData.list[index].isLike = newValue.isLike
      pageData.list[index].likeNum = newValue.likeNum
    }

    //第一列数据
    index = pageData.column_values_0.findIndex(item=>{return item.id == newValue.id})
    if (index != -1) {
      pageData.column_values_0[index].isLike = newValue.isLike
      pageData.column_values_0[index].likeNum = newValue.likeNum
    }

    //第二列数据
    index = pageData.column_values_1.findIndex(item=>{return item.id == newValue.id})
    if (index != -1) {
      pageData.column_values_1[index].isLike = newValue.isLike
      pageData.column_values_1[index].likeNum = newValue.likeNum
    }

    // //查找group 0 数据
    // pageData.column_values_group_0.forEach((gitem,gindex)=>{
    //   index = gitem.findIndex(item=>{return item.id == newValue.id})
    //   if (index != -1) {
    //     pageData.column_values_group_0[gindex][index].isLike = newValue.isLike
    //     pageData.column_values_group_0[gindex][index].likeNum = newValue.likeNum
    //   }
    // })
    //
    //
    // //查找group 1 数据
    // pageData.column_values_group_1.forEach((gitem,gindex)=>{
    //   index = gitem.findIndex(item=>{return item.id == newValue.id})
    //   if (index != -1) {
    //     pageData.column_values_group_1[gindex][index].isLike = newValue.isLike
    //     pageData.column_values_group_1[gindex][index].likeNum = newValue.likeNum
    //   }
    // })
  }
})

// const scrolltolower = ()=>{
//   emit('scrolltolower',props.waterIndex)
// }
</script>
<style lang="scss" scoped>

</style>
