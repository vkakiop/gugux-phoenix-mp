<template>
  <view class="w-full">
    <template v-for="(element,index) in content" :key="index">
          <view class="text-left px-6 py-6">
            <p v-if="element.itemType == 1" class="item_content">{{element.content}}</p>
            <view v-if="element.itemType == 2">
              <view class="relative">
                <image @click="previewImage(element.content)" :src="element.content" class="rounded-8" style="max-width:100%;"/>
                <view v-if="element.name" class="location_bg absolute left-5 bottom-5 px-10 text-white text-12 rounded">
                  <uni-icons type="location-filled" size="16"></uni-icons>{{element.name}} {{computedLocation(element.x,element.y)}}<!--(距您 {{element.name}})-->
                </view>
              </view>

            </view>
            <view v-if="element.itemType == 3">
              <view class="relative" v-if="element.videoIsPlay == 0" @click="onMaskClick(index)">
                <image :src="element.thumbnail" class="rounded-8" style="max-width:100%;"/>
                <view v-if="element.name" class="location_bg absolute left-5 bottom-5 px-10 text-white text-12 rounded">
                  <uni-icons type="location-filled" size="16"></uni-icons>{{element.name}} {{computedLocation(element.x,element.y)}}<!--(距您 {{element.name}})-->
                </view>
                <view class="icon_play w-full h-full absolute w-50 h-50"><img class="w-50 h-50" src="@/static/opus/icon_play.png"/></view>
              </view>
              <view class="relative" v-if="element.videoIsPlay > 0">
                <vue3videoPlay v-if="element.videoIsPlay > 0"
                               v-bind="element.videoOptions" :id="'video_'+index" :controls="false"
                />
                <view class="video_mask" @click="onMaskClick(index)" ></view>
              </view>
            </view>
            <view v-if="element.itemType == 4">
              <locusTip :item="element"></locusTip>
            </view>
          </view>
    </template>
  </view>
</template>
<script setup>
import {ref, reactive, watch, onMounted, computed} from "vue";
import { distanceOf,formatedDistance } from "@/utils/utils"
//import locusTip from './locusTip.vue'
const props = defineProps({
  content:{
    type:Array,
    default:{},
  },
})

onMounted(()=>{
  //getGeoLocation()
})

//距离获取
const geo_x = ref(null);
const geo_y = ref(null);
// const getGeoLocation = (res) => {
//   if(navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//         function(position) {
//           geo_x.value = position.coords.longitude;
//           geo_y.value = position.coords.latitude;
//         },
//         function(error) {
//         }
//     );
//   }
// }
const computedLocation = computed({
  get:(x,y) => {
    return function(x,y) { return geo_x.value != null ? '(距您'+formatedDistance(distanceOf({x:x,y:y},{x:geo_x.value,y:geo_y.value}),1)+')' : ''}
  }
})


const vue3videoPlayRef = ref();

const itemTypes = [
  {id:1,label:"文字"},
  {id:2,label:"图片"},
  {id:3,label:"视频"},
]
const itemType_change = (itemType)=>{
  if (paramsIsAdd.value) {
    params.value = {itemType:itemType};
  }
}
const params = ref({itemType:1});
const paramsIsAdd = ref(true);
const isDialogShow = ref(false);
const initDialog = () =>{ isDialogShow.value = false}
const submitForm = async (formEl) => {

}
const lines_add = (index) => {
  params.value = {itemType:1}
  paramsIsAdd.value = true;
  isDialogShow.value = true;

  //lines.push({'id':10,'name':'new'})
  //emits('update:modelValue',lines)
}

const lines_edit = (line) => {
  params.value = line;
  paramsIsAdd.value = false;
  isDialogShow.value = true;
}

onMounted(()=>{

})

//视频播放
const videoOptions = {
  width: "100%", //播放器高度
  height: "100%", //播放器高度
  color: "#409eff", //主题色
  title: "", //视频名称
  src: "", //视频源https://cdn.jsdelivr.net/gh/xdlumia/files/video-play/IronMan.mp4
  muted: false, //静音
  webFullScreen: false,
  speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
  autoPlay: true, //自动播放
  loop: false, //循环播放
  mirror: false, //镜像画面
  ligthOff: false, //关灯模式
  volume: 0.3, //默认音量大小
  control: true, //是否显示控制
  controlBtns: [
    "audioTrack",
    "quality",
    "speedRate",
    "volume",
    "setting",
    "pip",
    "pageFullScreen",
    "fullScreen",
  ], //显示所有按钮,
}

const onMaskClick = (index) => {

}

const previewImage = (url)=>{
  let urls = props.content.filter(item=>{
    return item.itemType == 2
  }).map(item=>{
    return item.content
  })

  uni.previewImage({
    urls:urls,
    current:url
  })
}
</script>
<style scoped lang="scss">
.items {
  .location_bg {
    background: rgba(0,0,0,0.5);
  }

  .icon_play {
    top:calc(50% - 0.25rem);
    left:calc(50% - 0.25rem);
  }

  .video_mask {
    background-color: white; position: absolute;z-index:1; width:100%; height: 100%;top:0; left: 0; opacity: 0;
  }
}
</style>
