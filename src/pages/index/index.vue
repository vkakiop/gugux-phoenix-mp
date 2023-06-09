<template>
  <view>
    <view class="relative p-10  mb-10 ">
      <icon type="search" size="26" class="absolute right-0" @click="skipHistory" />
    </view>
    <view>
      <view class="uni-common-mt">
        <view style="flex:2">
          <u-tabs :list="menuList" lineWidth="40" lineColor="#f56c6c" :activeStyle="{
            color: '#303133',
            fontWeight: 'bold',
            transform: 'scale(1.05)'
          }" :inactiveStyle="{
  color: '#606266',
  transform: 'scale(1)'
}" itemStyle="padding-left: 15rpx; padding-right: 15rpx; height: 66rpx;" @click="menuClick">
          </u-tabs>
        </view>
        <view class="flex items-center">更多
          <uni-icons type="bottom" size="26" @click="drowDown('top')" v-if="iconType == 'bottom'"></uni-icons>
          <uni-icons type="top" size="26" @click="drowDown('bottom')" v-else></uni-icons>
        </view>
      </view>
    </view>
    <view class="gridBox" v-if="iconType == 'top'">
      <uni-grid :column="3" :show-border="false" :square="false" @change="change">
        <uni-grid-item v-for="(item, index) in list" :index="index" :key="index">
          <view class="grid-item-box  ">
            <text class="text">{{ item.text }}</text>
          </view>
        </uni-grid-item>
      </uni-grid>
    </view>
    <view>
      <waterFall></waterFall>
    </view>
    <u-modal :show="show" @confirm="confirmShow" @cancel="closeShow" title="紧急通知" confirmColor="#D9001B"
      cancelColor="#0000FF" showCancelButton ref="uModal" confirmText="去导航" cancelText="查看详情">
      <view class="slot-content">
        <rich-text :nodes="content"></rich-text>
      </view>
    </u-modal>

  </view>
</template>

<script setup>
import waterFall from "@/components/index/waterfall.vue"
import { ref, onMounted, reactive } from 'vue'
import { onShow } from "@dcloudio/uni-app"
const loginToken = ref({})
const iconType = ref('bottom')
const menuList = reactive([{
  name: '推荐',
}, {
  name: '文章',
}, {
  name: '视频'
},
{
  name: '游记'
},
{
  name: '车友圈'
},
{
  name: '逛吃'
}
])
const list = reactive([{
  text: '推荐',
  badge: '0',
  type: "primary"
},
{

  text: '游记',
},
{

  text: '用车',
},
{

  text: '视频',
},
{

  text: '车友群'
},
{

  text: '逛吃'
},
{

  text: '溪流'
}
])

const show = ref(true);
const content = ref('');
content.value = '您的好友等第十三月(1511837394)在重庆市四川商会触发了紧急通知，请点击电话联系或导航前往。'
const confirmShow = () => {
  show.value = false;
  console.log('去导航');
  uni.navigateTo({ url: '/pages/emergencycontact/index?id=' + encodeURIComponent(13333333333) })
  // uni.navigateTo({ url: '/pages/safeguard/gonavigation?id=' + encodeURIComponent(123) })
}
const closeShow = () => {
  show.value = false;
  console.log('查看详情');
  uni.navigateTo({ url: '/pages/safeguard/safeguarddetail?id=' + encodeURIComponent(123) })
}


function onClickItem(e) {
  if (current.value !== e.currentIndex) {
    console.log(e.currentIndex);
    current.value = e.currentIndex
  }
}
function menuClick(item) {
  console.log('item', item);
}
onShow(() => {
  loginToken.value = getApp().globalData.loginToken
})
function drowDown(item) {
  iconType.value = item
  console.log('点击了下拉');
}
function change(e) {
  let {
    index
  } = e.detail
  uni.showToast({
    title: `点击第${index + 1}个宫格`,
    icon: 'none'
  })
}
function skipHistory() {
  uni.navigateTo({
    url: `/pages/index/searchHistory`
  })
}

</script>

<style lang="scss" scoped>
.uni-common-mt {
  margin-top: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.gridBox {
  border: 1px solid #838383;
  background-color: white;
  width: 100vw;
  position: absolute;
  top: 24vw;
  z-index: 999;

  .grid-item-box {
    padding: 20rpx 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .text {
      border: 1px solid blue;
      display: inline;
      width: 100rpx;
      text-align: center;
      border-radius: 8px;
      padding: 14px;
    }

  }
}
</style>


