<template>
  <view @click.stop="debounceClick">
    <slot></slot>
  </view>
</template>
<script setup>
import {reactive} from 'vue'
const emit = defineEmits(['debounce'])
const pageData = reactive({
  isRun:false
})
const debounceClick = ()=>{
  if (!pageData.isRun) {
    pageData.isRun = true
    emit('debounce')
    setTimeout(()=>{
      pageData.isRun = false
    },2000)
  }
}
</script>
<style>
</style>
