<template>
    <view class="red">
        <view class="contain-list">
            <view class="list-li" v-for="(item,index) in pageData.detailList" :key="index">
                <view>
                    <view class="p1">{{ item.name }}</view>
                    <view class="p2">{{ item.time }}</view>
                </view>
                <view v-if="item.type==1" class="p3">- {{ item.num }}</view>
                <view v-else class="p4">+ {{ item.num }}</view>
            </view>
        </view>
    </view>
</template>
<script setup>
import {ref,reactive,onMounted,onBeforeUnmount,nextTick} from 'vue';
import {configStaticPath} from '@/config/index';
import {onLoad,onShow,onPageScroll} from '@dcloudio/uni-app';
import {redbagAdd} from '@/api/redbag/index';
const pageData = reactive({
    detailList:[
        {id:123,name:'提现',time:'2013-12-13 12:12:12' ,type:1,num:'20'},
        {id:124,name:'红包雨活动',time:'2013-12-03 12:12:12' ,type:2,num:'50'},
    ]
})
</script>
<style lang="scss" scoped>
.red{
    .contain-list{
        padding:20rpx;
        .list-li{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom : 1rpx solid #EBEBEB;
            .p1{
                margin-top: 10rpx;
                font-size: 30rpx;
                font-family: Source Han Sans SC;
                font-weight: 400;
                color: #282A29;
                
            }
            .p2{
                font-size: 28rpx;
                font-family: Source Han Sans SC;
                font-weight: 300;
                color: #999999;
                margin-bottom: 20rpx;
                margin-top: 10rpx;
            }
            .p3{
                font-size: 30rpx;
                font-family: Source Han Sans SC;
                font-weight: bold;
                color: #EC5938;
            }
            .p4{
                font-size: 30rpx;
                font-family: Source Han Sans SC;
                font-weight: bold;
                color: #6AB266;
            }
        }
    }
}
</style>