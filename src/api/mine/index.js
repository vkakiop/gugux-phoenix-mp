import request from '@/utils/request'
// 我的
export function getUserBase(data) {
    return request({
        url: '/gugux-services-user-api/app/user/base',
        method: 'get',
        params:data
    })
}
// 个人信息
export function getUserInfo(data) {
    return request({
        url: '/gugux-services-user-api/app/user/info',
        method: 'get',
        params:data
    })
}
