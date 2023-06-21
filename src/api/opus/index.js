import request from '@/utils/request'

// 推送列表
export function opusInfo(data) {
    return request({
      url: '/gugux-services-opus-api/app/opus/rec/details',
      params:data,
      method: 'get'
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

//作品收藏
export function opusCollect(data) {
    return request({
        url: '/gugux-services-opus-api/app/opus/collect/'+data.opusId+'/'+data.action,
        method: 'post',
    })
}

//作品点赞
export function opusLike(data) {
    return request({
        url: '/gugux-services-opus-api/app/opus/like/'+data.opusId+'/'+data.action,
        method: 'post'
    })
}

//关注
export function userFans(data) {
    return request({
        url: '/gugux-services-user-api/app/user/fans/focus',
        method: 'post',
        params: data
    })
}

//取消关注
export function userFansRemove(data) {
    return request({
        url: '/gugux-services-user-api/app/user/fans/unsubscribe',
        method: 'post',
        params: data
    })
}
