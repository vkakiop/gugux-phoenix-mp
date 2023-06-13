<template>
  <!-- #ifdef VUE3 -->
  <view id="page" styl="min-height:101vh">
    <view class="flex fixed z-[200]">
      <view class="mr-10" v-for="(waterItem,waterIndex) in pageData.waterfallItems" @click="changeWaterfall(waterIndex)">{{waterItem.name}}</view>
    </view>
    <view v-for="(waterItem,waterIndex) in pageData.waterfallItems">
        <view v-show="waterIndex == pageData.currentIndex">
          <waterfalls ref="waterItems" :value="waterItem.list" :column="2" :columnSpace="1" :seat="2" :waterIndex="waterIndex" :currentIndex="pageData.currentIndex" @initValue="initValue">
          </waterfalls>
        </view>
    </view>
  </view>
  <!-- #endif -->
</template>
<script setup>
import { ref, reactive,computed,nextTick } from 'vue'
import {onReachBottom} from '@dcloudio/uni-app'
import waterfalls from './components/testwaterfalls'
const loadCallback = ()=> {

}

let list =[
  { image: 'https://via.placeholder.com/200x500.png/ff0000', title: '我是标题1', desc: '描述描述描述描述描述描述描述描述1' },
  { image: 'https://via.placeholder.com/200x200.png/2878ff', title: '我是标题2', desc: '描述描述描述描述描述描述描述描述2' },

  { image: 'https://via.placeholder.com/200x100.png/FFB6C1', title: '我是标题3', desc: '描述描述描述描述描述描述描述描述3' },
  { image: 'https://via.placeholder.com/200x300.png/9400D3', title: '我是标题4', desc: '描述描述描述描述描述描述描述描述4' },
  { image: 'https://via.placeholder.com/100x240.png/B0E0E6', title: '我是标题5', desc: '描述描述描述描述描述描述描述描述5' },
  { image: 'https://via.placeholder.com/140x280.png/7FFFAA', title: '我是标题6', desc: '描述描述描述描述描述描述描述描述6' },
  { image: 'https://via.placeholder.com/40x60.png/EEE8AA', title: '我是标题7', desc: '描述描述描述描述描述描述描述描述7' },

]
const pageData = reactive({
  currentIndex:0,
  waterfallItems : [
    {isLoadFirst:false,scrollTop:0,name:'分类1',keyword:'',initValue:0,list:list},
    {isLoadFirst:false,scrollTop:0,name:'分类2',keyword:'',initValue:0,list:list},
    {isLoadFirst:false,scrollTop:0,name:'分类3',keyword:'',initValue:0,list:list},
  ],
})

const waterItems = ref()

const changeWaterfall = (index)=>{
  // uni.createSelectorQuery().select(`#page`).boundingClientRect(res => {
  //   pageData.waterfallItems[pageData.currentIndex].scrollTop = res.top
  //   console.log('=====res====', res)
  // }).exec()
  pageData.currentIndex = index
  console.log('change index',index)
  console.log('initValueChange',pageData.waterfallItems[index].initValue)
  waterItems.value[index].initValueChange(pageData.waterfallItems[index].initValue)
  // wx.pageScrollTo({
  //   scrollTop: pageData.waterfallItems[pageData.currentIndex].scrollTop,
  //   duration: 0
  // })
  // console.log(pageData.waterfallItems)
}

const initValue = (index)=>{
  pageData.waterfallItems[pageData.currentIndex].initValue = index
  console.log('更改初始化值:',index)
}

// const data = reactive({
//   list: [
//     { image: 'https://via.placeholder.com/200x500.png/ff0000', title: '我是标题1', desc: '描述描述描述描述描述描述描述描述1' },
//     { image: 'https://via.placeholder.com/200x200.png/2878ff', title: '我是标题2', desc: '描述描述描述描述描述描述描述描述2' },
//     { image: 'https://via.placeholder.com/200x100.png/FFB6C1', title: '我是标题3', desc: '描述描述描述描述描述描述描述描述3' },
//     { image: 'https://via.placeholder.com/200x300.png/9400D3', title: '我是标题4', desc: '描述描述描述描述描述描述描述描述4' },
//     { image: 'https://via.placeholder.com/100x240.png/B0E0E6', title: '我是标题5', desc: '描述描述描述描述描述描述描述描述5' },
//     { image: 'https://via.placeholder.com/140x280.png/7FFFAA', title: '我是标题6', desc: '描述描述描述描述描述描述描述描述6' },
//     { image: 'https://via.placeholder.com/40x60.png/EEE8AA', title: '我是标题7', desc: '描述描述描述描述描述描述描述描述7' },
//   ]
// })

