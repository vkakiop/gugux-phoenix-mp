import request from '@/utils/request'

// 推送列表
export function opusInfo(data) {
    return request({
      url: '/gugux-services-opus-api/app/opus/details/'+data.id,
      method: 'get',
    })
  }

//获取作品轨迹
export function getOpusTrack(data) {
    return request({
        url: '/gugux-services-location-api/app/location/track/get/opus',
        method: 'post',
        data: data
    })
}
