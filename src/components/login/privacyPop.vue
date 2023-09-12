<template>
  <ws-wx-privacy id="privacy-popup"></ws-wx-privacy>
</template>

<script setup>
import wsWxPrivacy from '@/components/common/ws-wx-privacy/ws-wx-privacy.vue'
import {onMounted} from 'vue'
onMounted(()=>{
  privacyAuth()
})


</script>
<style lang="scss" scoped>
</style>