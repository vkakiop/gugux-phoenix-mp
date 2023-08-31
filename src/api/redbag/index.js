import request from '@/utils/request'

//抽奖
export function redbagInfo(data) {
    return request({
        url: '/gugux-services-activity-api/app/moyu/draw',
        method: 'get',
        params:data
    })
}

//扫码-关注公众号-获得次数
export function redbagAdd(data) {
    return request({
        url: '/gugux-services-activity-api/app/moyu/acquire',
        method: 'get',
        params:data
    })
}


//活动中奖用户
export function getwinning(data) {
    return request({
        url: '/gugux-services-activity-api/app/moyu/winning',
        method: 'get',
        params:data
    })
}

