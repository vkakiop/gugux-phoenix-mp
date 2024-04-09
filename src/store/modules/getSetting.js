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
            }
        },
        getters: {
            getGetSetting() {
                return ()=> this.getSetting || {}
            }
        }
    })
export default useGetSettingStore