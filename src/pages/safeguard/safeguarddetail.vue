<!-- 查看详情 -->
<!-- 去导航 -->
<template>
  <view class="navi">
    <view class="userinfo">
      <view><view>姓名：<text>{{ pageData.data.name }}</text></view>
      </view>
      <view>
        <view>电话：<text>{{ pageData.data.phone }}</text>
        </view>
        <view @click="callPhone(pageData.data.phone)">拨打电话</view>
      </view>
      <view>
        <view>现场地址：</view>
        <view @click="goNav">去导航</view>
      </view>
      <view>{{ pageData.data.address }}</view>
    </view>
    <view class="page-section page-section-gap" style="width: 100%; background: #ddd; height: 300rpx;">
      <!-- <map style="width: 100%; height: 100vh;" :latitude="pageData.data.latitude" :longitude="pageData.data.longitude" :markers="pageData.data.covers"> -->
      <!-- </map> -->
    </view>
    <view class="box">
      <text>现场图片：</text>
      <view class="scroll">
          <image v-for="(item,index) in pageData.data.imgs" @click="previewImage(pageData.data.imgs,index)" :key="index" :src="item" alt=""></image>
      </view>
    </view>
    <view class="box">
      <text>现场视频：</text>
      <view class="relative" v-for="(item,index) in pageData.data.video" :key="index" @click="previewMedia(item.address)">
        <image :src="item.cover" class="rounded-8 iconplayphoto" mode="widthFix"/>
        <view class="icon_play w-full h-full absolute w-50 h-50"><image class="w-50 h-50" src="@/static/opus/icon_play.png"/></view>
      </view>
    </view>
    <view class="box">
      <text>现场录音：</text>
      <view class="audio-box">
        <view class="audio-row" v-for="(item,index) in pageData.data.audio" :key="index">
          <view class="audio-left">
            <view>{{ item.name }}</view>
            <text>{{ item.time }}</text>
          </view>
          <view class="audio-right">
            <image @click="playAudio(0,item)" v-if="item.play == 0 ||item.play == undefined" src="/static/img/s1.svg" class="rounded-8 iconplayphoto" mode="widthFix"/>
            <image @click="playAudio(1,item)" v-else-if="item.play == 1" src="/static/img/s2.svg" class="rounded-8 iconplayphoto" mode="widthFix"/>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { onLoad,onUnload } from '@dcloudio/uni-app'
const pageData = reactive({
  data: {
    id: '',
    name: '张三',
    phone: '13333333333',
    address: '重庆市四川商会重庆市四川商会重庆市四川商会重庆市四川商会',
    latitude: 39.909,
    longitude: 116.39742,
    imgs: [
    'https://cdn.uviewui.com/uview/album/1.jpg',
    'https://cdn.uviewui.com/uview/album/2.jpg',
    'https://cdn.uviewui.com/uview/album/3.jpg',
    'https://cdn.uviewui.com/uview/album/4.jpg',
    'https://cdn.uviewui.com/uview/album/5.jpg',
    'https://cdn.uviewui.com/uview/album/6.jpg',
    'https://cdn.uviewui.com/uview/album/7.jpg',
    'https://cdn.uviewui.com/uview/album/8.jpg',
    'https://cdn.uviewui.com/uview/album/9.jpg',
    'https://cdn.uviewui.com/uview/album/10.jpg',
    ],
    video: [
      {
        address: "https://cdn.caigetuxun.com/7cc352316adb43b3b1e1cfccff1b4989.mp4",
        cover: "https://cdn.caigetuxun.com/f7b9ca23138544cd8c4d896cf1a86ced.jpeg"
      },
      {
        address: "https://cdn.caigetuxun.com/7cc352316adb43b3b1e1cfccff1b4989.mp4",
        cover: "https://cdn.caigetuxun.com/f7b9ca23138544cd8c4d896cf1a86ced.jpeg"
      },
    ],
    audio: [
      {
        audio:"https://gi-sycdn.kuwo.cn/3f9d4107a083aea307200007ee5c8663/6486b76e/resource/n2/58/88/2469806786.mp3",
        time:'2022-02-23 12:12:12',
        name:'LY1778U841.mp3',
      },
      {
        audio:"https://other-web-rh01-sycdn.kuwo.cn/db7c4bd2b8c4448cbbc94d0a7736c3b2/6486bd4d/resource/n3/54/71/3004052532.mp3",
        time:'2022-02-23 12:12:12',
        name:'LY1778U84222.mp3',
      },

    ],
    covers: [{
      latitude: 39.909,
      longitude: 116.39742,
      // iconPath: '../../../static/location.png'
    }]
  },
})
let player = null;
onLoad((option) => {
  if (option.id) {
    pageData.data.id = option.id;
    player  =  uni.createInnerAudioContext();
  }
  else {
    uni.showToast({
      title: '协议code参数有误！',
      icon: 'none',
      duration: 2000
    });
  }
})

const previewImage = (url,index)=>{
  uni.previewImage({
    urls:url,
    current:index
  })
}
const goNav = ()=>{
  uni.navigateTo({ url: '/pages/safeguard/gonavigation?id=' + encodeURIComponent(123) })
}
const callPhone = (phone) =>{
  uni.makePhoneCall({
    phoneNumber: phone,
    success(){
    console.log('‘拨打成功了’');
    },
    fail() {
    console.log('‘拨打失败了’');
    }
  });
}
onUnload(()=>{
  player.pause();
})

const previewMedia = (url) => {
  let urls = [url];
  uni.navigateTo({url:'/pages/opus/videoplay?url='+encodeURIComponent(url)+'&urls='+encodeURIComponent(JSON.stringify(urls))})
}
const playAudio = (type,item) =>{
  console.log(type)
  // type 0 播放 1 暂停
  if(type == 0){
    pageData.data.audio.forEach((item)=>{
      item.play = 0;
    })
    player.src = item.audio;
    player.play();
    item.play = 1;
  }else if(type == 1){
    item.play = 0;
    player.pause();
  }
}
</script>
<style lang="scss" scoped>
.navi {
  padding: 20rpx;
  .userinfo{
    >view{
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
  .box{
    .scroll{
      overflow: scroll;
     white-space: nowrap;
      image{
        width:150rpx;
        height: 150rpx;
        margin-right: 30rpx;
      }
    }
    .iconplayphoto{
      width: 100%;
    }
    .icon_play {
      position: absolute;
      top:0;
      left:0;
      image{
        position: absolute;
        top:calc(50% - 50rpx);
        left:calc(50% - 50rpx);
      }
    }
    .audio-box{
      .audio-row{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding:0 10rpx;
        .audio-left{}
        .audio-right{
          image{
            width:50rpx;
            height:50rpx;
          }
        }
      }
    }
  }
}</style>