const columnChange = ref(false);

// function add() {
//   const newArr = [
//     { image: 'https://via.placeholder.com/58x100.png/FF7F50', title: '我是标题8', desc: '描述描述描述描述描述描述描述描述8' },
//     { image: 'https://via.placeholder.com/59x100.png/C0C0C0', title: '我是标题9', desc: '描述描述描述描述描述描述描述描述9' },
//     { image: 'https://via.placeholder.com/60x100.png/FAEBD7', title: '我是标题10', desc: '描述描述描述描述描述描述描述描述10' }
//   ]
//   data.list = data.list.concat(newArr);
// }

function add() {
  console.log('add '+pageData.currentIndex)
  const newArr = [
    { image: 'https://via.placeholder.com/58x100.png/FF7F50', title: pageData.currentIndex+'我是标题8', desc: '描述描述描述描述描述描述描述描述8' },
    { image: 'https://via.placeholder.com/59x100.png/C0C0C0', title: pageData.currentIndex+'我是标题9', desc: '描述描述描述描述描述描述描述描述9' },
    { image: 'https://via.placeholder.com/60x100.png/FAEBD7', title: pageData.currentIndex+'我是标题10', desc: '描述描述描述描述描述描述描述描述10' },
    { image: 'https://via.placeholder.com/58x100.png/FF7F50', title: pageData.currentIndex+'我是标题11', desc: '描述描述描述描述描述描述描述描述8' },
    { image: 'https://via.placeholder.com/59x100.png/C0C0C0', title: pageData.currentIndex+'我是标题12', desc: '描述描述描述描述描述描述描述描述9' },
    { image: 'https://via.placeholder.com/60x100.png/FAEBD7', title: pageData.currentIndex+'我是标题13', desc: '描述描述描述描述描述描述描述描述10' },
    { image: 'https://via.placeholder.com/58x100.png/FF7F50', title: pageData.currentIndex+'我是标题14', desc: '描述描述描述描述描述描述描述描述8' },
    { image: 'https://via.placeholder.com/59x100.png/C0C0C0', title: pageData.currentIndex+'我是标题15', desc: '描述描述描述描述描述描述描述描述9' },
    { image: 'https://via.placeholder.com/60x100.png/FAEBD7', title: pageData.currentIndex+'我是标题16', desc: '描述描述描述描述描述描述描述描述10' }
  ]
  pageData.waterfallItems[pageData.currentIndex].list = pageData.waterfallItems[pageData.currentIndex].list.concat(newArr);
  console.log(pageData.waterfallItems[pageData.currentIndex].list)
}

const loadNextPage = ()=>{
  console.log('到底部'+pageData.currentIndex)
  add()
  nextTick(()=>{
    waterItems.value[pageData.currentIndex].initValueChange(pageData.waterfallItems[pageData.currentIndex].initValue+1)
  })

}

onReachBottom (()=>{
  uni.showToast({title:'到底了'})
  loadNextPage()
})
</script>
<style lang="scss" scoped>
.handle {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
  padding: 10rpx;

  .btn {
    margin: 20rpx;
    padding: 0 20rpx;
    background: #2878FF;
    font-size: 28rpx;
    color: #fff;
    &::after {
      border: 0;
    }
  }
}
.item {
  padding: 10rpx 0 20rpx;
  background-color: #F1F1F1;
  .title {
    line-height: 48rpx;
    font-size: 28rpx;
    color: #222;
  }
  .desc {
    font-size: 28rpx;
    color: #666;
  }
}
</style>
