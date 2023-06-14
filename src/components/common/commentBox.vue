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
                        <u-button  type="primary" text="发送"></u-button>
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
const emit = defineEmits(['close'])


const pageData = reactive({
    emojiList: emoji.obj,
    show:false,
    content:'',
    showIcon:false,
})
const init = (val)=>{
    pageData.show = val;
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