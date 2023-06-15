<template>
  <view :id="'waterDom_'+waterIndex" style="position: absolute;width:100%; visibility: hidden">
    <view v-for="(columnItem,columnIndex) in 1" :key="columnIndex">
      <view class="w-172" v-for="(item,index) in [pageData.currentItem]" :key="index">
        <waterfallItemTitle v-if="itemType == 'title'" :item="item" :isVirtualCal="true"></waterfallItemTitle>
        <waterfallItemImage v-else :item="item" :isVirtualCal="true"></waterfallItemImage>
      </view>
    </view>
  </view>
  <view class="flex justify-between">
    <view v-for="(columnItem,columnIndex) in 2" :key="columnIndex" :id="`waterfalls_flow_column_${waterIndex}_${columnIndex+1}`" :class="['flex-none',columnIndex == 0 ? 'ml-14' : 'mr-14']">
      <view class="w-172" v-for="(item,index) in pageData[`column_${columnIndex+1}_values`]" :key="index">
        <waterfallItemTitle v-if="itemType == 'title'" :item="item"></waterfallItemTitle>
        <waterfallItemImage v-else :item="item"></waterfallItemImage>
      </view>
    </view>
  </view>
  <view v-if="isComplete" class="text-center h-50 leading-50">
    已经到底了
  </view>
</template>
<script setup>
import { ref, reactive, watch, nextTick, computed, getCurrentInstance, onMounted } from 'vue'
import waterfallItemTitle from './waterfallItemTitle.vue'
import waterfallItemImage from './waterfallItemImage.vue'
const _this = getCurrentInstance();
const pageData = reactive({
  isLoading:false,
  list:[],
  currentItem:{},
  column_1_values:[],
  column_2_values:[],
  column_height_1:0,
  column_height_2:0,
});
const props = defineProps({
  value: Array,
  waterIndex: {
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
  }
});

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
  //获取当前dom高度
  nextTick(()=>{
    setTimeout(()=>{
      const query = uni.createSelectorQuery().in(_this);
      query.select(`#waterDom_${props.waterIndex}`).boundingClientRect(res => {
        if (res) {
          let column = 1
          if (pageData['column_height_2']>=pageData['column_height_1']) {
            pageData['column_height_1'] = pageData['column_height_1'] + res.height
            column = 1
          }
          else {
            pageData['column_height_2'] = pageData['column_height_2'] + res.height
            column = 2
          }
          pageData[`column_${column}_values`].push({ ...pageData.list[i], index: i });
        }
      }).exec(() => {
        init()
      });
    },10)

  })


  //const minHeightRes = await getMinColumnHeight();
  //pageData[`column_${minHeightRes.column}_values`].push({ ...pageData.list[i], index: i });
}

const init = ()=>{
  pageData.isLoading = true
  let isAddCount = pageData[`column_1_values`].length + pageData[`column_2_values`].length
  if (props.value.length == 0 && isAddCount > 0) {
    pageData[`column_1_values`] = []
    pageData[`column_2_values`] = []
    pageData.isLoading = false
  }
  else if (isAddCount <= props.value.length) {
    initValue(isAddCount)
    if (isAddCount == props.value.length) {
      pageData.isLoading = false
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
}, { immediate: true });
</script>
<style lang="scss" scoped>

</style>
