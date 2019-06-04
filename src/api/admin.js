import { options, axiosFn } from './config';

// 设备
export const getDevices = () => {
	options.method = 'get';
	options.url = '/api/admin/device';
	return axiosFn(options);
};

// 家庭组
export const getGroup = () => {
	options.method = 'get';
	options.url = '/api/admin/group';
	return axiosFn(options);
};

// 用户
export const getUser = () => {
	options.method = 'get';
	options.url = '/api/admin/user';
	return axiosFn(options);
};

// 设备数量
export const getDevicesNum = () => {
	options.method = 'get';
	options.url = '/api/admin/device/num';
	return axiosFn(options);
};

// 家庭组数量
export const getGroupNum = () => {
	options.method = 'get';
	options.url = '/api/admin/group/num';
	return axiosFn(options);
};

// 用户数量
export const getUserNum = () => {
	options.method = 'get';
	options.url = '/api/admin/user/num';
	return axiosFn(options);
};

// 设备状态
export const getDevicesStatusNum = () => {
	options.method = 'get';
	options.url = '/api/admin/device/status/num';
	return axiosFn(options);
};
