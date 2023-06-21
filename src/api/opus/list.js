import request from '@/utils/request'

// 作品列表
export function opusList(data) {
    return request({
        url: `/gugux-services-opus-api/app/opus/list/rec`,
        method: 'get',
        params: data,
        headers: {
            isToken: true
        },
    })
}

