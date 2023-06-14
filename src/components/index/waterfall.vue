<template>
  <view :id="'waterDom_'+waterIndex" style="position: absolute;width:100%; visibility: hidden">
    <view v-for="(columnItem,columnIndex) in 1" :key="columnIndex">
      <view class="w-172" v-for="(item,index) in [data.currentItem]" :key="index">
        <waterfallItemTitle :item="item"></waterfallItemTitle>
      </view>
    </view>
  </view>
  <view class="flex justify-between">
    <view v-for="(columnItem,columnIndex) in data.column" :key="columnIndex" :id="`waterfalls_flow_column_${waterIndex}_${columnIndex+1}`" :class="['flex-none',columnIndex == 0 ? 'ml-14' : 'mr-14']">
      <view class="w-172" v-for="(item,index) in data[`column_${columnIndex+1}_values`]" :key="index">
        <waterfallItemTitle :item="item"></waterfallItemTitle>
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
const _this = getCurrentInstance();
const data = reactive({});
const props = defineProps({
  value: Array,
  column: { // 列的数量
    type: [String, Number],
    default: 2
  },
  columnSpace: { // 列之间的间距 百分比
    type: [String, Number],
    default: 2
  },
  imageKey: { // 图片key
    type: [String],
    default: 'image'
  },
  seat: { // 文本的位置，1图片之上 2图片之下
    type: [String, Number],
    default: 2
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  waterIndex: {
    type: Number,
    default: 0
  },
  isComplete: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([])
// 数据赋值
data.list = props.value ? props.value : [];
data.column = props.column < 2 ? 2 : props.column;
data.columnSpace = props.columnSpace <= 5 ? props.columnSpace : 5;
data.imageKey = props.imageKey;
data.seat = props.seat;
data.isFirstLoad = true;
data.currentItem = {}
data.column_1_values = []
data.column_2_values = []
data.column_height_1 = 0
data.column_height_2 = 0
// 计算列宽
const w = computed(()=>{
  const column_rate = `${100 / data.column - (+data.columnSpace)}%`;
  return column_rate;
})
// 计算margin
const m = computed(()=>{
  const column_margin = `${(100-(100 / data.column - (+data.columnSpace)).toFixed(5)*data.column)/(data.column-1)}%`;
  return column_margin;
})
// 每列的数据初始化
for (let i = 1; i <= data.column; i++) {
  data[`column_${i}_values`] = [];
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
      query.select(`#waterfalls_flow_column_${props.waterIndex}_${i}`).boundingClientRect(data => {
        console.log('高度'+`${props.waterIndex}_${i}`,data.height)
        heightArr.push({ column: i, height: data.height });
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
  data.currentItem = data.list[i]
  //获取当前dom高度
  nextTick(()=>{
    setTimeout(()=>{
      const query = uni.createSelectorQuery().in(_this);
      query.select(`#waterDom_${props.waterIndex}`).boundingClientRect(res => {
        if (res) {
          let column = 1
          if (data['column_height_2']>=data['column_height_1']) {
            data['column_height_1'] = data['column_height_1'] + res.height
            column = 1
          }
          else {
            data['column_height_2'] = data['column_height_2'] + res.height
            column = 2
          }
          data[`column_${column}_values`].push({ ...data.list[i], index: i });
        }
      }).exec(() => {
        init()
      });
    },10)

  })


  //const minHeightRes = await getMinColumnHeight();
  //data[`column_${minHeightRes.column}_values`].push({ ...data.list[i], index: i });
}



onMounted(() => {
  //initValue(0);
})
const initValueChange = (index)=>{
  initValue(index)
}

const init = ()=>{
  let isAddCount = data[`column_1_values`].length + data[`column_2_values`].length
  if (isAddCount <= props.value.length) {
    initValue(isAddCount)
  }
  else if (props.value.length == 0 && isAddCount > 0) {
    data[`column_1_values`] = []
    data[`column_2_values`] = []
  }
}
defineExpose({initValueChange,init})

// 图片加载完成
function imgLoad(item) {
  const i = item.index;
  initValue(i + 1);
}
// 图片加载失败
function imgError(item) {
  const i = item.index;
  initValue(i + 1);
  item[data.imageKey] = null;
}
// 监听数据的变化
watch(() => props.value, (newValue, oldValue) => {
  console.log('watch')
  const oldLength = oldValue ? oldValue.length : 0;
  data.list = newValue;
  //if (oldLength > 0) initValue(oldLength);
  init()
}, { immediate: true });
</script>
<style lang="scss" scoped>

</style>
