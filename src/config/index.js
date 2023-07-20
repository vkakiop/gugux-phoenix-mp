//内部版本号
export const innerVersion = ()=>{
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
export const configStaticPath = (path)=>{
    return import.meta.env.VITE_APP_STATIC_URL + path + '?innerVersion='+innerVersion()
}

//表情图标位置
export const configCommentFaceUrl = ()=>{
    return import.meta.env.VITE_APP_STATIC_URL + '/static/comment/facesnew/'
}

// 默认header参数
export const configHeadersDefault = ()=>{
    return {
        d_versioncode : '1.0.0',
        d_versionname : '1.0.0',
        d_platform : 'xcx',
        d_deviceid : '',
    }
}
