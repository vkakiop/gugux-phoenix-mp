<template>
    <view class="comment">
        <view v-if="pageData.total == -1 || pageData.total == 0">
            <u-empty
                    mode="data"
                    icon="http://cdn.uviewui.com/uview/empty/car.png"
            >
            </u-empty>
        </view>
        <view v-else-if="articleType == 2" class="comment-list">
            <view class="total">共 {{pageData.total}} 条评论</view>
            <u-list :scrollable="false" :height="pageData.height"  
                @scrolltolower="scrolltolower"
            >
                <u-list-item 
                    v-for="(item, index) in pageData.indexList"
                    :key="index"
                >
                    <view class="reply">
                        <view class="head">
                            <image :src="item.userIcon"></image>
                        </view>
                        <view class="contain">
                            <view class="name">{{ item.userName }}</view>
                            <rich-text class="content" v-html="renderTxt(item.content)"></rich-text>
                            <view class="time">
                                {{formatedCommentDate(item.createTime) }}<text class="replys" @click="fatherReply(item,index)">　回复</text>
                                <view class="contain-reply" v-if="item.isExpand < 2">
                                    <view class="contain-row" v-for="(row,indexs) in item.childcomMent" :key="indexs">
                                        <view class="contain-head">
                                            <image :src="row.userIcon"></image>
                                        </view>
                                        <view class="contain-contain">
                                            <view class="name">{{ row.userName }} <image src="/static/img/right.png"></image> {{ row.replyName }}</view>
                                            <rich-text class="content" v-html="renderTxt(row.content)"></rich-text>
                                            <view class="time">
                                                {{formatedCommentDate(row.createTime) }}<text class="replys" @click="childReply(item,row,index)">　回复</text>
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
                                <view v-else-if="item.isExpand == 2" @click="upChange(item,1)">展开全部回复</view>
                                <view v-else-if="item.isExpand == 1" @click="upChange(item,2)">
                                    <view>收起</view><image src="/static/img/up.png"></image>
                                </view>
                            </view>
                        </view>

                        <view class="like" v-if="item.isLike == 0" @click="likeChange(item,1)">
                            <image src="/static/img/heart1.png"></image>
                            <view>{{ item.likesNum }}</view>
                        </view>
                        <view class="like" v-else-if="item.isLike == 1" @click="likeChange(item,0)">
                            <image src="/static/img/heart2.png"></image>
                            <view>{{ item.likesNum }}</view>
                        </view>
                    </view>
                </u-list-item>
            </u-list>
        </view>
        <view v-else-if="articleType == 1" class="comment-list">
            <view class="total">共 {{pageData.total}} 条评论</view>
            
            <view 
                    v-for="(item, index) in pageData.indexList"
                    :key="index"
                >
                    <view class="reply">
                        <view class="head">
                            <image :src="item.userIcon"></image>
                        </view>
                        <view class="contain">
                            <view class="name">{{ item.userName }}</view>
                            <rich-text class="content" v-html="renderTxt(item.content)"></rich-text>
                            <view class="time">
                                {{formatedCommentDate(item.createTime) }}<text class="replys" @click="fatherReply(item,index)">　回复</text>
                                <view class="contain-reply" v-if="item.isExpand < 2">
                                    <view class="contain-row" v-for="(row,indexs) in item.childcomMent" :key="indexs">
                                        <view class="contain-head">
                                            <image :src="row.userIcon"></image>
                                        </view>
                                        <view class="contain-contain">
                                            <view class="name">{{ row.userName }} <image src="/static/img/right.png"></image> {{ row.replyName }}</view>
                                            <rich-text class="content" v-html="renderTxt(row.content)"></rich-text>
                                            <view class="time">
                                                {{formatedCommentDate(row.createTime) }}<text class="replys" @click="childReply(item,row,index)">　回复</text>
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
                                <view v-else-if="item.isExpand == 2" @click="upChange(item,1)">展开全部回复</view>
                                <view v-else-if="item.isExpand == 1" @click="upChange(item,2)">
                                    <view>收起</view><image src="/static/img/up.png"></image>
                                </view>
                            </view>
                        </view>

                        <view class="like" v-if="item.isLike == 0" @click="likeChange(item,1)">
                            <image src="/static/img/heart1.png"></image>
                            <view>{{ item.likesNum }}</view>
                        </view>
                        <view class="like" v-else-if="item.isLike == 1" @click="likeChange(item,0)">
                            <image src="/static/img/heart2.png"></image>
                            <view>{{ item.likesNum }}</view>
                        </view>
                    </view>
                </view>
        </view>
        <commentBox ref="commentBoxRef" @close="commentClose"></commentBox>
    </view>
