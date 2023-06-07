<template>
  <view>
    <view class="relative p-10  mb-10 bg-blue-500">
      <navigator url="/pages/index/searchHistory" hover-class="navigator-hover">
        <icon type="search" size="26" class="absolute right-0" />
      </navigator>
    </view>
    <view>
      <view class="uni-common-mt">
        <view>推荐</view>
        <view class="segmentSty">
          <uni-segmented-control :current="current" :values="items" style-type="text" active-color="#dd524d"
            @clickItem="onClickItem" />
        </view>
        <view class="flex items-center">更多
          <uni-icons type="bottom" size="26" @click="drowDown('top')" v-if="iconType == 'bottom'"></uni-icons>
          <uni-icons type="top" size="26" @click="drowDown('bottom')" v-else></uni-icons>
        </view>
      </view>
    </view>
    <view class="gridBox" v-if="iconType == 'top'">
      <uni-grid :column="3" :show-border="false" :square="false" @change="change" class="girdItem">
        <uni-grid-item v-for="(item, index) in list" :index="index" :key="index">
          <view class="grid-item-box">
            <text class="text">{{ item.text }}</text>
          </view>
        </uni-grid-item>
      </uni-grid>
    </view>
    <view> <waterFall></waterFall></view>

  </view>
</template>

<script setup>
import waterFall from "@/components/index/waterfall.vue"
import { ref, onMounted, reactive } from 'vue'
import { onShow } from "@dcloudio/uni-app"
const loginToken = ref({})
const iconType = ref('bottom')
const items = ref(['选项1', '选项2', '选项3', '选项1', '选项2', '选项3'])
const current = ref(0)
const list = reactive([{
  text: 'Grid 1',
  badge: '0',
  type: "primary"
},
{

  text: 'Grid 2',
  badge: '1',
  type: "success"
},
{

  text: 'Grid 3',
  badge: '99',
  type: "warning"
},
{

  text: 'Grid 4',
  badge: '2',
  type: "error"
},
{

  text: 'Grid 5'
},
{

  text: 'Grid 6'
},
{

  text: 'Grid 7'
}
])

function onClickItem(e) {
  if (current.value !== e.currentIndex) {
    console.log(e.currentIndex);
    current.value = e.currentIndex
  }
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
  list[index].badge && list[index].badge++

  uni.showToast({
    title: `点击第${index + 1}个宫格`,
    icon: 'none'
  })
}
//二维码
const options = ref({
  code: '这是你生成二维码的值', // 生成二维码的值
  size: 460, // 460代表生成的二维码的宽高均为460rpx
  img: { // 二维码log配置 非必传
    src: '/static/logo.png', // 图片地址
    size: 60, // 图片大小
    degree: 15, // 圆角大小 如果type为round生效
    type: 'round', //图片展示类型 默认none 可选值  round圆角  circle圆 如果为round 可以传入degree设置圆角大小 默认 5
    color: '#ffffff', //图片周围的白色边框
    width: 8 //图片周围白色边框的宽度 默认5
  },
})
</script>

<style lang="scss" scoped>
.uni-common-mt {
  margin-top: 20px;
  // padding: 0px 10px;
  display: flex;
  align-items: center;
  font-size: 12px;
  justify-content: space-around;

  .segmentSty {
    flex: 2;
  }
}


.content {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
  height: 150px;
  text-align: center;
}

.gridBox {
  border: 1px solid #838383;
  width: 96vw;
  position: absolute;
  top: 24vw;
  left: 2vw;
  z-index: 999;

  .grid-item-box {
    margin: 5px;
    flex: 1;
    background-color: aqua;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px 0;
  }
}

.text {
  border: 1px solid black;
  border-radius: 8px;
  padding: 14px;
  font-size: 14px;
  margin-top: 5px;
}

.content-text {
  font-size: 14px;
  color: #666;
}
</style>


