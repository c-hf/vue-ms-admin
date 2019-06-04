import Vue from 'vue';
import Router from 'vue-router';
// import store from './store';
import Home from './views/home';
import index from './views/index';

Vue.use(Router);

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		// index
		{
			path: '/',
			name: 'index',
			component: index,
			children: [
				// 主页
				{
					path: '/home',
					name: 'home',
					meta: {
						requireAuth: true,
					},
					component: Home,
				},
				// 家庭组
				{
					path: '/family',
					name: 'family',
					meta: {
						requireAuth: true,
					},
					component: () => import('./views/family'), // 用户模块
				},
				// 用户
				{
					path: '/user',
					name: 'user',
					meta: {
						requireAuth: true,
					},
					component: () => import('./views/user'), // 用户模块
				},
				// 设备
				{
					path: '/device/overview',
					name: 'device',
					meta: {
						requireAuth: true,
					},
					component: () => import('./views/device'),
				},
				// 分类
				{
					path: 'device/classify',
					name: 'classify',
					meta: {
						requireAuth: true,
					},
					component: () => import('./views/classify'),
					children: [],
				},
				// 详情
				{
					path: 'device/details/:categoryItemId',
					name: 'details',
					meta: {
						requireAuth: true,
					},
					component: () => import('./views/details'),
				},
				// 设置
				{
					path: '/set',
					name: 'set',
					meta: {
						requireAuth: true,
					},
					component: () => import('./views/set'),
				},
			],
		},

		// 登录,
		{
			path: '/sign',
			name: 'sign',
			component: () => import('./views/sign'),
		},
	],
	// scrollBehavior(to, from, savedPosition) {
	// 	return { x: 0, y: 0 };
	// },
});
