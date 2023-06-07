import request from '@/utils/request'
// 我的
export function getMineMessage(data) {
    return request({
        url: '/gugux-services-user-api/app/user/base',
        headers: {
            isToken: true
        },
        method: 'get',
        params:data
    })
}