import { createSSRApp } from "vue"
import uviewPlus from 'uview-plus'
import store from './store'
import App from "./App.vue"



// import safeguard from './components/common/safeguard.vue'
export function createApp() {
	const app = createSSRApp(App);
	// app.component('safe-guard', safeguard)
	app.use(uviewPlus)
	app.use(store)
	return {
		app,
	};
}
