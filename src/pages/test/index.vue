<template>
  <view>index</view>
  <testinfo></testinfo>
  <button open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
    修改头像
  </button>
  {{pageData.avatarUrl}}
  <image :src="pageData.avatarUrl"/>


  <input v-model="pageData.name" type="nickname" class="nick-name-input" placeholder="请输入昵称" 	@blur="changeNickName"/>
</template>

<script setup>
import {onMounted,reactive} from 'vue'
import {getTokenValue} from '@/utils/utils'
import testinfo from './components/testinfo.vue'
onMounted(()=>{
  // uni.showToast({
  //   title: 'mount1',
  //   icon:'none',
  //   duration: 2000
  // });
})

const pageData = reactive({
  avatarUrl:'',
  name:''
})

const onChooseAvatar = (e)=>{
  console.log('获取头像：',e)
  pageData.avatarUrl = e.detail.avatarUrl

  let baseUrl = import.meta.env.VITE_APP_BASE_API
  let token = getTokenValue()
  uni.uploadFile({
    url: baseUrl + '/gugux-services-poly-api/app/file/upload',
    filePath: pageData.avatarUrl,
    name: 'file',
    formData: {},
    header: {
      token:token
    },
    success: (res) => {
      if (res.data.status == 1) {
        console.log(res.data)
      }
      else {
        console.log('上传错误');
      }

    }
  });
}

const changeNickName = ()=>{
  let name = e.detail.value;
  if(name.length === 0) return;

  pageData.name =  name
}
</script>

<style lang="scss" scoped>

</style>
