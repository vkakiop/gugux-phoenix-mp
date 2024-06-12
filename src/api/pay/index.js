export function payWx(data, token) {
    return request({
        url: '//gugux-services-mall-api/app/mall/order/pay/merger',
        headers: {
            Authorization: "Bearer " + token
        },
        method: 'post',
        data: data
    })
}
