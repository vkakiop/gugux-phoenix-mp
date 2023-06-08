<template>
  <view class="w-full">
    <template v-for="(element,index) in content" :key="index">
          <view class="items text-left px-6 py-6">
            <p v-if="element.itemType == 1" class="text-15">{{element.content}}</p>
            <view v-if="element.itemType == 2">
              <view class="relative">
                <image @click="previewImage(element.content)" :src="element.content" class="rounded-8" mode="widthFix"/>
                <view v-if="element.name" class="location_bg absolute left-5 bottom-5 px-10 text-white text-12 rounded">
                  <uni-icons type="location-filled" size="16"></uni-icons>{{element.name}} {{computedLocation(element.x,element.y)}}<!--(距您 {{element.name}})-->
                </view>
              </view>

            </view>
            <view v-if="element.itemType == 3">
              <view class="relative" @click="previewMedia(element.content)">
                <image :src="element.thumbnail" class="rounded-8" mode="widthFix"/>
                <view v-if="element.name" class="location_bg absolute left-5 bottom-5 px-10 text-white text-12 rounded">
                  <uni-icons type="location-filled" size="16"></uni-icons>{{element.name}} {{computedLocation(element.x,element.y)}}<!--(距您 {{element.name}})-->
                </view>
                <view class="icon_play w-full h-full absolute w-50 h-50"><image class="w-50 h-50" src="@/static/opus/icon_play.png"/></view>
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
import locusTip from './locusTip.vue'
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

onMounted(()=>{

})


const onMaskClick = (index) => {

}

const previewMedia = (url) => {
  let urls = props.content.filter(item=>{
    return item.itemType == 3
  }).map(item=>{
    return item.content
  })
  uni.navigateTo({url:'/pages/opus/videoplay?url='+encodeURIComponent(url)+'&urls='+encodeURIComponent(JSON.stringify(urls))})
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
    top:calc(50% - 50rpx);
    left:calc(50% - 50rpx);
  }

  .video_mask {
    background-color: white; position: absolute;z-index:1; width:100%; height: 100%;top:0; left: 0; opacity: 0;
  }
}
</style>
