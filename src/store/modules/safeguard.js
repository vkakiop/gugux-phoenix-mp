import {createPinia,defineStore} from "pinia"
const useSafeguardStore = defineStore(
    'safeguard',
    {
        state: () => ({
            safeguard:false,
            safeguardconfirm:false,
        }),
        actions: {
            // 添加一项数据
            set(data) {
                this.safeguard = data 
            },
            setconfirm(data){
                this.safeguardconfirm = data
            }
        },
        getters: {
            get() {
                return ()=> this.safeguard 
            },
            getconfirm() {
                return ()=> this.safeguardconfirm 
            }
        }
    })
export default useSafeguardStore
