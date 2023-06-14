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
                    <u-icon style="width:90rpx;" name="photo" color="#2979ff" size="28"></u-icon>
                    <view style="width:90rpx;">
                        <u-button  type="primary" text="发送"></u-button>
                    </view>
                </view>
                表情包
            </view>
		</u-popup>
    </view>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const emit = defineEmits(['close'])


const pageData = reactive({
    show:false,
    content:''
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
</script>
<style lang="scss" scoped>
.comment{
    position: relative;
    height: 300rpx;
}
.contain{
    padding:10rpx 0 ;
    position: absolute;
    top:-100rpx;
    width:100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: red;
    input{
        height: 50rpx;
    }
}
</style>