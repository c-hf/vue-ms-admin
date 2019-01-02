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
				// 用户模块
				{
					path: '/user',
					name: 'user',
					meta: {
						requireAuth: true,
					},
					component: () => import('./views/user'), // 用户模块
				},
				// 设备模块
				{
					path: '/device',
					name: 'device',
					meta: {
						requireAuth: true,
					},
					beforeEnter: (to, from, next) => {
						if (to.fullPath === '/device') {
							next({
								path: '/device/overview',
							});
						} else {
							next();
						}
					},
					component: () => import('./views/device'),
					children: [
						{
							path: 'overview',
							name: 'overview',
							meta: {
								requireAuth: true,
							},
							component: () => import('./views/overview'),
						},
						// 分类
						{
							path: 'classify',
							name: 'classify',
							meta: {
								requireAuth: true,
							},
							component: () => import('./views/classify'),
							children: [],
						},
						// 详情
						{
							path: 'details/:categoryItemId',
							name: 'details',
							meta: {
								requireAuth: true,
							},
							component: () => import('./views/details'),
						},
					],
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
				// 消息中心
				{
					path: '/message',
					name: 'message',
					meta: {
						requireAuth: true,
					},
					component: () => import('./views/message'),
				},
			],
		},

		// 登录与注册,
		{
			path: '/sign',
			name: 'sign',
			component: () => import('./views/sign'),
		},

		// 个人信息完善
		{
			path: '/information',
			name: 'information',
			meta: {
				requireAuth: true,
			},
			component: () => import('./views/information'),
		},
	],
	// scrollBehavior(to, from, savedPosition) {
	// 	return { x: 0, y: 0 };
	// },
});
