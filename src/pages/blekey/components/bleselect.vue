<template>
  <view class="ep-picker-box">
    <view class="ep-mask-box" v-show="pageData.show" @click="pageData.show=false"></view>
    <view class="ep-input-box flex justify-between" @click="openOptions" :class="{'disabled':disabled}">
      <view style="display: flex;align-items: center;min-height: 36px;">
        <view class="line-clamp-1">
          <text>{{showLabel}}</text>
          <text :style="`color:${showLabelStateColor}`" class="pl-10">{{showLabelState}}</text>
        </view>
      </view>
      <image v-if="!pageData.show" class="icon-xiala w-20 h-14 flex-none mt-11 mr-9" :src="configStaticPath('/static/blekey/select.png')"></image>
      <image v-else class="icon-xialashang w-20 h-14 flex-none mt-11 mr-9" :src="configStaticPath('/static/blekey/select.png')"></image>
    </view>
    <view v-show="pageData.show" class="ep-picker-content-wrap">
      <scroll-view class="ep-picker-content" :scroll-y="true">
        <view v-for="item in options" :key="item[value_key]"
              :class="{'disabled':item.disabled,'active':modelValue==item[value_key]}"
              class="option-item"
              @click="itemClick(item)">
          <view class="line-clamp-1">
            <text >{{item[label_key]}}</text>
            <text :style="`color:${item.labelStateColor}`" class="pl-10">{{item.labelState}}</text>
          </view>
        </view>
        <view v-if="options.length==0" class="option-no-data">无数据</view>
      </scroll-view>
      <text class="triangle"></text>
    </view>
  </view>
</template>

<script setup>
import {reactive,computed} from 'vue'
import {configStaticPath} from '@/config/index'
const pageData = reactive({
  show: false,
  left: 0,
})

const props = defineProps({
  modelValue:{
    type:[String,Number],
    default:""
  },
  options:{
    type: Array,
    default: function(){
      return []
    }
  },
  value_key:{
    type:String,
    default:"value"
  },
  label_key:{
    type:String,
    default:"label"
  },
  disabled:{
    type:Boolean,
    default:false
  }
})
const emits = defineEmits(['update:modelValue','change'])

const itemClick = (item)=>{
  if(item.disabled) return
  pageData.show = false
  emits('update:modelValue',item[props.value_key])
  emits('change',item)
}
defineExpose({itemClick})

const openOptions = ()=>{
  if(!props.disabled){
    pageData.show  = true
  }
}

const showLabel = computed(()=>{
  let index = props.options.findIndex(item=>{
    return item[props.value_key] == props.modelValue
  })
  if(index != -1){
    return props.options[index][props.label_key]
  }
  if(!props.modelValue) {
    return "请选择"
  }
})

const showLabelState = computed(()=>{
  let index = props.options.findIndex(item=>{
    return item[props.value_key] == props.modelValue
  })
  if(index != -1){
    return props.options[index]['labelState']
  }
  if(!props.modelValue) {
    return ""
  }
})

const showLabelStateColor = computed(()=>{
  let index = props.options.findIndex(item=>{
    return item[props.value_key] == props.modelValue
  })
  if(index != -1){
    return props.options[index]['labelStateColor']
  }
  if(!props.modelValue) {
    return ""
  }
})
</script>

<style scoped>
.ep-picker-box{
  width:100%;
  box-sizing: border-box;
  position: relative;
  font-size: 28rpx;
  color: #333;
  background-color: #F3F3F3;
}
.ep-mask-box{
  position: fixed;
  z-index: 999;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background:none;
}
.ep-input-box{
  border: 1px solid rgb(229, 229, 229);
  border-radius: 8rpx;
  padding-left:20rpx;
  position: relative;
  cursor: pointer;
}

.ep-input-box.disabled{
  cursor:not-allowed;
  background-color: #f5f7fa;
  color: #999;
}

.ep-input-box .iconfont{
  position: absolute;
  top: 50%;
  right: 10rpx;
  font-size: 40rpx;
  transform: translateY(-50%);
  color:#B8B8B8;
}

.ep-picker-content-wrap{
  width: 100%;
  position: absolute;
  top: 90rpx;
  left: 0;
  z-index: 9999;
  padding-top:12rpx;
}

.ep-picker-content-wrap .ep-picker-content{
  background-color: #fff;
  padding:6rpx 0;
  box-shadow: 0 0 40rpx 10rpx rgb(0 0 0 / 30%);
  border-radius: 10rpx;
  max-height:360rpx;
}

.ep-picker-content-wrap .ep-picker-content .option-item{
  padding: 8px 18px;
  cursor: pointer;
}

.ep-picker-content-wrap .ep-picker-content .option-no-data{
  padding: 8px 18px;
  cursor: text;
  color:#999;
  text-align: center;
}

.ep-picker-content-wrap .ep-picker-content .option-item:hover{
  background-color: #f5f7fa;
}

.ep-picker-content-wrap .ep-picker-content .option-item.active{
  color:#000000;
  font-weight: bold;
}

.ep-picker-content-wrap .ep-picker-content .option-item.disabled{
  color:#c0c4cc;
}
.ep-picker-content-wrap .ep-picker-content .option-item.disabled:hover{
  cursor:not-allowed;
}

.ep-picker-content-wrap .triangle{
  width: 0;
  height: 0;
  border-top: 6px solid rgba(0,0,0,0);
  border-right: 6px solid rgba(0,0,0,0);
  border-bottom: 6px solid #fff;
  border-left: 6px solid rgba(0,0,0,0);
  position: absolute;
  top:-6px;
  left:50%;
  transform: translateX(-50%);
  box-sizing: content-box;
}

.icon-xiala {

}
.icon-xialashang {

}
</style>
