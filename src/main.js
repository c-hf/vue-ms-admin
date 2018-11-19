import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import 'font-awesome/css/font-awesome.min.css';
import './assets/scss/index.scss';

import storage from '@/assets/js/storage';

Vue.config.productionTip = false;

Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
	if (to.meta.requireAuth) {
		if (!store.state.token) {
			next({
				path: '/sign',
			});
		} else {
			next();
		}
	} else {
		next();
	}
});
// router.beforeResolve((to, from, next) => {
// 	console.log('beforeResolve');
// 	next();
// });
// router.afterEach((to, from) => {
// 	console.log('afterEach');
// 	console.log(from);
// });

// http request 拦截器
axios.interceptors.request.use(
	function(config) {
		if (store.state.token) {
			config.headers.Authorization = `Bearer ${store.state.token}`;
		}
		return config;
	},
	function(error) {
		return Promise.reject(error);
	}
);

// http response 拦截器
axios.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		if (error.response.status === 401) {
			storage.remove('token');
			store.dispatch('token', '');
			router.replace({
				name: 'sign',
			});
			return Promise.reject({
				message: '授权已过期，请重新登录',
			});
		}
		return Promise.reject(error);
	}
);

// axios 全局默认设置
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] = 'application/json';

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
