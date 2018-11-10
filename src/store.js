import Vue from 'vue';
import Vuex from 'vuex';
import storage from '@/assets/js/storage';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		token: storage.get('token') || '',
		user: {
			nickName: '',
			avatar: '',
			birthday: '',
			intro: '',
			region: '',
			sex: '',
		},
	},
	mutations: {
		setToken(state, val) {
			state.token = val;
		},
		setrUser(state, val) {
			state.user = val;
		},
	},
	actions: {
		token({ commit }, obj) {
			commit('setToken', obj);
		},
		user({ commit }, obj) {
			commit('setrUser', obj);
		},
	},
});
