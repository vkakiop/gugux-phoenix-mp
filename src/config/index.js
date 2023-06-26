//内部版本号
export const innserVersion = ()=>{
    return import.meta.env.VITE_APP_INNER_VERSION
}


//配置判断是否SwitchTab
export const switchTabPathes = [
    '/pages/index/index',
    '/pages/mine/mine'
]

//存储token名称
export const configLoginToken = 'ggx_login_token'


//表情图标位置
export const configCommentFaceUrl = ()=>{
    return import.meta.env.VITE_APP_STATIC_URL + '/static/comment/facesnew/'
}
