import request from '@/utils/request'
// 搜索
export const opusSearchNew = (data) => {
	return request({
		url: '/gugux-services-opus-api/app/opus/search/new',
		method: 'post',
        headers: {
            isToken: true
        },
		data: data
	})
}
// 搜索文章
export const opusSearchArticle = (data) => {
	return request({
		url: '/gugux-services-opus-api/app/opus/search/article',
		method: 'post',
        headers: {
            isToken: true
        },
		data: data
	})
}
// 搜索视频
export const opusSearchVideo = (data) => {
	return request({
		url: '/gugux-services-opus-api/app/opus/search/video',
		method: 'post',
        headers: {
            isToken: true
        },
		data: data
	})
}