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
export function getUserInfo(data,header) {
    return request({
        url: '/gugux-services-user-api/app/user/info',
        method: 'get',
        params:data,
        headers:header,
    })
}
// 用户主页个人信息
export function userhomepage(data,header) {
    return request({
        url: '/gugux-services-user-api/app/user/homepage',
        method: 'get',
        params:data,
        headers:header,
    })
}
// 用户主页作品列表
export function homepageopus(data,header) {
    return request({
        url: '/gugux-services-opus-api/app/opus/homepage/opus',
        method: 'get',
        params:data,
        headers:header,
    })
}
// 用户主页点赞作品列表
export function homepagelike(data,header) {
    return request({
        url: '/gugux-services-opus-api/app/opus/homepage/like',
        method: 'get',
        params:data,
        headers:header,
    })
}
// 用户主页收藏
export function homepagecollection(data,header) {
    return request({
        url: '/gugux-services-opus-api/app/opus/homepage/collection',
        method: 'get',
        params:data,
        headers:header,
    })
}