</template>
<script setup>
import { ref, onMounted, reactive,watch } from 'vue'
import { onLoad ,onReachBottom} from '@dcloudio/uni-app'
import {formatedCommentDate,isArrayEmpty,getTokenValue} from "@/utils/utils"
import emoji from "@/utils/imconfig/emoji";
import commentBox from "@/components/common/commentBox.vue"
import {opuscomment,commentlike,commentlist,subcommentlist} from '@/api/comment/index'
import useRouterStore from '@/store/modules/router'
const emit = defineEmits(['debounce'])
const props = defineProps({
    id:{
        type:String,
        default:''
    },
    articleType:{
        type:Number,
        default:1    // 1 文章  2 视频
    },
})
const pageData = reactive({
    index:'',//回复当前子评论
    childindex:'',
    opusId:'',
    mainCommentId:0,
    replyId:'',
    replyCommentId:'',
    lastCommentId:0,
    childlastCommentId:0,
    pageSize:12,
    total:-1,
    indexList:[],
    content:'',
    height:'500rpx'
})
const commentBoxRef = ref();
const init = (val)=>{
    if(!isLogin()){
        return
    }
    let obj = {
        opusId:pageData.opusId,
        mainCommentId:pageData.mainCommentId,
        replyId:pageData.replyId,
        replyCommentId:pageData.replyCommentId,
    }
    
    commentBoxRef.value.init(val,obj);
}
defineExpose({init})
onReachBottom(()=>{
    props.articleType == 2 && loadmore();
})
const scrolltolower = () => {
    loadmore();
}
const loadmore = () =>{
    let obj = {
        opusId:pageData.opusId,
        lastCommentId:pageData.lastCommentId == 0 ? 0 :pageData.lastCommentId,
        pageSize:pageData.pageSize,
    }
    if(pageData.total == pageData.indexList.length){
        return
    }
    commentlist(obj).then((res)=>{
        let list = [];
        if(!isArrayEmpty(res.data.list)){
            res.data.list.forEach((item)=>{
                list.push({
                    ...item,
                    childcomMent:[],
                    isExpand:0
                })
            })
            pageData.indexList.push(...list);
            pageData.lastCommentId = pageData.indexList[pageData.indexList.length-1].id;
        }else{
            pageData.indexList = [];
        }
        pageData.total = res.data.totalCount || 0;
    })
    // for (let i = 0; i < 2; i++) {
    //     // pageData.indexList.push({
    //     //     id:i,
    //     //     userIcon: i%2 == 1 ? 'https://cdn.uviewui.com/uview/album/1.jpg' :'https://cdn.uviewui.com/uview/album/2.jpg',
    //     //     userName:'咕咕'+i,
    //     //     content:'好震撼的地方，[花痴]作者用心了！已经设置成手机壁纸了[大笑]'+i,
    //     //     likesNum:13+i,
    //     //     isLike: i%2 == 1 ? 0:1,
    //     //     createTime:'2022-02-03 12:21:12',
    //     //     childcomMent:[
    //     //         // {
    //     //         //     id:i,
    //     //         //     userIcon: i%2 == 1 ? 'https://cdn.uviewui.com/uview/album/1.jpg' :'https://cdn.uviewui.com/uview/album/2.jpg',
    //     //         //     userName:'子咕咕'+i,
    //     //         //     content:'好震撼的地方，作者用心了！已经设置成手机壁纸了'+i,
    //     //         //     likesNum:13+i,
    //     //         //     isLike: i%2 == 1 ? 0:1,
    //     //         //     createTime:'2022-02-03 12:21:12',
    //     //         //     replyName:'子被回复'+i,
    //     //         // }
    //     //     ],
    //     //     subCommentNum:2,
    //     //     isExpand:0
    //     // })
    // }
}

watch(()=>props.id,(newVal,oldVal)=>{
  if (newVal) {
    pageData.opusId = newVal;
    pageData.mainCommentId = 0;
    pageData.replyId = '';
    pageData.replyCommentId = '';
    pageData.lastCommentId=0;
    pageData.childlastCommentId=0;
    pageData.total = -1;
    pageData.indexList = [];
    scrolltolower();
    // getApi();
    //   wx请求获取位置权限

  }
  else {
    // uni.showToast({
    //   title: '协议code参数有误！',
    //   icon:'none',
    //   duration: 2000
    // });
  }
},{immediate:true})


