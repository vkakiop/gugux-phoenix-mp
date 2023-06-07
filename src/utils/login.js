export function tokenSave(res,returnUrl) {
    const app = getApp()
    if (res.data && res.data.accessToken) {
        app.globalData.loginToken = res.data

        uni.setStorage({
            key: 'ggx_login_token',
            data: JSON.stringify(res.data),
            success: function () {
                let url = returnUrl || '/pages/index/index'
                uni.switchTab({url:url})
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
