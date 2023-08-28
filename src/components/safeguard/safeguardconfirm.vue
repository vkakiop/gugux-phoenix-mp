<template>
    <view>
        <u-modal :show="show" :showConfirmButton="false" ref="uModal">
            <view class="slot-content">
                <view class="title">安全守护</view>
                <view class="confirm" v-if="alarmData.showBox">
                    您的好友 {{ alarmData.data.ggx_name }} 邀请您成为他的安全守护紧急联系人。
                    <view class="foot-btn">
                        <view class="btn btn1" @click="closeShow()">拒绝</view>
                        <view class="btn btn2" @click="confirmShow()">同意</view>
                    </view>
                </view>
                <view class="rlt" v-else>
                    <view class="agree" v-if="alarmData.isAgree == 0">
                        <view>感谢您，紧急联系人绑定成功</view>
                        后续会为您推送安全守护通知
                    </view>
                    <view class="disagree" v-else-if="alarmData.isAgree == 1">
                        <view>绑定失败</view>
                        很遗憾，您拒绝了成为{{alarmData.data.ggx_name}}的紧急联系人
                    </view>
                    <view class="disagree" v-else-if="alarmData.isAgree == 2">
                        <view>绑定失败</view>
                        <!-- {{alarmData.data.name}}的紧急联系人绑定已达上限 -->
                        {{ alarmData.msg }}
                    </view>
                    <view class="foot-btn center">
                        <view class="btn btn2" @click="show = false">我知道了</view>
                    </view>
                </view>
            </view>
        </u-modal>
    </view>
</template>


<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import { emergenccontactadd } from '@/api/safeguard/safeguard'
import {onSendCustomEmergencyContactAgree} from "@/utils/chat.js"
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import useSafeguardStore from '@/store/modules/safeguard'
const show = ref(false);
const alarmData = reactive({
    showBox: true,
    data: {
        UserId: '',
        ggx_name: '',
        phone: '',
    },
    isAgree: false,
    msg:'',
})

onLoad(()=>{
  getData();
})
const getData = ()=>{
  let data =  uni.getStorageSync('help_contact');
  console.log(data);
  if(data){
    alarmData.showBox = true;
    alarmData.data =data.data;
    show.value = true;
  }
}

watch(()=>useSafeguardStore().getconfirm(),(newVal,oldVal)=>{
    getData();
})



// alarmData.data.phone =  res.data.phone.substr(0, 3) + "****" + res.data.phone.substr(7);
const confirmShow = (id) => {
    
    let helpId = alarmData.data.userId;
    emergenccontactadd({helpId:helpId}).then((res)=>{
        console.log(res)
        alarmData.isAgree = 0;
        alarmData.showBox = false;
        onSendCustomEmergencyContactAgree({chatType:'contact',chatId:{id:alarmData.data.imId}});
        remove();
    }).catch((res)=>{
        console.log(res,222)
        alarmData.msg =res.msg;
        alarmData.isAgree = 2;
        alarmData.showBox = false;
        remove();
    })
}
const closeShow = (id) => {
    alarmData.showBox = false;
    alarmData.isAgree = 1;
    remove();
}

const remove = () =>{
  uni.removeStorage({
      key: 'help_contact',
      success: function (res) {
          console.log('success');
      }
  });
}
</script>

<style lang="scss" scoped>
.slot-content {
    width: 100%;
    min-height: 350rpx;
    position: relative;
    .title{
        font-size: 34rpx;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #333333;
        text-align: center;
        margin-bottom:30rpx;
    }
    .rlt,.confirm{
        font-size: 30rpx;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #000000;
        line-height: 52rpx;
        text-align: center;
    }
    .foot-btn {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 20rpx;
        position: absolute;
        bottom:0;

        .btn {
            width: 256rpx;
            height: 85rpx;
            line-height: 85rpx;
            border-radius: 43rpx;
            text-align: center;
        }

        .btn1 {
            background: #F4F5F6;
            color: #666666;

        }

        .btn2 {
            background: #FACC0A;
            color: #272A29;
        }
    }
    .center{
        justify-content: center;
    }
}
</style>