const isLogin = ()=>{
    if (getTokenValue()) {
		// scrolltolower();
        return true;
	} else {
		uni.navigateTo({url:'/pages/login/index'});
	}
}

const likeChange = (item,type)=>{
    if(!isLogin()){
        return
    }
    item.isLike = type;
    let obj = {
        commentId:item.id,
        mainCommentId:pageData.mainCommentId == 0 ? 0 :1,
        action:type,
    }
    commentlike(obj).then((res)=>{
        item.likesNum = type == 0 ? item.likesNum - 1 : item.likesNum + 1;
        uni.showToast({
            title: type == 0 ? '取消成功！': '点赞成功！',
            icon: 'none',
            duration: 2000
        })
    })
}
const expandChange = (item)=>{
    // console.log(item);
    if(item.isExpand == 0){
        let obj = {
            commentId:item.id,
            lastCommentId:item.childlastCommentId||0,
            pageSize:pageData.pageSize,
        }
        subcommentlist(obj).then((res)=>{
            let list = [];
            if(!isArrayEmpty(res.data.list)){
                res.data.list.forEach((item)=>{
                    list.push({
                        ...item,
                        childlastCommentId:0
                    })
                })
            }
            item.childcomMent.push(...list);
            item.childlastCommentId = item.childcomMent[item.childcomMent.length-1].id;
            item.isExpand = item.subCommentNum == item.childcomMent.length ? 1 : 0;
        })
        // let i = 1;
        // item.childcomMent.push(
        //     {
        //         id:i,
        //         userIcon: i%2 == 1 ? 'https://cdn.uviewui.com/uview/album/1.jpg' :'https://cdn.uviewui.com/uview/album/2.jpg',
        //         userName:'子咕咕咕咕咕咕咕咕咕咕咕咕咕咕'+i,
        //         content:'好震撼的地方，作者用心了！已经设置成手机壁纸了'+i,
        //         likesNum:13+i,
        //         isLike: i%2 == 1 ? 0:1,
        //         createTime:'2022-02-03 12:21:12',
        //         replyName:'子被回复咕咕咕咕咕咕咕咕咕咕咕咕'+i,
        //     }
        //     )
    }

}
const upChange = (item,type)=>{
    item.isExpand = type;
}
const customEmoji=(value) =>{
    return `<img src="${value}" style="width:25px;height:25px;" />`;
}
const renderTxt =(txt = "") => {
    let rnTxt = [];
    let match = null;
    const regex = /(\[.*?\])/g;
    let start = 0;
    let index = 0;
    while ((match = regex.exec(txt))) {
    index = match.index;
    if (index > start) {
        rnTxt.push(txt.substring(start, index));
    }
    if (match[1] in emoji.obj) {
        const v = emoji.obj[match[1]];
        rnTxt.push(customEmoji(v));
    } else {
        rnTxt.push(match[1]);
    }
    start = index + match[1].length;
    }
    rnTxt.push(txt.substring(start, txt.length));
    return rnTxt.toString().replace(/,/g, "");
}

const commentClose = (data,str)=>{
//将评论内容插入数据中
    if(!str){
        console.log(data);
        pageData.indexList.unshift({
            ...data,
            childcomMent:[],
            isExpand:0
        })
        pageData.total += 1;
    }else if(str == 'child'){
        pageData.indexList[pageData.index].childcomMent.unshift({
            ...data
        })
        pageData.indexList[pageData.index].subCommentNum += 1;
    }
    pageData.mainCommentId = '';
    pageData. replyId = '';
    pageData.replyCommentId = '';
}

const fatherReply = (item,index) =>{
    if(!isLogin()){
        return
    }
    pageData.index = index;
    pageData.mainCommentId = item.id;
    pageData.replyId = item.userId;
    let obj = {
        opusId:pageData.opusId,
        mainCommentId:pageData.mainCommentId,
        replyId:pageData.replyId,
        replyCommentId:pageData.replyCommentId,
    }
    commentBoxRef.value.init(true,obj);
}
const childReply = (item,row,index) =>{
    if(!isLogin()){
        return
    }
    pageData.index = index;
    pageData.mainCommentId = item.id;
    pageData.replyId = item.userId;
    pageData.replyCommentId = row.id;
    let obj = {
        opusId:pageData.opusId,
        mainCommentId:pageData.mainCommentId,
        replyId:pageData.replyId,
        replyCommentId:pageData.replyCommentId,
    }
    commentBoxRef.value.init(true,obj);
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
            margin:20rpx 0;
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
                    word-break   : break-all;
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
