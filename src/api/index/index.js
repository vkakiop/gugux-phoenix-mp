import request from '@/utils/request'

// 首页导航条
export function frontpage(data) {
    return request({
      url: '/gugux-services-opus-api/app/front/page',
      params: data,
      method: 'get'
    })
  }

// 获取审核状态
export function globalStatus(data) {
    return request({
        url: '/gugux-services-activity-api/app/moyu/status',
        params: data,
        method: 'get'
    })
}
