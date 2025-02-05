import request from '@/utils/request'

//抽奖
export function redbagInfo(data) {
    return request({
        url: '/gugux-services-activity-api/app/moyu/draw/plus',
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
//中奖信息
export function amountBag(data) {
    return request({
        url: '/gugux-services-activity-api/app/moyu/amount',
        method: 'get',
        params:data
    })
}
//用户中奖列表
export function awardBag(data) {
    return request({
        url: '/gugux-services-activity-api/app/moyu/award',
        method: 'get',
        params:data
    })
}

