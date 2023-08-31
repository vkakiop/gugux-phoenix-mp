<template>
  <view class="redbag">
    <view class="over" v-if="pageData.isOver">
      <view>
        <image :src="configStaticPath('/static/redbag/over.png')" mode="widthFix"></image>
        <view>活动已过期</view>
        <view>请耐心等待下一轮活动吧~</view>
      </view>
    </view>
    <view class="container" v-else>
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
              <view class="box-contain" @click="changeClick('bagClick1',1)">
                <view v-if="!pageData.bagClick1">
                  <image  :src="configStaticPath('/static/redbag/bag1.png')" mode="widthFix"></image>
                </view>  
                <view class="open-red" v-else>
                  <image  :src="configStaticPath('/static/redbag/bag4.png')" mode="widthFix"></image>
                  <view class="rlt">{{ pageData.bagNum1 }}</view>
                </view>
              </view>
              <view class="box-contain" @click="changeClick('bagClick2',2)">
                <view v-if="!pageData.bagClick2">
                  <image  :src="configStaticPath('/static/redbag/bag2.png')" mode="widthFix"></image>
                </view>  
                <view class="open-red" v-else>
                  <image  :src="configStaticPath('/static/redbag/bag4.png')" mode="widthFix"></image>
                  <view class="rlt">{{ pageData.bagNum2 }}</view>
                </view>
              </view>
              <view class="box-contain" @click="changeClick('bagClick3',3)">
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
        <view style="overflow: hidden;height: 500rpx;" v-if="!isArrayEmpty(pageData.scrollList)">
          <view class="scroll-ul" :class="{marquee_top:pageData.animate}">
            <view class="scroll-li" v-for="(item,index) in pageData.scrollList" :key="index">
              {{ item.text }}
            </view>
          </view>
        </view>
        <view class="nodata" v-else>
          暂无中奖用户
        </view>
      </view>
    </view>
    <!-- <button @click="others">打开</button> -->

    <activityJoin ref="activityJoinRef" @clickChange="clickChange"></activityJoin>
  </view>
</template>

<script setup>
import {ref,reactive,onMounted,onBeforeUnmount,nextTick} from 'vue';
import {configStaticPath} from '@/config/index';
import {getHtmlReplaceEnter,isArrayEmpty} from '@/utils/utils';
import {onLoad,onShow,onPageScroll} from '@dcloudio/uni-app';
import {redbagAdd,getwinning} from '@/api/redbag/index';
import activityJoin from './components/activityJoin.vue';
import {getTokenValue,isWxPhoneLogin} from '@/utils/utils'
import moment from 'moment'
const pageData = reactive({
  isShowOfficialAccount:false, //是否在底部显示公众号
  isOver:false,
  timeList:[
    {id:1,time:'',num:6000},
    {id:2,time:'',num:6000},
    {id:3,time:'',num:6000},
    {id:4,time:'',num:6000},
  ],
  num:1,
  bagClick1:false,
  bagNum1:'',
  bagClick2:false,
  bagNum2:'',
  bagClick3:false,
  bagNum3:'',
  scrollList:[
    // {id:1,text:'177****1234 用户获得110元红包'},
    // {id:1,text:'177****1235 用户获得160元红包'},
    // {id:1,text:'177****1244 用户获得150元红包'},
    // {id:1,text:'177****1236 用户获得140元红包'},
    // {id:1,text:'177****1237 用户获得10元红包'},
    // {id:1,text:'177****1238 用户获得0.11元红包'},
    // {id:1,text:'177****1239 用户获得10元红包'},
    // {id:1,text:'177****1231 用户获得1020元红包'},
    // {id:1,text:'177****1212 用户获得10元红包'},
    // {id:1,text:'177****1213 用户获得100元红包'},
    // {id:1,text:'177****113 用户获得100元红包'},
    // {id:1,text:'177****113 用户获得10元红包'},
    // {id:1,text:'177****123 用户获得100元红包'},
    // {id:1,text:'177****113 用户获得10元红包'},
    // {id:1,text:'177****123 用户获得00元红包'},
    // {id:1,text:'177****113 用户获得100元红包'},
    // {id:1,text:'177****113 用户获得10元红包'},
  ],
  animate :false,
  timer:'',
  id:'',
  geo_x:'',
  geo_y:'',
})
onLoad((option)=>{
    pageData.id = option.id;
    getTime();
    getwinningList({id:pageData.id});
})
onShow(()=>{
  if(isWxPhoneLogin()){
    getredbagAdd();
  }
})
onMounted(()=>{
  getGeoLocation();
  //onMessageText('hello wold')
  // pageData.isOver = true;
  
  // if(pageData.isOver == true){
  //   onMessageText('本轮活动已经结束\n请等待下一轮抽奖吧');
  // }
  
})

//开始红包流程
const activityJoinRef = ref()
const onRedbagOpen = (sort)=>{
  nextTick(()=>{
    activityJoinRef.value.init({
      id:pageData.id,
      number:pageData.num,
      geo_x:pageData.geo_x,
      geo_y:pageData.geo_y,
      sort:sort
    })
  })
}
//距离获取
const getGeoLocation = (res) => {
  uni.getLocation({
    type:'gcj02',
    success: function (res) {
      pageData.geo_x = res.longitude;
      pageData.geo_y = res.latitude;
      console.log(res.latitude)
    }
  })
}
const getTime = ()=>{
  pageData.timeList[0].time =  moment().add(0, 'days').format("MM.DD");
  pageData.timeList[1].time =  moment().add(1, 'days').format("MM.DD");
  pageData.timeList[2].time =  moment().add(2, 'days').format("MM.DD");
  pageData.timeList[3].time =  moment().add(3, 'days').format("MM.DD");
}
//显示消息
const onMessageText = (text)=>{
  nextTick(()=>{
    activityJoinRef.value.message({messageText:getHtmlReplaceEnter(text)},true)
  })
}
const getredbagAdd = ()=>{
  let obj = {
    id:pageData.id,
    type:1
  }
  redbagAdd(obj).then((res)=>{
    pageData.num = res.data.number||0;
    pageData.isOver = res.data.isUseless;
  })
}
const getwinningList = (params)=>{
  getwinning(params).then((res)=>{
    pageData.scrollList = res.data;
    if(pageData.scrollList.length>5){
      pageData.timer = setInterval(showMarquee, 2000);
    }
  })
}
// const others = ()=>{
//   uni.navigateTo({
//     url: '/pages/index/searchHistory'
//   })
// }
const changeClick = (key,sort)=>{
  // if(pageData.num == 0 ){
  //   return
  // }
  pageData[key] = true;
  pageData.num -- ;
  onRedbagOpen(sort);
}

const clickChange= (sort,text)=>{
  if(sort == 4){
    pageData.bagClick1 = false;
    pageData.bagClick2 = false;
    pageData.bagClick3 = false;
  }else{
    pageData['bagNum'+sort] = text;
  }
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
    clearInterval(pageData.timer);
    pageData.timer = null;
})

</script>

<style lang="scss" scoped>
  .over{
    background-color: #fff;
    height: 100vh;
    width:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 30rpx;
    font-family: Hiragino Sans GB;
    font-weight: normal;
    color: #000000;
    image{
      width:330rpx;
    }
  }
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
      .nodata{
        padding:200rpx 0;
      }
    }
  }
}
.marquee_top {

  transition: all 0.5s;

  margin-top: -50rpx;

}
</style>