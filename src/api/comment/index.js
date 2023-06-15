import request from '@/utils/request'
// 发表评论
export function opuscomment(data) {
    return request({
        url: '/gugux-services-opus-api/app/opus/comment',
        method: 'post',
        data:data
    })
}
// 评论点赞
export function commentlike(data) {
    return request({
        url: '/gugux-services-opus-api/app/opus/comment/like/'+data.commentId+'/'+data.mainCommentId+'/'+data.action,
        method: 'post',
        data:data
    })
}
// 获取评论
export function commentlist(data) {
    return request({
        url: '/gugux-services-opus-api/app/opus/comment/list/'+data.opusId+'/'+data.lastCommentId+'/'+data.pageSize,
        method: 'get',
        // params:data
    })
}
// 获取子评论
export function subcommentlist(data) {
    return request({
        url: '/gugux-services-opus-api/app/opus/subcomment/list/'+data.commentId+'/'+data.lastCommentId+'/'+data.pageSize,
        method: 'get',
        params:data
    })
}

