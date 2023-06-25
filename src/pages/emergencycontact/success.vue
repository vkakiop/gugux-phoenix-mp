<template>
    <view class="emergencycontact">
        <image src="/static/emergencycontact/bg.jpg" alt=""></image>
        <view class="contain">
            <view>感谢您，</view>
            <view>紧急联系人绑定成功</view>
            <view class="span1">后续会为您推送安全守护通知</view>
            <view class="span1">你可以打开咕咕行APP获取更多信息</view>
            <view class="btn" @click="showBox(true)">
                打开咕咕行app
            </view>
            <view class="">
                <text class="span1" @click="goApp">关注咕咕行公众号</text>
                <view class="card">
                    <view class="img">
                        <image src="/static/emergencycontact/head.png" alt=""></image>
                    </view>
                    <view class="card-ul">
                        <view>咕咕行app</view>
                        <view>机车生活分享社区、用车知识加油站、</view>
                        <view>海量陆游游记聚集地...</view>
                    </view>
                </view>
                <view class="btn btn2">
                    关注公众号
                </view>
                <official-account bindload="bindload" binderror="binderror"></official-account>
            </view>
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
            color:#333333;
            background: #F8CF01;
            margin-top: 100rpx;
            margin-bottom: 60rpx;
        }
        .card{
            background-color: #fff;
            padding:20rpx;
            margin-top:40rpx;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .img{
                width:200rpx;
                margin-right:20rpx;
                height: 150rpx;
                image{
                    width:100%;
                    height: 100%;
                }
            }
            .card-ul{
                font-size: 24rpx;
                color:#000;
                view{
                    margin:20rpx 0;
                }
            }
        }
        .btn2{
            border-radius: 0 0 20rpx 20rpx;
            margin-top:0rpx;
        }
    }
}
</style>
