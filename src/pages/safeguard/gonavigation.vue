<!-- 去导航 -->
<template>
    <customNav>
        <view @click="gotoBack" class="ml-3 mt-5"><uni-icons type="back" size="24"></uni-icons></view>
        <view>咕咕行</view>
    </customNav>
	<view class="navi">
        <view class="page-section page-section-gap" style="width: 100%; background: #ddd; height: 100vh;">
            <map style="width: 100%; height: 100vh;" :joinCluster="true" :latitude="pageData.data.lat" :longitude="pageData.data.lng" :markers="pageData.data.covers">
      </map>
        </view>
        <view class="box">
            <view class="info">
                <view class="imgbox">姓名： {{ pageData.data.abnormalName }}</view>
                <!-- <view class="imgbox"> <image class="headimg" :src="pageData.data.headImg" /> 　{{ pageData.data.username }}</view> -->
                <view>电话：{{ pageData.data.phone }}</view>
            </view>
            <view class="funk">
                <view class="btn phone" @click="callPhone(pageData.data.phone)">
                    <image :src="configStaticPath('/static/img/phone.png')"  mode="widthFix"/>
                    拨打电话
                </view>
                <view class="btn location" @click="openMap(pageData.data.lng,pageData.data.lat)">
                    <image :src="configStaticPath('/static/img/location.png')"  mode="widthFix"/>
                    导航过去
                </view>
            </view>
        </view>
        <!-- <u-button @click="openBox">打开</u-button>
        <u-popup :show="pageData.show" @close="close">
            <view class="container">
                <comment ref="commentRef" :id="pageData.id" :articleType="2"></comment>
            </view>
            <u-button @click="open">打开评论</u-button>
        </u-popup> -->
    </view>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import comment from "@/components/common/comment.vue"
import { emergenccontactinfo } from '@/api/safeguard/safeguard'
import {configStaticPath} from '@/config/index'
import { onLoad } from '@dcloudio/uni-app'
const pageData = reactive({
    data:{
        id:'',
        userLat:'',
        userLon:'',
        abnormalName: '',
        headImg:'',
        phone: '',
        address: '',
        lat: 39.909,
        lng: 116.39742,
        covers: [{
            latitude: 39.909,
            longitude: 116.39742,
            // iconPath: 'https://cdn.uviewui.com/uview/album/1.jpg',
            // width:10,
            // height:10,
            // callout:{
            //     borderWidth:10,
            //     borderColor:'#000'
            // }
        }]
        // covers:[{
            
        //     latitude: 30.909,
        //     longitude: 120.39742,
        //     // iconPath: '../../../static/img/mark-icon.png'
        //     // iconPath: '../../../static/location.png'
        //     iconPath : 'static/location.png',
        // }]
    }
})
onLoad((option)=>{
  if (option.id) {
    pageData.data.id = option.id
    getData({manageId:pageData.data.id});
    getApi();
    //   wx请求获取位置权限
    
  }
  else {
    // uni.showToast({
    //   title: '协议code参数有误！',
    //   icon:'none',
    //   duration: 2000
    // });
  }
})
const getData = (params)=>{
    emergenccontactinfo(params).then((res)=>{
        pageData.data = res.data;
        console.log(res.data);
        pageData.data.covers = [{
        latitude : pageData.data.lat||0,
        longitude : pageData.data.lng||0,
        }]
    })
}
const commentRef = ref();
const openBox = () =>{
    pageData.show = true;
    // commentRef.value.init(true);
}
const close = () =>{
    pageData.show = false;
}
const open = () =>{
    commentRef.value.init(true);
}
const  openMap = (lon,lat) => {
    console.log("获取经纬度ssssfff",  lat,lon);
    //打开地图，并将门店位置传入
    uni.getLocation({
        success: res => {
            // res.latitude=lat;
            // res.longitude=lon;
            console.log('location success', parseFloat(lat), parseFloat(lon))
            uni.openLocation({
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
                scale: 18
            })
        }
        
    })
}

const getApi = ()=>{
    // wx请求获取位置权限
    getAuthorize()
        .then(() => {
            //   同意后获取
            getLocationInfo();
        })
        .catch(() => {
            //   不同意给出弹框，再次确认
            openConfirm()
                .then(() => {
                    getLocationInfo();
                })
                .catch(() => {
                    rejectGetLocation();
                });
        });
}

