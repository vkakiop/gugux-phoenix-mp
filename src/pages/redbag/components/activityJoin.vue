<template>
  <view>
    <u-popup :show="pageData.isShowLogin" mode="bottom" round="10" :customStyle="{marginLeft:'0rpx',marginRight:'0rpx'}">
      <view class="mx-30 mt-20 mb-16">
        <view class="flex justify-between">
          <view class="flex">
            <image :src="configStaticPath('/static/redbag/poplogo.png')" class="w-20 h-20 rounded-full"></image>
            <view class="ml-5 text-16 text-[#000000] text-center font-bold">咕咕行</view>
          </view>
          <image :src="configStaticPath('/static/redbag/popicon.png')" class="w-20 h-20" @click="closeLogin(true)"></image>
        </view>
        <view class="mt-20 text-15">
          <view class="leading-22 text-[#333] font-bold">
            申请获取以下权限
          </view>
          <view class="text-[#999] mt-50">
            获得你微信绑定的手机号码
          </view>
        </view>
        <view class="mt-20">
          <button :open-type="true ? 'getPhoneNumber':''" @click="getPhoneNumberValid" @getphonenumber="getPhoneNumber" class="h-40 leading-40 rounded-full bg-[#51ab3a] active:bg-[#09b307] text-white text-14">授权登录</button>
        </view>
      </view>
    </u-popup>
    <u-popup :show="pageData.isShowRedbag" mode="center" bgColor="transparent">
      <view>
        <view class="relative w-375 h-460">
          <image :src="configStaticPath('/static/redbag/popbg.png')" class="w-full h-408 absolute left-0 top-0"/>
          <view class="absolute w-full text-center text-[#FFEDAC]">
            <view v-if="pageData.redbagInfo.isDraw">
              <view class="mt-63 text-14">恭喜您获得咕咕行油费</view>
              <view class="text-[#FFFFFC] mt-10">
                <!--text class="text-20">￥</text-->
                <text class="text-46">{{pageData.redbagInfo.amount}}</text>
                <text class="text-15">元</text>
              </view>
            </view>
            <view v-else class="mt-65 pb-50 text-14">
              非常遗憾，没有抽中咕咕行油费
            </view>
            <view class="mt-15 text-16">
              <view>
                <view>咕咕行出行社交APP</view>
                <view>海量摩友聚集地</view>
              </view>
              <view class="mt-20 text-14"><!--下载APP可获得1次抽奖机会--></view>
            </view>
          </view>
          <!--image :src="configStaticPath('/static/redbag/popbutton.png')" class="w-122 h-41 absolute left-[calc(50%-122rpx)] bottom-125" @click="close"/-->
          <!--image :src="configStaticPath('/static/redbag/popbuttondown.png')" class="w-122 h-41 absolute left-[calc(50%-122rpx)] bottom-125" @click="downApp"/-->
          <image :src="configStaticPath('/static/redbag/popbuttonok.png')" class="w-122 h-41 absolute left-[calc(50%-122rpx)] bottom-125" @click="buttonOk"/>

          <view v-if="pageData.redbagInfo.isDraw" class="absolute w-full flex justify-center bottom-105">
            <view class="text-center text-14 text-[#FFEDAC] inline-block rounded-full">油费已转入您的微信零钱</view>
          </view>
          <image :src="configStaticPath('/static/redbag/popclose.png')" class="w-39 h-39 absolute left-[calc(50%-39rpx)] bottom-0" @click="closeRedbag"/>
        </view>
      </view>
    </u-popup>
    <u-popup :show="pageData.isShowMessage" mode="center" bgColor="transparent">
      <view class="w-300 bg-white rounded-20">
        <view class="mt-17 mx-auto">
          <view class="flex justify-center">
            <image :src="configStaticPath('/static/redbag/popicon.png')" class="w-49 h-49"></image>
          </view>
          <view class="mt-13 flex justify-center">
            <rich-text v-html="pageData.messageText" class="w-4/5 font-bold text-center text-18 text-[#333333]"></rich-text>
          </view>
        </view>
        <view class="flex justify-center">
          <view class="mt-13 mb-13 w-146 h-43 leading-43 rounded-full bg-[#F4F5F6] text-17 text-center text-[#333333]" @click="closeMessage">关闭</view>
        </view>
      </view>
    </u-popup>
    <loginPop :isShow="pageData.isShowLoginPop" :isShowWxPhoneNumber="false" @close="closeLogin(true)"></loginPop>
  </view>
</template>

<script setup>
import {reactive} from "vue"
import {authWxLogin} from '@/api/login/index'
import {tokenSave} from '@/utils/login'
import {configStaticPath} from '@/config/index'
import {getTokenValue,isWxPhoneLogin,getHtmlReplaceEnter} from '@/utils/utils'
import {redbagAdd,redbagInfo} from '@/api/redbag/index'

const emit = defineEmits(['clickChange','updataList'])
const pageData = reactive({
  isShowLoginPop:false, //过审用

  parentInfo: {},
  isShowLogin:false,

  isShowRedbag:false,
  redbagInfo:{},

  isShowMessage:false,
  messageText:'',

  jsCode:'',
})

const isWxPhoneLoginCheck = () =>{
  if (pageData.parentInfo.testFlag) {
    return getTokenValue() ? true : false
  }
  else {
    return isWxPhoneLogin()
  }
}

