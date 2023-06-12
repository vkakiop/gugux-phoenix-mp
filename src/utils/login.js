import {switchTabPathes,configLoginToken} from '@/config/index'
export function tokenSave(res,returnUrl) {
    const app = getApp()
    if (res.data && res.data.accessToken) {
        app.globalData.loginToken = res.data

        uni.setStorage({
            key: configLoginToken,
            data: JSON.stringify(res.data),
            success: function () {
                let url = returnUrl || '/pages/index/index'
                if (returnUrl) {
                    let isSwitch = isSwitchTab(url)
                    if (isSwitch) {
                        uni.switchTab({url:url})
                    }
                    else {
                        uni.navigateTo({url:url})
                    }
                }
                else {
                    uni.navigateBack({delta: 1})
                }
            }
        });
    }
    else {
        uni.showToast({
            title: 'token获取错误！',
            icon:'none',
            duration: 2000
        });
        setTimeout(()=>{
            uni.navigateBack({delta: 1})
        },2000)
    }
}

export function isSwitchTab(path) {
    let isSwitch = false
    if (path) {
        switchTabPathes.forEach(item=>{
            if (item.indexOf(path) != -1) {
                isSwitch = true
            }
        })
    }
    return isSwitch
}
