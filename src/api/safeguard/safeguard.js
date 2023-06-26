import request from '@/utils/request'

// 添加紧急联系人
export function emergenccontactadd(data) {
    return request({
      url: '/gugux-services-location-api/app/security/safe/emergency/contact/help/add',
      method: 'post',
      data: data
    })
}
// 通知紧急联系人SOS详情页面
export function emergenccontactinfo(data) {
    return request({
      url: '/gugux-services-location-api/app/security/safe/emergency/contact/notice/sos/info/program',
      method: 'get',
      params: data
    })
}
