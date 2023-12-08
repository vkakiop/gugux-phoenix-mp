import {createPinia,defineStore} from "pinia"
const useBlekeyStore = defineStore(
    'blekey',
    {
        state: () => ({
            blekeyIndexData:{}
        }),
        actions: {
            // 添加一项数据
            setBlekeyIndexData(data) {
                this.blekeyIndexData = data || {}
            }
        },
        getters: {
            getBlekeyIndexData() {
                return ()=> this.blekeyIndexData || {}
            }
        }
    })
export default useBlekeyStore