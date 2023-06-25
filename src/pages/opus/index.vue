<template>
    <view v-if="pageData.detail.id">
      <customNav>
        <view @click="gotoBack" class="ml-3 mt-5"><uni-icons type="back" size="24"></uni-icons></view>
        <view class="flex flex-1 items-center" @click="gotoMine">
          <image class="w-32 h-32 rounded-full flex-none" :src="pageData.detail.icon"/>
          <view class="name mx-6 text-14 line-clamp-1">{{pageData.detail.author}}</view>
        </view>
        <debounce @debounce="attention">
          <button :class="['flex-none', 'mr-5', 'w-64', 'h-26', 'leading-26', 'rounded-full', 'text-12', pageData.detail.isFollow ? '' : 'bg-[#f8cf01]', pageData.detail.isFollow ? '' : 'text-[#272a29]']">{{pageData.detail.isFollow ? '已':'+'}}关注</button>
        </debounce>
      </customNav>
      <opus-article :detail="pageData.detail" v-if="pageData.detail.opusType == 1"></opus-article>
      <!--opus-video :detail="pageData.detail" v-else-if="pageData.detail.opusType == 2"></opus-video-->
      <view id="comment_list"><comment ref="commentRef" :id="pageData.detail.id" :createdBy="pageData.detail.createdBy" @reply-finish="getData()"></comment></view>
      <view class="h-50"></view>
      <view class="fixed bottom-0 h-50 w-screen bg-[#f7f7f7]">
        <view class="mx-20 flex justify-between mt-12">
          <view>
            <button class="bg-[#f7f7f7] w-24 h-24 p-0" open-type="share"><img class="w-24 h-24 block" src="@/static/opus/icon_share.png"></button>
          </view>
          <view class="flex">
            <debounce @debounce="like">
              <view class="flex mr-20">
                <image v-if="pageData.detail.isLike" class="w-24 h-24" src="@/static/opus/icon_like_ed.png"/>
                <image v-else class="w-24 h-24" src="@/static/opus/icon_like.png"/>
                <view class="ml-5 mt-2">{{pageData.detail.likeNum}}</view>
              </view>
            </debounce>
            <debounce @debounce="collection">
              <view class="flex mr-20">
                <image v-if="pageData.detail.isCollection" class="w-24 h-24" src="@/static/opus/icon_collect_ed.png"/>
                <image v-else class="w-24 h-24" src="@/static/opus/icon_collect.png"/>
                <view class="ml-5 mt-2">{{pageData.detail.collectionNum}}</view>
              </view>
            </debounce>
            <debounce @debounce="commentAdd">
              <view class="flex mr-0">
                <image class="w-24 h-24" src="@/static/opus/icon_comment.png"/>
                <view class="ml-5 mt-2">{{pageData.detail.commentNum}}</view>
              </view>
            </debounce>
          </view>
        </view>
      </view>
      <u-popup :show="pageData.isShowCommentPop" @close="pageData.isShowCommentPop = false">
        <view class="container">
          <comment ref="comment2Ref" :id="pageData.detail.id" :articleType="2"></comment>
        </view>
        <view
            class="flex items-center ml-14  mb-14 bg-[#f5f6f8]  h-39 w-350 rounded-19 border-1 border-[#E3E3E3] text-14"
            @click="comment2Add">
          <icon type="search" size="11" class="mx-10" />
          <input class="bg-[#f5f6f8]" placeholder="说点什么..." type="text" disabled />
        </view>
      </u-popup>
      <loginPop :isShow="pageData.isShowLoginPop" @close="pageData.isShowLoginPop = false"></loginPop>
    </view>
    <view v-else-if="pageData.isLoadError" class="w-screen h-screen flex justify-center items-center">
      <u-empty mode="data" text="获取文章失败" icon="/static/img/nodata.png"/>
    </view>
</template>

<script setup>
import {reactive, ref, watch, getCurrentInstance, nextTick} from "vue"
import { opusInfo,opusCollect,opusLike,userFans,userFansRemove } from "@/api/opus/index"
import { getTokenValue } from "@/utils/utils"
import {onLoad,onPageScroll} from '@dcloudio/uni-app'
import opusArticle from './components/opusArticle'
import comment from "@/components/common/comment.vue"
import useLoginTokenStore from '@/store/modules/loginToken'

