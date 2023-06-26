<template>
    <view class="emergencycontact">
        <!--image src="/static/emergencycontact/bg.jpg" alt=""></image-->
        <view class="contain">
            <view>您的好友{{pageData.data.name}}({{ pageData.data.phone }})邀请您
            成为他的紧急联系人</view>
            <view>请登录/注册同意</view>
            <view class="span1">未注册手机号自动登录注册</view>
            <view class="inputs">
                <view class="text">+86</view>
                <view class="num"><input v-model="paramsForm.phone" class="input" placeholder="请输入手机号" maxlength="11" type="text"></view>
            </view>
            <view class="inputs2">
                <view class="num"><input v-model="paramsForm.code" class="input" placeholder="请输入验证码" maxlength="11" type="text"></view>
                <view v-if="!pageData.isGetMsg" class="vaid" @click="getMessage">获取验证码</view>
                <view v-else class="vaid forbid">{{ pageData.showNumber }}秒</view>
            </view>
            <view class="btn" @click="saveForm">
                同意
            </view>
        </view>
    </view>
</template>
<script setup>
import { ref, reactive ,onMounted,onBeforeUnmount} from "vue";
import { onLoad } from '@dcloudio/uni-app'
import {  emergencyregister,emergencysign,authsms} from "@/api/emergencycontact/emergencycontact.js";
const paramsForm = reactive({
    phone:'',
    code:''
})

onLoad((option)=>{
  if (option.id) {
    pageData.id=option.id;
    pageData.redirect=option.redirect;
    getemergencyregister({id:pageData.id});
  }
  else {
    uni.showToast({
      title: '协议code参数有误！',
      icon:'none',
      duration: 2000
    });
  }
})
const pageData = reactive({
    id:'',
    redirect:'',
    data:{
        name:'',
        phone:''
    },
    isGetMsg:false,
    timer:'',
    number:10,//倒数时间秒数
    showNumber:0,//显示倒数秒
})
// let reg =  /^1[3456789]\d{9}$/;
//   if(reg.test(paramsForm.phone)){}

const getemergencyregister = (params)=>{
    emergencyregister(params).then((res)=>{
        pageData.data.name =  res.data.name;
        pageData.data.phone =  res.data.phone.substr(0, 3) + "****" + res.data.phone.substr(7);;
    })
}
const vaildPhone = ()=>{
    let reg =  /^1[3456789]\d{9}$/;
    if(paramsForm.phone == ''){
        uni.showToast({
            title: "请输入手机号！",
            icon: "none"
        })
        return false
    }
    else if(reg.test(paramsForm.phone)){
        return true
    }else{
        uni.showToast({
            title: "请输入正确的手机号！",
            icon: "none"
        })
        return false
    }
}
const getMessage = ()=>{
    let rlt = vaildPhone();
    if(rlt){
        pageData.showNumber = pageData.number;
        pageData.isGetMsg = true;
        pageData.timer =  setInterval(doLoop, 1000);
        let obj = {
            type:1,
            phone:paramsForm.phone
        }
        authsms(obj).then((res)=>{
            uni.showToast({
            title: "验证码已发送！",
            icon: "none"
        })
        })
    }
}
const saveForm = ()=>{
    uni.navigateTo({ url: '/pages/emergencycontact/success?id=' + encodeURIComponent(pageData.id) +'&redirect='+encodeURIComponent(JSON.stringify(pageData.redirect))})
    return
    let rlt = vaildPhone();
    if(!rlt){
        return
    }
    if(paramsForm.code == ''){
        uni.showToast({
            title: "请输入验证码！",
            icon: "none"
        })
        return false
    }
    else if(rlt && paramsForm.code != ''){
        let obj = {
            id:pageData.id,
            phone:paramsForm.phone,
            code:paramsForm.code,
            name:pageData.data.name,
        }
        emergencysign(obj).then((res)=>{
            uni.navigateTo({ url: '/pages/emergencycontact/success?id=' + encodeURIComponent(pageData.id) +'&redirect='+encodeURIComponent(JSON.stringify(pageData.redirect))})
        })
    }
}

const  doLoop = ()=>{
    pageData.showNumber--;
    if(pageData.showNumber > 0){
    }else{
        clearInterval(pageData.timer); //清除js定时器
        pageData.timer = '';
        pageData.showNumber = pageData.number; //重置时间
        pageData.isGetMsg = false;
    }
 }
 onBeforeUnmount(()=>{
    clearInterval(pageData.timer); //清除js定时器
    pageData.timer = '';
 })
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
            display: inline-block;
        }
        .inputs{
            display: flex;
            justify-content: flex-start;
            background: #E9EBEF;
            border-radius: 150rpx;
            padding:20rpx 40rpx;
            margin-top:20rpx;
            font-weight: 400;
            .text{
                margin-right:60rpx;
                color: #929292;
            }
            .num{
                width:100%;
                .input{
                    width:100%;
                    color:#929292;
                    background: transparent;
                }
            }
        }
        .inputs2{
            display: flex;
            justify-content: space-between;
            font-weight: 400;
            margin-top:30rpx;
            .num{
                width:420rpx;
                .input{
                    width:80%;
                    color:#929292;
                    background: #E9EBEF;
                    border-radius: 150rpx;
                    padding:20rpx 40rpx;
                }
            }
            .vaid{
                width:260rpx;
                background: #333333;
                border-radius: 150rpx;
                padding:20rpx 40rpx;
                text-align: center;
                font-weight: 400;
                color: #F8CF01;
            }
            .forbid{
                background: #929292;
            }
        }
        .btn{
            margin-top:30rpx;
            border-radius: 150rpx;
            width:100%;
            height: 80rpx;
            line-height: 80rpx;
            font-weight: 400;
            text-align: center;
            color:#000000;
            background: #F8CF01;
        }
    }
}
</style>