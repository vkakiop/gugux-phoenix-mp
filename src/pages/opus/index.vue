<template>
    <view>
      <customNav>
        <view @click="gotoBack"><uni-icons type="back" size="24"></uni-icons></view>
        <view class="flex items-center" @click="gotoMine">
          <image class="w-24 h-24 rounded-full flex-none" :src="pageData.detail.icon"/>
          <view class="name mx-6 text-14 line-clamp-1">{{pageData.detail.author}}</view>
        </view>
        <button class="flex-none mr-100 w-64 h-26 leading-26 rounded-full bg-[#4ba1f8] active:bg-[#3194f9] text-white text-12" @click="onFollow">+关注</button>
      </customNav>
      <opus-article :detail="pageData.detail" v-if="pageData.detail.opusType == 1"></opus-article>
      <!--opus-video :detail="pageData.detail" v-else-if="pageData.detail.opusType == 2"></opus-video-->
      <view class="fixed bottom-0 h-40 w-screen bg-white">
        <view class="mx-20 flex justify-between mt-7">
          <view class="flex" @click="showApp">
            <view class="flex">
              <img class="w-24 h-24" src="@/static/opus/icon_star.png">
              <view class="ml-5 mt-2">{{pageData.detail.collectionNum}}</view>
            </view>
            <view class="flex ml-20">
              <img class="w-24 h-24" src="@/static/opus/icon_comment.png">
              <view class="ml-5 mt-2">{{pageData.detail.commentNum}}</view>
            </view>
            <view class="flex ml-20">
              <img class="w-24 h-24" src="@/static/opus/icon_heart.png">
              <view class="ml-5 mt-2">{{pageData.detail.likeNum}}</view>
            </view>
          </view>
          <view>
            <button open-type="share"><img class="w-24 h-24" src="@/static/opus/icon_return.png"></button>
          </view>
        </view>
      </view>

      <loginPop :isShow="pageData.isShowLoginPop" @close="pageData.isShowLoginPop = false"></loginPop>
    </view>
</template>

<script setup>
import { ref, reactive ,onMounted} from "vue"
import {  opusInfo } from "@/api/opus/index"
import { onLoad } from '@dcloudio/uni-app'
import opusArticle from './components/opusArticle'

onLoad((option)=>{
    pageData.id = option.id
    getData();
})

const pageData = reactive({
  //id: '1601683533353328803',
  id:'',
  isShowLoginPop:false,
  detail: {
    "cover": {},
    "opusType": 1,
    "content": [
    ],
    "recommendedCity": [],
  }
})

const onFollow = ()=>{
  pageData.isShowLoginPop = true
}

const gotoBack = ()=>{
  let pages = getCurrentPages()
  if (pages.length == 1) {
    uni.switchTab({url:'/pages/index/index'})
  }
  else {
    uni.navigateBack({delta: 1})
  }
}

const gotoMine = ()=>{
  uni.switchTab({url:'/pages/mine/mine?id='+pageData.detail.createdBy})
}

const getData = ()=>{
  getDataApi({id:pageData.id})
}

const getDataApi = (params)=>{
    opusInfo(params).then((res)=>{
        pageData.detail = res.data
    })
}

const onShareAppMessage = ()=>{
  return {
    title:pageData.detail.brief,
    path:'/pages/opus/index?id='+pageData.id,
    imageUrl:pageData.detail.cover.itemType == 2 ? pageData.detail.cover.content : pageData.detail.cover.thumbnail
  }
}

const onShareTimeline = ()=>{
  return onShareAppMessage()
}
</script>
