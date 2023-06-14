import { createSSRApp } from "vue"
import uviewPlus from 'uview-plus'
import store from './store'
import App from "./App.vue"
export function createApp() {
	const app = createSSRApp(App);
	app.use(uviewPlus)
	app.use(store)
	return {
		app,
	};
}
