<!-- 查看详情 -->
<!-- 去导航 -->
<template>
  <view class="navi">
    <view class="userinfo">
      <view><view>姓名：<text>{{ pageData.data.abnormalName }}</text></view>
      </view>
      <view>
        <view>电话：<text>{{ pageData.data.phone }}</text>
        </view>
        <view @click="callPhone(pageData.data.phone)">
          <image class="phone" @click="playAudio(1,item)" src="/static/img/phone.png"  mode="widthFix"/></view>
      </view>
      <view class="red">
        <view>现场地址：</view>
        <view  @click="goNav"><image class="phone" src="/static/img/location.png"  mode="widthFix"/></view>
      </view>
      <view class="red">{{ pageData.data.unusualLocation }}</view>
    </view>
    <view class="page-section page-section-gap" style="width: 100%; background: #ddd; height: 300rpx;">
      <map style="width: 100%; height: 300rpx;" :latitude="pageData.data.lat" :longitude="pageData.data.lng" :markers="pageData.data.covers">
      </map>
    </view>
    <view class="box">
      <view>现场图片：</view>
      <view class="scroll">
          <image v-for="(item,index) in pageData.data.picture" @click="previewImage(pageData.data.picture,index)" :key="index" :src="item" alt=""></image>
      </view>
    </view>
    <view class="box">
      <view>现场视频：</view>
      <view class="relative" v-for="(item,index) in pageData.data.video" :key="index" @click="previewMedia(item.url)">
        <image :src="item.icon" class="rounded-8 iconplayphoto" mode="widthFix"/>
        <view class="icon_play w-full h-full absolute w-50 h-50"><image class="w-64 h-64" src="@/static/opus/icon_play.png"/></view>
      </view>
    </view>
    <view class="box last">
      <view>现场录音：</view>
      <view class="audio-box">
        <view class="audio-row" v-for="(item,index) in pageData.data.soundRecordingInfoVOS" :key="index">
          <view class="audio-left">
            <view>{{ item.name }}</view>
            <text class="time">{{ item.createTime }}</text>
          </view>
          <view class="audio-right">
            <image @click="playAudio(0,item)" v-if="item.play == 0 ||item.play == undefined" src="/static/img/p1.png" class="rounded-8 iconplayphoto" mode="widthFix"/>
            <image @click="playAudio(1,item)" v-else-if="item.play == 1" src="/static/img/p2.png" class="rounded-8 iconplayphoto" mode="widthFix"/>
          </view>
        </view>
      </view>
    </view>
    <view class="alarm">
      <view v-if="true">您的好友已主动取消安全守护报警</view>
      <view v-else>当前事件已结束</view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { emergenccontactinfo } from '@/api/safeguard/safeguard'
import { onLoad,onUnload } from '@dcloudio/uni-app'
const pageData = reactive({
  data: {
    id: '',
    abnormalName: '',
    phone: '',
    unusualLocation: '',
    lat: '',
    lng: '',
    picture: [],
    video:[],
    soundRecordingInfoVOS: [],
    covers: [{
      latitude: '',
      longitude: '',
      // iconPath: '../../../static/location.png'
    }]
  },
})
let player = null;
onLoad((option) => {
  if (option.id) {
    pageData.data.id = option.id;
    getData({manageId:pageData.data.id});
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


const getData = (params) =>{
  emergenccontactinfo(params).then((res)=>{
    console.log(res);
    pageData.data = res.data;
    pageData.data.covers = [{
      latitude : pageData.data.lat,
      longitude : pageData.data.lng,
    }]
    pageData.data.picture = [
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
    ]
    pageData.data.video = [
      {
        url: "https://cdn.caigetuxun.com/7cc352316adb43b3b1e1cfccff1b4989.mp4",
        icon: "https://cdn.caigetuxun.com/f7b9ca23138544cd8c4d896cf1a86ced.jpeg"
      },
      {
        url: "https://cdn.caigetuxun.com/7cc352316adb43b3b1e1cfccff1b4989.mp4",
        icon: "https://cdn.caigetuxun.com/f7b9ca23138544cd8c4d896cf1a86ced.jpeg"
      },
    ],
    pageData.data.soundRecordingInfoVOS = [
      {
        audio:"https://gi-sycdn.kuwo.cn/3f9d4107a083aea307200007ee5c8663/6486b76e/resource/n2/58/88/2469806786.mp3",
        createTime:'2022-02-23 12:12:12',
        name:'LY1778U841.mp3',
      },
      {
        audio:"https://other-web-rh01-sycdn.kuwo.cn/db7c4bd2b8c4448cbbc94d0a7736c3b2/6486bd4d/resource/n3/54/71/3004052532.mp3",
        createTime:'2022-02-23 12:12:12',
        name:'LY1778U84222.mp3',
      },

    ]
  })
}
const previewImage = (url,index)=>{
  uni.previewImage({
    urls:url,
    current:index
  })
}
const goNav = ()=>{
  uni.navigateTo({ url: '/pages/safeguard/gonavigation?id=' + encodeURIComponent(pageData.data.id) })
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
    pageData.data.soundRecordingInfoVOS.forEach((item)=>{
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
  background-color: #F5F5F5;
  position: relative;
  .userinfo{
    background-color: #fff;
    border-radius: 21rpx;
    padding: 20rpx;
    >view{
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 29rpx;
      font-weight: 400;
      color: #000000;
      >view{
        margin:10rpx 0;
      }
      .phone{
        width:40rpx;
        height: 40rpx;
      }
    }
    .red{
      color:#FF5555;
    }
  }
  .box{
    background-color: #fff;
    border-radius: 21rpx;
    padding: 20rpx;
    margin:40rpx 0;
    color:#000000;
    font-size: 31rpx;
    font-family: Source Han Sans SC;
    font-weight: 400;
    >view{
      padding-bottom: 20rpx;
    }
    .scroll{
      overflow: scroll;
     white-space: nowrap;
      image{
        width:150rpx;
        height: 150rpx;
        margin-right: 25rpx;
        border-radius: 21rpx;
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
        top:calc(50% - 64rpx);
        left:calc(50% - 64rpx);
      }
    }
    .audio-box{
      .audio-row{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10rpx;
        .audio-left{
          font-size: 31rpx;
          font-family: Source Han Sans SC;
          font-weight: 400;
          color: #000000;
          .time{
            font-size: 25rpx;
            font-family: Source Han Sans SC;
            font-weight: 400;
            color: #999999;
          }
        }
        .audio-right{
          image{
            width:50rpx;
            height:50rpx;
          }
        }
      }
    }
  }
  .last{
    margin-bottom: 120rpx;
  }
  .alarm{
    position: fixed;
    bottom:0;
    left: 0;
    width:100%;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    background: #fff;
    border: 0px solid #333333;
    box-shadow: 0rpx 2rpx 10rpx 1rpx rgba(13,4,8,0.11);
    border-radius: 21rpx 21rpx 0rpx 0rpx;
    view{
      font-size: 29rpx;
      font-family: Source Han Sans SC;
      font-weight: 400;
      color: #F65A5A;
    }
  }
}</style>
