<template>
  <view v-if="traceInfo.id" class="locus_tip h-100" @click="showApp">
    <view class="relative mx-10 pt-20">
      <view class="locus_tip_bar absolute w-full h-4 top-62 ml-50 w-185"></view>
      <view class="w-90 absolute left-0">
        <view :class="['title_tip','h-26','p-3','pt-3','overflow-hidden']">
          <view class="h-16 overflow-hidden leading-16 text-center justify-center items-center text-white text-10">{{traceInfo.startPlace}}</view>
        </view>
        <view :class="['line_border','locus_icon_sanjiao','mx-auto']"></view>
        <view :class="['locus_tip_icon1','w-12','h-12','mx-auto']"></view>
      </view>
      <view class="w-90 absolute right-0">
        <view :class="['title_tip','h-26','p-3','pt-3','overflow-hidden']">
          <view class="h-16 overflow-hidden leading-16 text-center justify-center items-center text-white text-10">{{traceInfo.endPlace}}</view>
        </view>
        <view :class="['line_border','locus_icon_sanjiao','mx-auto']"></view>
        <view :class="['locus_tip_icon2','w-12','h-12','mx-auto']"></view>
      </view>
      <view class="absolute mx-auto locus_tip_center top-33" v-if="traceInfo.middlePlaceNum">
        <view class="h-26 leading-26 text-center locus_tip_txt text-10">途径{{traceInfo.middlePlaceNum}}地</view>
        <view class="flex justify-between">
          <view class="w-10 h-10 rounded-full locus_cycyle_bg"></view>
          <view class="w-10 h-10 rounded-full locus_cycyle_bg"></view>
          <view class="w-10 h-10 rounded-full locus_cycyle_bg"></view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import {onMounted, reactive, ref, watch} from "vue"
import {jumpAppStore} from "@/utils/utils"
import { getOpusTrack} from "@/api/opus/index"
import {useRoute} from "vue-router";
const props = defineProps({
  item: {
    type: Object,
    default: {},
  },
  width: {
    type: Number,
    default: 578,
  }
})
watch(props.item,(val,oldVal)=>{
  trackId.value = val.content
  getDataApi()
})
onMounted(()=>{
  getDataApi()
})
let trackId = ref(props.item.content);
let traceInfo = ref({})
const getDataApi = ()=>{
  if (trackId.value) {
    getOpusTrack({trackId:trackId.value}).then(res=>{
      traceInfo.value = res.data
    })
  }
}
const route = useRoute();
const id = route.query.id;
const redirect = route.query.redirect;
const  data = reactive({
  detail:{}
})
data.userInfo = {
  userId:id,
  redirect:redirect
}
const showApp = ()=>{
  jumpAppStore(data.userInfo);
}
</script>

<style lang="scss" scoped>
.locus_tip {
  background: url('@/static/opus/opus/locus_bg.png');
  background-size: 100% 100%;
}
.locus_tip_bar {
  background-color: #6aa4ff;
}
.locus_tip_icon1 {
  background: url('@/static/opus/opus/locus_start.png');
  background-size: 100% 100%;
}
.locus_tip_icon2 {
  background: url('@/static/opus/opus/locus_end.png');
  background-size: 100% 100%;
}
.title_tip {
  border:0.02rem solid #fff;
  border-radius: 0.06rem;
  background: #4b8ae6;
  line-height: 0.15rem;
  overflow: hidden;
}
.locus_icon_sanjiao {
  width: 0rem;height: 0rem;
  border-bottom: 0.05rem solid transparent;
  border-left: 0.05rem solid transparent;
  border-right: 0.05rem solid transparent;
  border-top: 0.075rem solid #fff;
  position: relative;
}
.locus_icon_sanjiao:after {
  content:'';
  width: 0rem;height: 0rem;
  border-bottom: 0.04rem solid transparent;
  border-left: 0.04rem solid transparent;
  border-right: 0.04rem solid transparent;
  border-top: 0.06rem solid #4b8ae6;
  position: absolute;
  left: -0.04rem;
  top: -0.095rem;
}
.locus_cycyle_bg {
  background: #6aa4ff;
}
.locus_tip_txt {
  color: #4b8ae6;
}
.locus_tip_center {
  left:50%;
  width:0.5rem;
  margin-left: -0.25rem;
}
</style>
