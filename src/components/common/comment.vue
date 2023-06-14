<template>
    <view class="comment">
        <view v-if="pageData.total == 0">
            <u-empty
                    mode="data"
                    icon="http://cdn.uviewui.com/uview/empty/car.png"
            >
            </u-empty>
        </view>
        <view v-else class="comment-list">
            <view class="total">共 {{pageData.total}} 条评论</view>
            <u-list
                @scrolltolower="scrolltolower"
            >
                <u-list-item
                    v-for="(item, index) in pageData.indexList"
                    :key="index"
                >
                    <view class="reply" v-for="(item,index) in pageData.indexList" :key="index">
                        <view class="head">
                            <image :src="item.userIcon"></image>
                        </view>
                        <view class="contain">
                            <view class="name">{{ item.userName }}</view>
                            <view class="content">{{ item.content }}</view>
                            <view class="time">
                                {{formatedCommentDate(item.createTime) }}<text class="replys">　回复</text>
                                <view class="contain-reply" v-if="item.isExpand < 2">
                                    <view class="contain-row" v-for="(row,indexs) in item.childcomMent" :key="indexs">
                                        <view class="contain-head">
                                            <image :src="row.userIcon"></image>
                                        </view>
                                        <view class="contain-contain">
                                            <view class="name">{{ row.userName }} <image src="/static/img/right.png"></image> {{ row.replyName }}</view>
                                            <view class="content">{{ row.content }}</view>
                                            <view class="time">
                                                {{formatedCommentDate(row.createTime) }}<text class="replys">　回复</text>
                                            </view>
                                        </view>
                                        <view class="contain-like like">
                                            <image @click="likeChange(row,1)" v-if="row.isLike == 0" src="/static/img/heart1.png"></image>
                                            <image @click="likeChange(row,0)" v-else-if="row.isLike == 1" src="/static/img/heart2.png"></image>
                                            <view>{{ row.likesNum }}</view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view class="expand" v-if="item.subCommentNum > 0">
                                <view v-if="item.isExpand == 0 && isArrayEmpty(item.childcomMent)" @click="expandChange(item)">
                                    <view>展开 {{ item.subCommentNum }} 条回复 </view>
                                    <image src="/static/img/down.png"></image>
                                </view>
                                <view v-else-if="item.isExpand == 0 && item.childcomMent.length<item.subCommentNum" @click="expandChange(item)">展开更多回复</view>
                                <view v-else-if="item.isExpand == 2" @click="upChange(item,1)">展开更多回复</view>
                                <view v-else-if="item.isExpand == 1" @click="upChange(item,2)">
                                    <view>收起</view><image src="/static/img/up.png"></image>
                                </view>
                            </view>
                        </view>
                        
                        <view class="like">
                            <image @click="likeChange(item,1)" v-if="item.isLike == 0" src="/static/img/heart1.png"></image>
                            <image @click="likeChange(item,0)" v-else-if="item.isLike == 1" src="/static/img/heart2.png"></image>
                            <view>{{ item.likesNum }}</view>
                        </view>
                    </view>
                </u-list-item>
            </u-list>
        </view>
    </view>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import {formatedCommentDate,isArrayEmpty} from "@/utils/utils"
