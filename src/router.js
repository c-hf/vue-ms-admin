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
			path: '/message',
			name: 'message',
			meta: {
				requireAuth: true,
			},
			component: () => import('./views/message'), // 消息中心
		},
		{
			path: '/user',
			name: 'user',
			meta: {
				requireAuth: true,
			},
			component: () => import('./views/user'), // 用户中心
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
			path: '/device',
			name: 'device',
			meta: {
				requireAuth: true,
			},
			component: () => import('./views/device'), // 设备
			children: [
				{
					path: 'control',
					name: 'control',
					component: () => import('./views/control'), // 接入
				},
				{
					path: 'access',
					name: 'access',
					component: () => import('./views/access'), // 新建
				},
			],
		},
	],
});
