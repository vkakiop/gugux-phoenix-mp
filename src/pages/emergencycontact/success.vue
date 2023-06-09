<template>
    <view class="emergencycontact">
        <image src="/static/emergencycontact/bg.png" alt=""></image>
        <view class="contain">
            <view>感谢您，</view>
            <view>紧急联系人绑定成功</view>
            <view class="span1">后续会为您推送安全守护通知</view>
            <view class="span1">你可以打开咕咕行APP获取更多信息</view>
            <view class="btn" @click="showBox(true)">
                打开咕咕行app
            </view>
            <!-- <view class="">
                <span class="span1" @click="goApp">关注咕咕行公众号</span>
                <view class="card">
                    <view class="img">
                        <img src="@/assets/images/emergencycontact/head.png" alt="">
                    </view>
                    <ul class="card-ul">
                        <li>咕咕行app</li>
                        <li>机车生活分享社区、用车知识加油站、</li>
                        <li>海量陆游游记聚集地...</li>
                    </ul>
                </view>
                <view class="btn btn2">
                    关注公众号
                </view>
            </view> -->
        </view>
    </view>
</template>
<script setup>
import { ref, reactive ,onMounted} from "vue";
import {isMicroMessengerPage,jumpAppStore,distanceOf,formatedDistance} from "@/utils/utils"
const pageData = reactive({
    id:'',
    redirect:''
})
const goApp = ()=>{
    let userInfo = {
        userId:pageData.id,
        type:1,
        redirect:pageData.redirect
    }
    jumpAppStore(userInfo);
}
const show = ref(false);
const showBox = (value)=>{
  if (value) {
    if (isMicroMessengerPage()) {
      show.value = value;
    } else {
        let type = 6 ;
        let userInfo = {
            userId:pageData.id,
            type:type,
            redirect:pageData.redirect
        }
        jumpAppStore(userInfo);
    }
  }
  else {
    show.value = value;
  }
}
</script>
<style lang="scss" scoped>
.emergencycontact{
    height: 100vh;
    background-color: #F8FAFD;
    image{
        width: 100%;
    }
    .contain{
        padding:20rpx;
        font-weight: bold;
        color: #333333;
        font-size: 32rpx;
        .span1{
            font-size: 30rpx;
            color:#666666;
            font-weight: 400;
            padding-top:10rpx;
            display: block;
        }
        .btn{
            margin-top:20rpx;
            border-radius: 150rpx;
            width:100%;
            height: 100rpx;
            line-height: 100rpx;
            font-weight: 400;
            text-align: center;
            color:#fff;
            background: #4BA1F8;
            margin-top: 100rpx;
            margin-bottom: 60rpx;
        }
        .card{
            background-color: #fff;
            padding:20rpx;
            margin:40rpx 0;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .img{
                width:200rpx;
                margin-right:20rpx;
                img{
                    width:100%;
                }
            }
            .card-ul{
                font-size: 24rpx;
                color:#000;
                li{
                    margin:20rpx 0;
                }
            }
        }
        .btn2{
            border-radius: 20rpx;
            margin-top:20rpx;
        }
    }
}
</style>