const loginTokenStore = useLoginTokenStore()
const commentRef = ref()
const comment2Ref = ref()
const _this = getCurrentInstance()

onLoad((option)=>{
    pageData.id = option.id
    pageData.traceInfo = decodeURIComponent(option.traceInfo || '')
    getData()
})

watch(()=>loginTokenStore.get().accessToken,(newVal,oldVal)=>{
  getData()
})

const pageData = reactive({
  //id: '1601683533353328803',
  id:'',
  isLoadError:false,
  traceInfo:'',
  isShowLoginPop:false,
  isShowCommentPage:true,
  isShowCommentPop:false,
  observeDistance:0,
  scrollTop:0,
  detail: {
    cover: {},
    opusType: 1,
    content: [],
    recommendedCity: [],
    topics:[],
  }
})

onPageScroll((res) => {
  pageData.scrollTop = res.scrollTop
})

const attention = ()=>{
  let action = pageData.detail.isFollow ? 0 : 1
  if (getTokenValue()) {
    let opusAttention = action ? userFans : userFansRemove
    opusAttention({id:pageData.detail.createdBy}).then(res=>{
      if (action) {
        pageData.detail.isFollow = true

      } else {
        pageData.detail.isFollow = false
      }
      uni.showToast({
        title: (action ? '' : '取消')+'关注成功',
        icon:'none',
        duration: 2000
      })
    })
  }
  else {
    pageData.isShowLoginPop = true
  }

}

const collection = ()=>{
  let action = pageData.detail.isCollection ? 0 : 1
  if (getTokenValue()) {
    opusCollect({opusId: pageData.id, action: action}).then(res => {
      if (action) {
        pageData.detail.isCollection = true
        pageData.detail.collectionNum ++
      } else {
        pageData.detail.isCollection = false
        if (pageData.detail.collectionNum > 0) {
          pageData.detail.collectionNum --
        }
      }
      uni.showToast({
        title: (action ? '' : '取消') + '收藏成功',
        icon: 'none',
        duration: 2000
      })
    })
  }
  else {
    pageData.isShowLoginPop = true
  }
}

const like = ()=>{
  let action = pageData.detail.isLike ? 0 : 1
  if (getTokenValue()) {
    opusLike({opusId: pageData.id, action: action}).then(res => {
      if (action) {
        pageData.detail.isLike = true
        pageData.detail.likeNum ++
        console.log(pageData.detail.likeNum);
      } else {
        pageData.detail.isLike = false
        if (pageData.detail.likeNum > 0) {
          pageData.detail.likeNum --
          console.log(pageData.detail.likeNum);
        }
      }
      uni.showToast({
        title: (action ? '' : '取消') + '点赞成功',
        icon: 'none',
        duration: 2000
      })
    })
  }
  else {
    pageData.isShowLoginPop = true
  }
}

const commentAdd = ()=>{
  commentRef.value.init(true)
  uni.createSelectorQuery().select('#comment_list').boundingClientRect(res=>{
    console.log('res:',res)

    let systemInfo = uni.getSystemInfoSync()
    console.log('systemInfo',systemInfo)

    uni.pageScrollTo({
      scrollTop: pageData.scrollTop + res.top - res.height + 50,
      duration: 300
    })
  }).exec(res=>{
  })
  // if (pageData.isShowCommentPage) {
  //   commentRef.value.init(true)
  // }
  // else {
  //   pageData.isShowCommentPop = true
  // }
}

const comment2Add = ()=>{
  comment2Ref.value.init(true)
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
  getDataApi({opusId:pageData.id,traceInfo:pageData.traceInfo})
}

const getDataApi = (params)=>{
    opusInfo(params).then((res)=>{
      pageData.detail = res.data
      nextTick(()=>{
        observePage()
      })
    }).catch(e=>{
      pageData.isLoadError = true
      pageData.detail.id = 0
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

const observePage = () => {
  let IntersectionObserver = uni.createIntersectionObserver(_this)
  IntersectionObserver.disconnect()
  IntersectionObserver = uni.createIntersectionObserver(_this)
  IntersectionObserver.relativeToViewport({ top: pageData.observeDistance, bottom: pageData.observeDistance })
      .observe(`#comment_list`, ({ intersectionRatio }) => {
        //pageData.isShowCommentPage = intersectionRatio > 0
      })
}
</script>
