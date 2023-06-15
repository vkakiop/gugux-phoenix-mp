<template>
    <view>
        <u-popup :show="pageData.show" @close="close" @open="open" >
            <view class="comment">
                <view class="contain">
                    <u--input
                        placeholder="请输入内容"
                        border="surround"
                        v-model="pageData.content"
                    ></u--input>
                    <u-icon @click="pageData.showIcon = true" style="width:90rpx;" name="photo" color="#2979ff" size="28"></u-icon>
                    <view style="width:120rpx;">
                        <u-button  type="primary" text="发送" @click="sendMsg"></u-button>
                    </view>
                </view>
                <view v-if="pageData.showIcon"  class="icon">
                    <image
                        v-for="(v,i) in pageData.emojiList"
                        :src="v"
                        :key="i"
                        :title="i"
                        @click="selectEmoji(i)"
                        class="img-style"
                    ></image>
                </view>
            </view>
		</u-popup>
    </view>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import emoji from "@/utils/imconfig/emoji";
import {opuscomment} from '@/api/comment/index'
const emits = defineEmits(['close'])


const pageData = reactive({
    emojiList: emoji.obj,
    show:false,
    opusId:'',
    mainCommentId:'',
    content:'',
    replyId:'',
    replyCommentId:'',
    showIcon:false,
})
const init = (val,obj)=>{
    pageData.show = val;
    if(obj){
        pageData.opusId = obj.opusId ||'';
        pageData.mainCommentId = obj.mainCommentId ||'';
        pageData.replyId = obj.replyId ||'';
        pageData.replyCommentId = obj.replyCommentId ||'';
    }
}
defineExpose({init})
const close = () =>{
    pageData.show = false;
}
const open = () =>{

}
const selectEmoji =(e) => {
    pageData.content += e;
}

const sendMsg = ()=>{
    let obj = {
        opusId:pageData.opusId,
        mainCommentId:pageData.mainCommentId,
        replyId:pageData.replyId,
        replyCommentId:pageData.replyCommentId,
        content:pageData.content
    }
    opuscomment(obj).then((res)=>{
        if(res.code == 200){
            uni.showToast({
                title: '评论成功！',
                icon: 'none',
                duration: 2000
            })
            pageData.show = false;
            pageData.content = '';
            pageData.opusId = '';
            pageData.mainCommentId = '';
            pageData. replyId = '';
            let str = '';
            if(pageData.replyCommentId == ''){
                str = 'father';
            }
            else if(pageData.replyCommentId != ''){
                str = 'child';
            }
            pageData.replyCommentId = '';
            emits('close',res.data,str)
        }
    })
}
</script>
<style lang="scss" scoped>
.comment{
    position: relative;
    .contain{
        padding:10rpx ;
        // position: absolute;
        // top:-100rpx;
        width:100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // background-color: red;
        input{
            height: 50rpx;
        }
    }
    .icon{
        overflow: auto;
        height: 300rpx;
        padding:0 20rpx;
        image{
            width:80rpx;
            height:80rpx;
            margin:10rpx;
        }
    }
}
</style>