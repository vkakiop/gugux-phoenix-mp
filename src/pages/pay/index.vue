<template>
    <view></view>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import { tokenSave, isSwitchTab, loginout } from '@/utils/login'
import { privacyAuth } from "@/utils/utils"
import { payWx } from '@/api/pay/index'
import phoneslogan from './components/phoneslogan.vue'
import { onLaunch, onLoad } from "@dcloudio/uni-app"


onLoad(() => {
    login()
})
const pageDate = reactive({
    mergerId: '',
    openId: '',
    payCode: 3
})

const payData = reactive({
    timeStamp: null,
    nonceStr: null,
    package: null,
    signType: null,
    paysign: null,
})

const tokens = ref(null)
const weixinPay = (data, token) => {
    payWx(data, token).then(res => {
        payData.timeStamp = res.data.timestamp
        payData.nonceStr = res.data.nonceStr
        payData.package = res.data.packageVal
        payData.signType = 'MD5'
        payData.paysign = res.data.sign

        uni.requestPayment({
            provider: 'wxpay',//wxpay微信 alipay支付宝
            orderInfo: payData, //订单数据 后台返回的数据  
            success: function (res) {
                uni.showToast({ title: '支付成功' })
            },
            // 参数有问题则抛出错误
            fail: function (err) {
                uni.showToast({ title: '支付失败' })
            },
        })

    }).catch(e => {

    })
}


const login = () => {
    uni.login({
        provider: 'weixin', //使用微信登录
        success: function (res) {
            if (res.code) {
                pageDate.openId = res.code
                pageDate.mergerId = uni.getStorage({
                    key: 'orderId',
                });
                tokens.value = uni.getStorage({
                    key: 'tokens',
                });
                weixinPay(pageDate, tokens.value)
            }
            else {
                let title = '登录错误：' + res.errMsg
                uni.showToast({ title: title, icon: 'none', duration: 2000 })
            }
            console.log('wxLogin', res)
        },
        fail: function (res) {
            uni.showToast({ title: '登录错误：' + res.detail.code, icon: 'none', duration: 2000 })
        },
    });
}






</script>

<style lang="scss" scoped></style>