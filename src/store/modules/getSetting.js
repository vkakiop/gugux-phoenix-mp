import {createPinia,defineStore} from "pinia"
const useGetSettingStore = defineStore(
    'getSetting',
    {
        state: () => ({
            getSetting:{}
        }),
        actions: {
            // 添加一项数据
            setGetSetting(data) {
                this.getSetting = {...this.getSetting,...data}
                uni.setStorageSync('store_getSetting',JSON.stringify(this.getSetting))
            }
        },
        getters: {
            getGetSetting() {
                return ()=> {
                    //this.getSetting || {}
                    let storageValue = uni.getStorageSync('store_getSetting')
                    let obj = {}
                    if (storageValue) {
                        obj = JSON.parse(storageValue) || {}
                    }
                    return obj
                }
            }
        }
    })
export default useGetSettingStore