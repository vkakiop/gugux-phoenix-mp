<template>
    <view>
      <customNav>
        <view @click="gotoBack"><uni-icons type="back" size="24"></uni-icons></view>
        <view class="flex items-center" @click="gotoMine">
          <image class="w-24 h-24 rounded-full flex-none" :src="pageData.detail.icon"/>
          <view class="name mx-6 text-14 line-clamp-1">{{pageData.detail.author}}</view>
        </view>
        <button class="flex-none mr-100 w-64 h-26 leading-26 rounded-full bg-[#4ba1f8] active:bg-[#3194f9] text-white text-12">+关注</button>
      </customNav>
      <opus-article :detail="pageData.detail" v-if="pageData.detail.opusType == 1"></opus-article>
      <!--opus-video :detail="pageData.detail" v-else-if="pageData.detail.opusType == 2"></opus-video-->
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
  id: '',
  detail: {
    "cover": {},
    "opusType": 1,
    "content": [
    ],
    "recommendedCity": [],
  }
})

const gotoBack = ()=>{
  uni.navigateBack({delta: 1})
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

</script>
