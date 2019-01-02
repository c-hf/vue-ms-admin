import Vue from 'vue';
import Vuex from 'vuex';

import storage from '@/assets/js/storage';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		token: storage.get('token') || '',
		user: {},
		category: [],
	},
	mutations: {
		// 设置 token
		setToken(state, val) {
			state.token = val;
		},

		// 设置账号信息
		setrUser(state, val) {
			state.user = val;
		},

		setCategory(state, val) {
			state.category = val;
		},

		addCategory(state, val) {
			state.category.push(val);
		},

		// 更新
		updateCategory(state, val) {
			const index = state.category.findIndex(value => {
				return value.categoryId === val.categoryId;
			});
			state.category.splice(index, 1, val);
		},
	},
	actions: {
		token({ commit }, obj) {
			commit('setToken', obj);
		},
		user({ commit }, obj) {
			commit('setrUser', obj);
		},
		category({ commit }, obj) {
			commit('setCategory', obj);
		},
		addCategory({ commit }, obj) {
			commit('addCategory', obj);
		},
		updateCategory({ commit }, obj) {
			commit('updateCategory', obj);
		},
	},
});
