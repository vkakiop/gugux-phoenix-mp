import request from '@/utils/request'

// 作品列表
export function opusList(path,data) {
    return request({
        url: `/gugux-services-opus-api/app/opus/list/${path.category}/${path.pageNum}/${path.pageSize}`,
        method: 'get',
        params: data
    })
}

