<template>
  <canvas id="canvas"></canvas>
  <view id="test" :style="`display: inline-block;font-size:${pageData.fontSize}px`">123456</view>
  <div>
  {{pageData.width}} time:{{pageData.time}}
  </div>
  <view>
  {{pageData.width2}} time:{{pageData.time2}}
  </view>
  <view>fontSize:{{pageData.fontSize}}</view>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick, computed, getCurrentInstance } from 'vue'
import {AMapWX} from '@/utils/amap-wx.js'
let query = null
let test = null
let canvas = null
let ctx = null
const _this = getCurrentInstance()
const pageData = reactive({
  width:0,
  width2:0,
  time:0,
  time2:0,
  fontSize:0
})
onMounted(()=>{
  console.log('onMounted')
  query = uni.createSelectorQuery().in(_this);
  test = query.select(`#test`)
  canvas = query.select('#canvas')

  pageData.fontSize = wx.getSystemInfoSync().windowWidth/750*32

  ctx = wx.createCanvasContext('canvas');
  ctx.setFontSize(pageData.fontSize)
  let startTime = new Date().getTime()
  for(let i = 0;i<1;i++){
    pageData.width = ctx.measureText('123456').width
    console.log('measureText:',ctx.measureText('123456'))
  }
  pageData.time = new Date().getTime() - startTime

  startTime = new Date().getTime()
  setTimeout(()=>{
    test.boundingClientRect(res => {
      console.log('res:',res)
      pageData.width2 = res.width
      pageData.time2 = new Date().getTime() - startTime
      //console.log('text run time:',endTime2 - startTime2)
    }).exec(() => {
    })
  },100)
})
</script>