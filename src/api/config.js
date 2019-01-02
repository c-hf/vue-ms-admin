import axios from 'axios';

// 超时时间 10000ms -> 10s
export const TIMEOUT = 10000;

export let options = {
	method: 'post', //方法
	url: '', //地址
	data: null,
	timeout: TIMEOUT,
};

export const axiosFn = options => {
	return axios(options).then(response => {
		if (!response.data.code) {
			return response.data.response;
		}
		throw new Error(response.data.message);
	});
};
