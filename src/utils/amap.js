import {AMapWX} from '@/utils/amap-wx.js'
let amapKey = 'd74accc2c7f1186243982b816996f8b0'

export function getAddress(lng,lat) {
    return new Promise((resolve, reject) => {
        let amap = new AMapWX({
            key: amapKey
        })
        amap.getRegeo({
            location: `${lng},${lat}`,
            success:(res)=>{
                resolve(res && res.length && res[0].regeocodeData ? res[0].regeocodeData.formatted_address : '未知位置')
            },
            fail:(res)=>{
                reject('未知位置')
            }
        })
    })
}