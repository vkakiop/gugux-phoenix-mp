<template>
  <view :id="`waterfallgroup_${waterIndex}_${groupIndex}`">
    <view v-if="pageData.isShow" class="w-172" v-for="(item,index) in items" :key="index">
      <waterfallItemTitle v-if="itemType == 'title'" :item="item" :itemKey="itemKey"></waterfallItemTitle>
      <waterfallItemImage v-else :item="item" :itemKey="itemKey"></waterfallItemImage>
    </view>
    <view v-else :style="{height: height+'px'}">
    </view>
  </view>
</template>

<script setup>
import {onMounted, reactive, watch, getCurrentInstance} from "vue"
import waterfallItemTitle from './waterfallItemTitle.vue'
import waterfallItemImage from './waterfallItemImage.vue'
const _this = getCurrentInstance()

const props = defineProps({
  items:Array,
  itemType: {
    type: String,
    default: 'title'
  },
  itemKey: {
    type: String,
    default: ''
  },
  height: {
    type: Number,
    default: 0
  },
  waterIndex: {
    type: Number,
    default: 0
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  groupIndex: {
    type: Number,
    default: 0
  }
})

const pageData = reactive({
  observeDistance:1500,
  isShow:true,
})

onMounted(()=>{
  //observePage()
})

const observePage = () => {
  let IntersectionObserver = uni.createIntersectionObserver(_this)
  IntersectionObserver.relativeToViewport({ top: pageData.observeDistance, bottom: pageData.observeDistance })
      .observe(`#waterfallgroup_${props.waterIndex}_${props.groupIndex}`, ({ intersectionRatio }) => {
        pageData.isShow = intersectionRatio > 0
        console.log('isShow_'+props.groupIndex,pageData.isShow)
      })
}

watch(()=>props.currentIndex == props.waterIndex,(newVal,oldVal)=>{
  if (newVal) {
    pageData.isShow = true
    observePage()
    console.log('开始监听',props.waterIndex)
  }
  else {
    pageData.isShow = false
    let IntersectionObserver = uni.createIntersectionObserver(_this)
    IntersectionObserver.disconnect()
    console.log('结束监听',props.waterIndex)
  }
},{immediate:true})
</script>

<style lang="scss" scoped>
</style>
