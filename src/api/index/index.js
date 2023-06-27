import request from '@/utils/request'

// 首页导航条
export function frontpage(data) {
    return request({
      url: '/gugux-services-opus-api/app/front/page',
      params:data,
      method: 'get'
    })
  }