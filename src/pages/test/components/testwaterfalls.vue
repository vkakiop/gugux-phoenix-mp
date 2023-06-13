<template>
  <view :id="'waterDom_'+waterIndex" class="waterfalls-flow" style="position: absolute;width:100%; visibility: hidden">
    <view v-for="(item,index) in 1" :key="index" class="waterfalls-flow-column" :style="{'width':w,'margin-left':index==0?0:m,'float':'inherit'}">
      <view class="column-value" v-for="(item2,index2) in [data.currentItem]" :key="index2">
        <image :class="['img',{'img-error':!item2[data.imageKey]}]" :src="item2[data.imageKey]" mode="widthFix"></image>
        <view class="inner">
          <view class="title">{{item2.title}}</view>
          <view class="desc">{{item2.desc}}</view>
        </view>
      </view>
    </view>
  </view>
  <view class="waterfalls-flow">
    <view v-for="(item,index) in data.column" :key="index" class="waterfalls-flow-column" :id="`waterfalls_flow_column_${waterIndex}_${index+1}`" :style="{'width':w,'margin-left':index==0?0:m}">
      <view class="column-value" v-for="(item2,index2) in data[`column_${index+1}_values`]" :key="index2">
        <image :class="['img',{'img-error':!item2[data.imageKey]}]" :src="item2[data.imageKey]" mode="widthFix" @load="imgLoad(item2)" @error="imgError(item2)"></image>
        <view class="inner">
          <view class="title">{{item2.title}}</view>
          <view class="desc">{{item2.desc}}</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, reactive, watch, nextTick, computed, getCurrentInstance, onMounted } from 'vue';
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
});

const emit = defineEmits(['onReachBottom','initValue'])
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
  console.log('emit init value',i,data.list.length)
  emit('initValue',i)
  if (i >= data.list.length) return false;
  data.currentItem = data.list[i]
  console.log('currentItem',data.currentItem)
  //获取当前dom高度
  nextTick(()=>{
    setTimeout(()=>{
      const query = uni.createSelectorQuery().in(_this);
      query.select(`#waterDom_${props.waterIndex}`).boundingClientRect(res => {
        if (res) {
          console.log('height:',res.height)
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
          console.log('column',JSON.stringify(column))
          console.log('column_height_1',JSON.stringify(data.column_height_1))
          console.log('column_height_2',JSON.stringify(data.column_height_2))
        }
      }).exec(() => {
      });
    },1000)

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
defineExpose({initValueChange})

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
  const oldLength = oldValue ? oldValue.length : 0;
  data.list = newValue;
  //if (oldLength > 0) initValue(oldLength);
}, { immediate: true });
</script>
<style lang="scss" scoped>
.waterfalls-flow {
  &-column {
    float: left;
  }
}

.column-value {
  width: 100%;
  font-size: 0;

  .inner {
    font-size: 30rpx;
  }

  .img {
    width: 100%;

    &-error {
      background: #f2f2f2 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAiAQMAAAAatXkPAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAAIZJREFUCNdlzjEKwkAUBNAfEGyCuYBkLyLuxRYW2SKlV1JSeA2tUiZg4YrLjv9PGsHqNTPMSAQuyAJgRDHSyvBPwtZoSJXakeJI9iuRLGDygdl6V0yKDtyMAeMPZySj8yfD+UapvRPj2JOwkyAooSV5IwdDjPdCPspe8LyTl9IKJvDETKKRv6vnlUasgg0fAAAAAElFTkSuQmCC) no-repeat center center;
    }
  }
}
</style>
