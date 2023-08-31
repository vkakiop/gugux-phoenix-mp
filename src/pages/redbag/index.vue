<template>
  <view class="redbag">
    <view class="container">
      <view class="red-top">
        <image :src="configStaticPath('/static/redbag/bg.png')" mode="widthFix"></image>
        <view class="box">
          <view class="red-time">
            <view class="time-left">
              <image class="img1" :src="configStaticPath('/static/redbag/bagtime1.png')" mode="widthFix"></image>
              <view class="time-text">超多红包等你来扫</view>
            </view>
            <view class="time-right">
              <view class="time-red" v-for="(item,index) in pageData.timeList" :key="index">
                <image :src="configStaticPath('/static/redbag/bagtime.png')" mode="widthFix"></image>
                <view class="time-red-box">
                  <view class="time-text p1">{{ item.time }}</view>
                  <view class="time-text p2">{{ item.num }}</view>
                  <view class="time-text p3">红包</view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="red-box">
          <image :src="configStaticPath('/static/redbag/bg2.png')" mode="widthFix"></image>
          <view class="red-container">
            <view class="title">抽奖机会　<view class="wbig">{{ pageData.num }}</view>　次</view>
            <view class="bag-box">
              <view class="box-contain" @click="changeClick('bagClick1')">
                <view v-if="!pageData.bagClick1">
                  <image  :src="configStaticPath('/static/redbag/bag1.png')" mode="widthFix"></image>
                </view>  
                <view class="open-red" v-else>
                  <image  :src="configStaticPath('/static/redbag/bag4.png')" mode="widthFix"></image>
                  <view class="rlt">{{ pageData.bagNum1 }}</view>
                </view>
              </view>
              <view class="box-contain" @click="changeClick('bagClick2')">
                <view v-if="!pageData.bagClick2">
                  <image  :src="configStaticPath('/static/redbag/bag2.png')" mode="widthFix"></image>
                </view>  
                <view class="open-red" v-else>
                  <image  :src="configStaticPath('/static/redbag/bag4.png')" mode="widthFix"></image>
                  <view class="rlt">{{ pageData.bagNum2 }}</view>
                </view>
              </view>
              <view class="box-contain" @click="changeClick('bagClick3')">
                <view  v-if="!pageData.bagClick3">
                  <image  :src="configStaticPath('/static/redbag/bag3.png')" mode="widthFix"></image>
                </view>  
                <view class="open-red" v-else>
                  <image  :src="configStaticPath('/static/redbag/bag4.png')" mode="widthFix"></image>
                  <view class="rlt">{{ pageData.bagNum3 }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="scroll">
        <view style="overflow: hidden;height: 500rpx;">
          <view class="scroll-ul" :class="{marquee_top:pageData.animate}">
            <view class="scroll-li" v-for="(item,index) in pageData.scrollList" :key="index">
              {{ item.text }}
            </view>
          </view>

        </view>
      </view>
    </view>
    <!-- <button @click="onRedbagOpen">打开</button> -->

    <view v-show="pageData.isShowOfficialAccount" class="fixed z-[9999] bottom-0 left-0 w-full" @click="onOfficialAccount">【测试公众号】
      <official-account></official-account>
    </view>
    <activityJoin ref="activityJoinRef" @ShowOfficialAccount="showOfficialAccount"></activityJoin>
  </view>
</template>

<script setup>
import {ref,reactive,onMounted,onBeforeUnmount} from 'vue'
import {configStaticPath} from '@/config/index'
import activityJoin from './components/activityJoin.vue'

const pageData = reactive({
  isShowOfficialAccount:false, //是否在底部显示公众号
  timeList:[
    {id:1,time:'9.16',num:6000},
    {id:1,time:'9.17',num:4000},
    {id:1,time:'9.18',num:7000},
    {id:1,time:'9.19',num:10000},
  ],
  num:3,
  bagClick1:false,
  bagNum1:'未抽中',
  bagClick2:false,
  bagNum2:'60元',
  bagClick3:false,
  bagNum3:'60元',
  scrollList:[
    {id:1,text:'177****1234 用户获得110元红包'},
    {id:1,text:'177****1235 用户获得160元红包'},
    {id:1,text:'177****1244 用户获得150元红包'},
    {id:1,text:'177****1236 用户获得140元红包'},
    {id:1,text:'177****1237 用户获得10元红包'},
    {id:1,text:'177****1238 用户获得0.11元红包'},
    {id:1,text:'177****1239 用户获得10元红包'},
    {id:1,text:'177****1231 用户获得1020元红包'},
    {id:1,text:'177****1212 用户获得10元红包'},
    {id:1,text:'177****1213 用户获得100元红包'},
    {id:1,text:'177****113 用户获得100元红包'},
    {id:1,text:'177****113 用户获得10元红包'},
    {id:1,text:'177****123 用户获得100元红包'},
    {id:1,text:'177****113 用户获得10元红包'},
    {id:1,text:'177****123 用户获得00元红包'},
    {id:1,text:'177****113 用户获得100元红包'},
    {id:1,text:'177****113 用户获得10元红包'},
  ],
  animate :false,
  timer:'',
})
onMounted(()=>{
  //onMessageText('hello wold')
  if(pageData.scrollList.length>5){
    console.log(1111)
    pageData.timer = setInterval(showMarquee, 2000);
    console.log(1111)
  }
})

//开始红包流程
const activityJoinRef = ref()
const onRedbagOpen = ()=>{
  activityJoinRef.value.init({})
}

//公众号点击添加一次机会
const onOfficialAccount = ()=>{
  activityJoinRef.value.officialAccount({})
}

//显示消息
const onMessageText = (text)=>{
  activityJoinRef.value.message({messageText:text},true)
}

//公众号显示与关闭
const showOfficialAccount = (value)=>{
  pageData.isShowOfficialAccount = value
}

const changeClick = (key)=>{
  if(pageData.num == 0 ){
    return
  }
  pageData[key] = true;
  pageData.num -- ;
  onRedbagOpen();
}

const showMarquee = () =>{
    pageData.animate = true;
    setTimeout(()=>{
        pageData.scrollList.push(pageData.scrollList[0]);
        pageData.scrollList.shift();
        pageData.animate = false;
    },500);
}
onBeforeUnmount(()=>{
    clearInterval(pageData.timer)
    pageData.timer = null
})
</script>

<style lang="scss" scoped>
.redbag{
  background-color: #DA1533;
  .container{
    position: relative;
    .red-top{
      position: relative;
      .img1{
        width: 150rpx !important;
      }
      image{
        position: relative;
        width:100%;
      }
      .box{
        position: absolute;
        right:0;
        left:0;
        margin:0 auto;
        top:80rpx;
        .red-time{
          display: flex;
          justify-content: flex-start;
          width:100%;
          margin: 0 auto;
          .time-left{
            position: relative;
            width: 150rpx;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 20rpx;
            .time-text{
              position: absolute;
              height: 100%;
              width: 80%;
              display: flex;
              align-items: center;
              justify-content: center;
              top:0;
              font-size: 28rpx;
              font-family: Source Han Sans SC;
              font-weight: bold;
              color: #FFFFFF;
              text-align: center;
            }
          }
          .time-right{
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            .time-red-box{
              position: absolute;
              width:140rpx;
              top:0;
              height: 100%;
              text-align: center;
              .p1{
                font-size: 30rpx;
                font-weight: bold;
                color: #FFEFBD;
                margin-top: 15rpx;
              }
              .p2{
                font-size: 32rpx;
                font-family: Source Han Sans SC;
                font-weight: bold;
                color: #FFFFFF;
                margin-top:18rpx;
              }
              .p3{
                font-size: 24rpx;
                font-family: Source Han Sans SC;
                font-weight: 300;
                color: #FFFFFF;
              }
            }
          }
          image{
            width:140rpx;
          }
        }
      }
    }
    .red-box{
      position: absolute;
      right:0;
      left:0;
      margin:0 auto;
      bottom:0;
      bottom:-100rpx;
      width:90%;
      .red-container{
        position: absolute;
        width: 100%;
        top:0;
        .title{
          text-align: center;
          padding:10rpx 0;
          font-size: 30rpx;
          font-family: Source Han Sans SC;
          font-weight: 400;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          .wbig{
            font-size: 40rpx;
          }

        }
        .bag-box{
          padding: 50rpx 0;
          display: flex;
          justify-content: space-between;
          width: 90%;
          margin: 0 auto;
          position: relative;
          .box-contain{
            width:30%;
            .open-red{
              position: relative;
              .rlt{
                position: absolute;
                top:0;
                width:100%;
                height: 100%;
                font-size: 40rpx;
                font-family: Source Han Sans SC;
                font-weight: bold;
                color: #FFEBBD;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
          }
          image{
            width:100%;
          }
        }
      }
    }
    .scroll{

      width:90%;
      margin:0 auto;
      margin-top: 160rpx;
      margin-bottom: 80rpx;
      border: 1rpx solid rgba(#FFF4D8,0.4);
      background: linear-gradient(0deg, #FFF4D8 0%, #FFFFFF 100%);
      background: rgba(#FFF4D8,0.2);
      border-radius: 30rpx;
      font-size: 32rpx;
      font-family: Source Han Sans SC;
      font-weight: 400;
      color: #FFDFB1;
      padding:20rpx ;
      text-align: center;
      .scroll-ul{
        overflow: hidden;
      }
      .scroll-li{
        margin: 10rpx 0;;
      }
    }
  }
}
.marquee_top {

  transition: all 0.5s;

  margin-top: -50rpx;

}
</style>