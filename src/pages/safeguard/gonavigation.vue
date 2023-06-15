<!-- 去导航 -->
<template>
	<view class="navi">
        <!-- <view class="page-section page-section-gap" style="width: 100%; background: #ddd; height: 100vh;">
            <map style="width: 100%; height: 100vh;" :latitude="pageData.latitude" :longitude="pageData.longitude" :markers="pageData.covers">
            </map>
        </view>
        <view class="box">
            <view class="info">
                <view>姓名：张三</view>
                <view>电话：186966666666</view>
            </view>
            <view class="funk">
                <view>拨打电话</view>
                <view @click="openMap(pageData.longitude,pageData.latitude)">去导航</view>
            </view>
        </view> -->
        <u-button @click="openBox">打开</u-button>
        <comment ref="commentRef"></comment>
    </view>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import comment from "@/components/common/comment.vue"

import { onLoad } from '@dcloudio/uni-app'
const pageData = reactive({
    userLat:'',
    userLon:'',
    latitude:30.909,
    longitude:120.39742,
    covers:[{
        latitude: 30.909,
        longitude: 120.39742,
        // iconPath: '../../../static/location.png'
    }]
})
onLoad((option)=>{
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

const commentRef = ref();
const openBox = () =>{
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
            pageData.userLon = res.userLon; //118.787575;
            pageData.userLat = res.userLat; //32.05024;
            console.log("获取当前的用户经度", pageData.userLon);
            console.log("获取当前的用户纬度", pageData.userLat);
            var long = 0;
            var lat = 0;
            //小数点保留六位  经度
            if (pageData.userLon.toString().indexOf('.') > 0) {
                const longlatsplit = pageData.userLon.toString().split('.');
                if (longlatsplit.length >= 2) {
                    long = parseFloat(longlatsplit[0] === "" ? 0 : longlatsplit[0]) + parseFloat("." + longlatsplit[1].slice(0,6));
                }
            }
            if (pageData.userLat.toString().indexOf('.') > 0) {
                const longlatsplit1 = pageData.userLat.toString().split('.');
                if (longlatsplit1.length >= 2) {
                    lat = parseFloat(longlatsplit1[0] === "" ? 0 : longlatsplit1[0]) + parseFloat("." + longlatsplit1[1].slice(0,6));
                }
            }
            // cookie.set("longitude", long);
            // cookie.set("latitude", lat);
            // console.log("纬度", lat);
            // console.log("经度", long);
            // this.distance(pageData.latitude,pageData.longitude);
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
            background-color: rgba(0,0,0,0.3);
            height: 80rpx;
            align-items: center;
            justify-content: space-around;
            font-size: 26rpx;
            color:#fff
        }
        .funk{
            background-color: #fff;
            height: 100rpx;
            align-items: center;
            justify-content: space-around;
        }
    }
}
</style>