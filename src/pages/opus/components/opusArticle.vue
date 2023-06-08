<template>
  <view class="article">
    <image v-if="detail.cover && ((detail.cover.itemType == 2 && detail.cover.content) || (detail.cover.itemType == 3 && detail.cover.thumbnail))"
           class="w-375 h-170"
           mode="aspectFill"
           :src="detail.cover.itemType == 2 ? detail.cover.content : detail.cover.thumbnail"
           @click="previewImage(detail.cover.itemType == 2 ? detail.cover.content : detail.cover.thumbnail)"
    />
    <view class="mx-27">
      <view class="flex justify-between">
        <view>
          <h1 class="color_title text-20 mt-8 font-bold">{{detail.title}}</h1>
          <view class="flex flex-wrap text-14 mt-10">
            <view class="flex" v-if="detail.recommendedCity">
              <uni-icons type="location-filled" size="16"></uni-icons>
              <view class="ml-5" v-for="item in detail.recommendedCity">{{item}}</view>
            </view>
            <view class="flex">
              <view class="color_time ml-5">发布于：{{detail.createdTime ? detail.createdTime.split(' ')[0] : ''}}</view>
              <view class="color_time ml-5">阅读量：{{detail.browseNum}}</view>
            </view>
          </view>
        </view>
        <!-- <img v-if="detail.boutique" class="icon_jiajin w-45 h-45 mt-10" src="@/static/opus/icon_jiajin.png"/> -->
      </view>
    </view>
    <view class="mx-27 mt-10">
      <view class="text-16 leading-[170%]">
        <opus-content-info :content="detail.content"></opus-content-info>
      </view>
      <view class="text-center mt10 pb-100">
        <view class="mt-30">
          <b> - THE  END - </b>
        </view>
        <view class="color_copy mt-30">
          本文章著作权归 <b class="color_content">{{detail.author}}</b> 所有<br/>
          未经允许，严禁转载，违法必究<br/>
          &copy; By {{new Date().getFullYear()}} 咕咕行
        </view>
      </view>
    </view>
    <view class="fixed bottom-0 h-40 w-screen bg-white">
      <view class="mx-20 flex justify-between mt-7">
        <view class="flex" @click="showApp">
          <view class="flex">
            <img class="w-24 h-24" src="@/static/opus/icon_star.png">
            <view class="ml-5 mt-2">{{detail.collectionNum}}</view>
          </view>
          <view class="flex ml-20">
            <img class="w-24 h-24" src="@/static/opus/icon_comment.png">
            <view class="ml-5 mt-2">{{detail.commentNum}}</view>
          </view>
          <view class="flex ml-20">
            <img class="w-24 h-24" src="@/static/opus/icon_heart.png">
            <view class="ml-5 mt-2">{{detail.likeNum}}</view>
          </view>
        </view>
        <view @click="copyUrl">
          <img class="w-24 h-24" src="@/static/opus/icon_return.png">
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {numberAdd,copyToClip,jumpAppStore} from "@/utils/utils"
import OpusContentInfo from "./opusContentInfo.vue"
const props = defineProps({
  detail:{
    type:Object,
    default:{},
  },
})

const previewImage = (url)=>{
  uni.previewImage({
    urls:[url],
    current:url
  })
}
</script>

<style lang="scss" scoped>
.article {
  .icon_jiajin {margin-right:-0.13rem;}
  .color_title {
    color: #212121;
  }
  .color_content {
    color: #181818;
  }
  .color_time {
    color: #afafaf;
  }

  .color_button {
    color: #ffffff;
    background-color: #26a1fe;
    border-width:0;
  }

  .color_copy {
    color:#959595;
  }
}
</style>
<style>
.d-loading {
  height: 1rem!important;
  top: calc(50% - 0.5rem)!important;
  width: 1rem!important;
  left: calc(50% - 0.5rem)!important;
  z-index:2!important;
  background: rgba(0, 0, 0, 0)!important;
}
</style>