import {opuscomment,commentlike,commentlist,subcommentlist} from '@/api/comment/index'
const emit = defineEmits(['debounce'])
const pageData = reactive({
    total:1,
    indexList:[],
    urls: [
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
    content:''
})

onLoad((option)=>{
    scrolltolower();
//   if (option.id) {
//     console.log(option)
//     // getApi();
//     //   wx请求获取位置权限
    
//   }
//   else {
//     uni.showToast({
//       title: '协议code参数有误！',
//       icon:'none',
//       duration: 2000
//     });
//   }
})
const scrolltolower = () => {
    loadmore()
}
const loadmore = () =>{
    for (let i = 0; i < 2; i++) {
        // console.log(i);
        console.log(i%2 == 1);
        pageData.indexList.push({
            id:i,
            userIcon: i%2 == 1 ? 'https://cdn.uviewui.com/uview/album/1.jpg' :'https://cdn.uviewui.com/uview/album/2.jpg',
            userName:'咕咕'+i,
            content:'好震撼的地方，作者用心了！已经设置成手机壁纸了'+i,
            likesNum:13+i,
            isLike: i%2 == 1 ? 0:1,
            createTime:'2022-02-03 12:21:12',
            childcomMent:[
                // {
                //     id:i,
                //     userIcon: i%2 == 1 ? 'https://cdn.uviewui.com/uview/album/1.jpg' :'https://cdn.uviewui.com/uview/album/2.jpg',
                //     userName:'子咕咕'+i,
                //     content:'好震撼的地方，作者用心了！已经设置成手机壁纸了'+i,
                //     likesNum:13+i,
                //     isLike: i%2 == 1 ? 0:1,
                //     createTime:'2022-02-03 12:21:12',
                //     replyName:'子被回复'+i,
                // }
            ],
            subCommentNum:2,
            isExpand:0
        })
    }
}

const likeChange = (item,type)=>{
    item.isLike = type;
}
const expandChange = (item)=>{
    if(item.isExpand == 0){
        let i = 1;
        item.childcomMent.push(
            {
                id:i,
                userIcon: i%2 == 1 ? 'https://cdn.uviewui.com/uview/album/1.jpg' :'https://cdn.uviewui.com/uview/album/2.jpg',
                userName:'子咕咕咕咕咕咕咕咕咕咕咕咕咕咕'+i,
                content:'好震撼的地方，作者用心了！已经设置成手机壁纸了'+i,
                likesNum:13+i,
                isLike: i%2 == 1 ? 0:1,
                createTime:'2022-02-03 12:21:12',
                replyName:'子被回复咕咕咕咕咕咕咕咕咕咕咕咕'+i,
            }
            )
    }
    item.isExpand = item.subCommentNum == item.childcomMent.length ? 1 : 0;
}
const upChange = (item,type)=>{
    item.isExpand = type;
}
</script>
<style lang="scss" scoped>
image{
    width:100%;
    height: 100%;
}
.comment{
    .comment-list{
        padding:0 20rpx;
        .total{
            font-size: 32rpx;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #272A29;
        }
        .reply{
            display: flex;
            justify-content: flex-start;
            padding: 10rpx 10rpx;
            .head{
                margin-right:20px;
                width: 72rpx;
                height: 72rpx;
                border-radius: 50%;
                overflow: hidden;
            }
            .contain{
                width: 460rpx;
                margin-right:40px;
                .name{
                    font-size: 30rpx;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: #999999;
                    image{
                        width:16rpx;
                        height: 25rpx;
                    }
                }
                .content{
                    font-size: 30rpx;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: #272A29;
                    padding:10rpx 0 15rpx 0;
                }
                .time{
                    font-size: 26rpx;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: #999999;
                    .replys{
                        font-size: 26rpx;
                        font-family: Microsoft YaHei;
                        font-weight: 400;
                        color: #272A29;
                    }
                }
                .contain-reply{
                    width:100%;
                    padding:10rpx 0;
                    .contain-row{
                        position: relative;
                        display: flex;
                        justify-content: flex-start;
                        .contain-head{
                            margin-right:10px;
                            width: 42rpx;
                            height: 42rpx;
                            border-radius: 50%;
                            overflow: hidden;
                        }
                        .contain-contain{
                            width:365rpx;
                        }
                        .contain-like{
                            position: relative;
                            left:115rpx;
                        }
                    }
                }
                .expand{
                    margin-top: 10rpx;
                    >view{
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        font-size: 26rpx;
                        font-family: Microsoft YaHei;
                        font-weight: 400;
                        color: #999999;
                        image{
                            margin-left:10px;
                            width:25rpx;
                            height: 20rpx;
                        }
                    }
                }
            }
            .like{
                text-align: center;
                font-size: 26rpx;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #272A29;
                image{
                    width: 33rpx;
                    height: 33rpx;
                }
            }
        }
    }
}
</style>
  