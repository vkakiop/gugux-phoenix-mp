<template>
  <view class="u-page" style="border:1px solid red; height:50%">
    <u-list
        @scrolltolower="scrolltolower"
    >
      <view
          v-for="(item, index) in indexList"
          :key="index"
      >
        <view class="h-50">
          列表长度-{{index + 1}}
        </view>
      </view>
    </u-list>
  </view>
</template>

<script>
export default {
  data() {
    return {
      indexList: [],
      urls: [
        'https://cdn.uviewui.com/uview/album/1.jpg',
        'https://cdn.uviewui.com/uview/album/2.jpg',
        'https://cdn.uviewui.com/uview/album/3.jpg',
        'https://cdn.uviewui.com/uview/album/4.jpg',
        'https://cdn.uviewui.com/uview/album/5.jpg',
        'https://cdn.uviewui.com/uview/album/6.jpg',
        'https://cdn.uviewui.com/uview/album/7.jpg',
        'https://cdn.uviewui.com/uview/album/8.jpg',
        'https://cdn.uviewui.com/uview/album/9.jpg',
        'https://cdn.uviewui.com/uview/album/10.jpg',
      ]
    }
  },
  onLoad() {
    this.loadmore()
  },
  methods: {
    scrolltolower() {
      this.loadmore()
    },
    loadmore() {
      console.log('loadmore')
      for (let i = 0; i < 30; i++) {
        this.indexList.push({
          url: this.urls[uni.$u.random(0, this.urls.length - 1)]
        })
      }
    }
  },
}
</script>