const init = (row) => {
  if (row) {
    pageData.parentInfo = row
  }
  //判断数量如果为0弹出消息
  if (pageData.parentInfo.num <= 0) {
    pageData.isShowMessage = true
    pageData.messageText = '您的抽奖次数已用完'
    emit('clickChange',4,'')
    return
  }

  //判断是否微信授权登录
  if (!isWxPhoneLoginCheck()) {
    // if (pageData.parentInfo.testFlag) {
    //   pageData.isShowLoginPop = true
    // }
    // else {
    //   pageData.isShowLogin = true
    // }
    pageData.isShowLoginPop = true
    return
  }

  //没有经纬度再定位
  if (!(pageData.parentInfo.geo_x && pageData.parentInfo.geo_y)) {
    uni.getLocation({
      type:'gcj02',
      success: function (res) {
        pageData.parentInfo.geo_x = res.longitude
        pageData.parentInfo.geo_y = res.latitude
        getRedbagInfo()
      },
      fail: function (res) {
        getRedbagInfo()
      }
    })
  }
  else {
    getRedbagInfo()
  }
}

const getRedbagInfo = ()=>{
  console.log('请求经纬度信息：',pageData.parentInfo.geo_x,pageData.parentInfo.geo_y)
  redbagInfo({id:pageData.parentInfo.id,sort:pageData.parentInfo.sort,lng:pageData.parentInfo.geo_x,lat:pageData.parentInfo.geo_y}).then(res=>{
    pageData.redbagInfo = res.data || {}
    pageData.isShowRedbag = true

    let text = pageData.redbagInfo.isDraw ? pageData.redbagInfo.amount + '元' : '未中奖'
    emit('clickChange',pageData.parentInfo.sort,text)

  }).catch(e=>{
    pageData.isShowMessage = true
    pageData.messageText = getHtmlReplaceEnter(e.msg)
    emit('clickChange',4,'')
  })
}

const message = (row) => {
  if (row) {
    pageData.isShowMessage = true
    pageData.messageText = getHtmlReplaceEnter(row.messageText)
  }
}
defineExpose({ init,message })

const getPhoneNumberValid = ()=>{
  pageData.isShowLogin = false
  pageData.isShowLoginPop = false

  uni.login({
    provider: 'weixin', //使用微信登录
    success: function (res) {
      if (res.code) {
        pageData.jsCode = res.code
      }
      else {
        let title = '登录错误：'+res.errMsg
        uni.showToast({title:title,icon: 'none', duration: 2000})
      }
      console.log('wxLogin',res)
    },
    fail : function(res) {
      uni.showToast({title:'登录错误：'+res.detail.code,icon: 'none', duration: 2000})
    },
  });
}

const getPhoneNumber = (e)=> {
  console.log('getPhoneNumber',e)
  if (e.detail.code) {
    if (pageData.jsCode) {
      authWxLogin({code:e.detail.code,jsCode:pageData.jsCode}).then(res=>{
        tokenSave(res,'', true).then(res=>{
          redbagAdd({type:1,id:pageData.parentInfo.id}).then(res=>{
            pageData.parentInfo.num = res.data.number
            // if (pageData.parentInfo.num > 0) {
            //   init()
            // }
            emit('updataList')
            uni.showToast({title:'登录成功',icon: 'none', duration: 2000})
            emit('clickChange',4,'')
          }).catch(e=>{
            emit('clickChange',4,'')
          })
        }).catch(e=>{
          emit('clickChange',4,'')
        })
      }).catch(e=>{
        emit('clickChange',4,'')
      })

    }
    else {
      setTimeout(()=>{
        if (pageData.jsCode) {
          authWxLogin({code: e.detail.code, jsCode: pageData.jsCode}).then(res => {
            tokenSave(res, '', true).then(res=>{
              redbagAdd({type:1,id:pageData.parentInfo.id}).then(res=> {
                pageData.parentInfo.num = res.data.number
                // if (pageData.parentInfo.num > 0) {
                //   init()
                // }
                emit('updataList')
                uni.showToast({title:'登录成功',icon: 'none', duration: 2000})
                emit('clickChange',4,'')
              }).catch(e=>{
                emit('clickChange',4,'')
              })
            }).catch(e=>{
              emit('clickChange',4,'')
            })
          }).catch(e=>{
            emit('clickChange',4,'')
          })
        }
        else {
          uni.showToast({title:'登录获取code错误',icon: 'none', duration: 2000})
          emit('clickChange',4,'')
        }
      },2000)
    }
  }
  else {
    let title = '获取手机号错误：' + e.detail.errMsg
    if (title.indexOf('getPhoneNumber:fail user deny') != -1) {
      title = '获取手机号用户取消授权'
    }
    else if (title.indexOf('etPhoneNumber:fail no permission') != -1) {
      title = '获取手机号暂无权限'
    }
    uni.showToast({title:title,icon: 'none', duration: 2000})
    emit('clickChange',4,'')
  }
}

const closeLogin = (isRelease)=>{
  pageData.isShowLogin = false
  pageData.isShowLoginPop = false
  if (isRelease) {
    emit('clickChange',4,'')
  }
}

const closeRedbag = ()=>{
  pageData.isShowRedbag = false
}

const closeMessage = ()=>{
  pageData.isShowMessage = false
}

const downApp = ()=>{
  pageData.isShowRedbag = false
  uni.navigateTo({url:'/pages/downapp/index?type=redbag&id='+(pageData.redbagInfo.isType ? '' : pageData.parentInfo.id)})
}

const buttonOk = ()=>{
  pageData.isShowRedbag = false
}
</script>

<style lang="scss" scoped>

</style>