//   初次位置授权
const getAuthorize = () => {
    return new Promise((resolve, reject) => {
        uni.authorize({
            scope: "scope.userLocation",
            success: () => {
                resolve(); // 允许授权
            },
            fail: () => {
                reject(); // 拒绝授权
            },
        });
    });
}
// 确认授权后，获取用户位置
const getLocationInfo = () => {
    const that = this;
    uni.getLocation({
        type: "gcj02",
        success: function(res) {
            // 暂时
            pageData.data.userLon = res.userLon; //118.787575;
            pageData.data.userLat = res.userLat; //32.05024;
            console.log("获取当前的用户经度", pageData.data.userLon);
            console.log("获取当前的用户纬度", pageData.data.userLat);
            var long = 0;
            var lat = 0;
            //小数点保留六位  经度
            if (pageData.data.userLon.toString().indexOf('.') > 0) {
                const longlatsplit = pageData.data.userLon.toString().split('.');
                if (longlatsplit.length >= 2) {
                    long = parseFloat(longlatsplit[0] === "" ? 0 : longlatsplit[0]) + parseFloat("." + longlatsplit[1].slice(0,6));
                }
            }
            if (pageData.data.userLat.toString().indexOf('.') > 0) {
                const longlatsplit1 = pageData.data.userLat.toString().split('.');
                if (longlatsplit1.length >= 2) {
                    lat = parseFloat(longlatsplit1[0] === "" ? 0 : longlatsplit1[0]) + parseFloat("." + longlatsplit1[1].slice(0,6));
                }
            }
            // cookie.set("longitude", long);
            // cookie.set("latitude", lat);
            // console.log("纬度", lat);
            // console.log("经度", long);
            // this.distance(pageData.data.latitude,pageData.data.longitude);
            // that.markers = [{
            //     id: "",
            //     latitude: res.latitude,
            //     longitude: res.longitude,
            //     iconPath: "/static/logo.png",
            //     width: that.markerHeight, //宽
            //     height: that.markerHeight, //高
            // }, ];
            // that.getList();
        },
    });
}

// 拒绝授权后，弹框提示是否手动打开位置授权
const openConfirm = () => {
    return new Promise((resolve, reject) => {
        uni.showModal({
            title: "请求授权当前位置",
            content: "我们需要获取地理位置信息，为您进行导航",
            success: (res) => {
                console.log(res)
                if (res.confirm) {
                    uni.openSetting().then((res) => {
                        if (res[1].authSetting["scope.userLocation"] === true) {
                            resolve(); // 打开地图权限设置
                        } else {
                            reject();
                        }
                    });
                } else if (res.cancel) {
                    reject();
                }
            },
        });
    });
}
// 彻底拒绝位置获取
const rejectGetLocation = () => {
    uni.showToast({
        title: "你拒绝了授权，无法获得周边信息",
        icon: "none",
        duration: 2000,
    });
}

const callPhone = (phone) =>{
  uni.makePhoneCall({
    phoneNumber: phone,
    success(){
    console.log('‘拨打成功了’');
    },
    fail() {
    console.log('‘拨打失败了’');
    }
  });
}

const gotoBack = ()=>{
  uni.navigateBack({ delta: 1 })
}
</script>
<style lang="scss" scoped>
.navi{
    position: relative;
    .box{
        width: 100%;
        position: fixed;
        bottom: 0;
        
        .info,.funk{
            display: flex;
            
        }
        .info{
            background-color: rgba(0,0,0,0.5);
            border-radius: 21rpx 21rpx 0rpx 0rpx;
            height: 80rpx;
            align-items: center;
            justify-content: space-around;
            font-size: 30rpx;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #F8CF01;
            .imgbox{
                display: flex;
                align-items: center;
            }
            .headimg{
                width: 45rpx;
                height: 45rpx;
                border-radius: 50%;
            }
        }
        .funk{
            background-color: #fff;
            height: 100rpx;
            align-items: center;
            justify-content: space-around;
            .btn{
                width: 278rpx;
                height: 80rpx;
                border-radius: 38rpx;
                font-size: 32rpx;
                font-family: Microsoft YaHei;
                font-weight: 400;
                text-align: center;
                line-height: 80rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                image{
                    width:40rpx;
                    height: 40rpx;
                    margin-right:10rpx;
                }
            }
            .phone{
                background: #333333;
                color:#F8CF01;
            }
            .location{
                background: #F8CF01;
                color:#333333;
            }
        }
    }
}
.container{
    height: 600rpx;
    overflow: auto;
}
</style>