import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/home';

Vue.use(Router);

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			meta: {
				requireAuth: true,
			},
			component: Home,
		},
		{
			path: '/sign',
			name: 'sign',
			component: () => import('./views/sign'), // 登录与注册,
		},
		{
			path: '/user',
			name: 'user',
			meta: {
				requireAuth: true,
			},
			component: () => import('./views/user'), // 用户模块
		},
		{
			path: '/device',
			name: 'device',
			meta: {
				requireAuth: true,
			},
			component: () => import('./views/device'), // 设备模块
			children: [
				{
					path: 'classify',
					name: 'classify',
					component: () => import('./views/classify'), // 分类
				},
				{
					path: 'param',
					name: 'param',
					component: () => import('./views/param'), // 参数
				},
				{
					path: 'attr',
					name: 'attr',
					component: () => import('./views/attr'), // 属性
				},
			],
		},
		{
			path: '/set',
			name: 'set',
			meta: {
				requireAuth: true,
			},
			component: () => import('./views/set'), // 设置
		},
		{
			path: '/message',
			name: 'message',
			meta: {
				requireAuth: true,
			},
			component: () => import('./views/message'), // 消息中心
		},
	],
});
