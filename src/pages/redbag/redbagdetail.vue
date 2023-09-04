<template>
    <view class="red">
        <view class="contain-list" v-if="!isArrayEmpty(pageData.detailList)">
            <view class="list-li" v-for="(item,index) in pageData.detailList" :key="index">
                <view>
                    <view class="p1">{{ item.amountStr }}</view>
                    <view class="p2">{{ item.createTime }}</view>
                </view>
                <view v-if="item.amount >=0" class="p4">+ {{ item.amount }}</view>
                <view v-else class="p3">- {{ item.amount }}</view>
            </view>
        </view>
        <view class="nodata" v-else>
            <u-empty
                    mode="data" text="暂时没有红包明细"
                    :icon="configStaticPath('/static/img/nodata.png')"
            >
            </u-empty>
        </view>
    </view>
</template>
<script setup>
import {ref,reactive,onMounted,onBeforeUnmount,nextTick} from 'vue';
import {configStaticPath} from '@/config/index';
import {onLoad,onShow,onPageScroll} from '@dcloudio/uni-app';
import {awardBag} from '@/api/redbag/index';
import {isArrayEmpty} from '@/utils/utils';
const pageData = reactive({
    detailList:[
        // {id:123,amountStr:'提现',createTime:'2013-12-13 12:12:12' ,type:1,amount:'20'},
        // {id:124,amountStr:'红包雨活动',createTime:'2013-12-03 12:12:12' ,type:2,amount:'50'},
    ]
})
onMounted(()=>{
    getawardBag();
})
const getawardBag = ()=>{
    awardBag().then((res)=>{
        pageData.detailList = res.data;
    })
}
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
.nodata{
    padding:200rpx 0;
    }
</style>