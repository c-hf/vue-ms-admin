import { options, axiosFn } from './config';

// 添加分类
export const setDeviceCategoryItem = data => {
	options.method = 'post';
	options.url = '/api/device/setDeviceCategoryItem';
	options.data = data;
	return axiosFn(options);
};
// 添加分类项
export const setDeviceCategory = data => {
	options.method = 'post';
	options.url = '/api/device/setDeviceCategory';
	options.data = data;
	return axiosFn(options);
};
// 添加设备参数
export const setDeviceParam = data => {
	options.method = 'post';
	options.url = '/api/device/setDeviceParam';
	options.data = data;
	return axiosFn(options);
};
// 添加设备属性
export const setDeviceAttr = data => {
	options.method = 'post';
	options.url = '/api/device/setDeviceAttr';
	options.data = data;
	return axiosFn(options);
};
// 添加设备

// 更新分类
export const updateDeviceCategory = data => {
	options.method = 'put';
	options.url = '/api/device/updateDeviceCategory';
	options.data = data;
	return axiosFn(options);
};

// 更新分类项
export const updateDeviceCategoryItem = data => {
	options.method = 'put';
	options.url = '/api/device/updateDeviceCategoryItem';
	options.data = data;
	return axiosFn(options);
};

// 更新设备参数
export const updateDeviceParam = data => {
	options.method = 'put';
	options.url = '/api/device/updateDeviceParam';
	options.data = data;
	return axiosFn(options);
};

// 更新设备属性
export const updateDeviceAttr = data => {
	options.method = 'put';
	options.url = '/api/device/updateDeviceAttr';
	options.data = data;
	return axiosFn(options);
};

// 删除分类
export const deleteDeviceCategory = id => {
	const deleteOptions = {
		method: 'delete',
		url: '/api/device/deleteDeviceCategory',
		params: {
			id: id,
		},
	};

	return axiosFn(deleteOptions);
};

// 删除分类项
export const deleteDeviceCategoryItem = id => {
	const deleteOptions = {
		method: 'delete',
		url: '/api/device/deleteDeviceCategoryItem',
		params: {
			id: id,
		},
	};
	return axiosFn(deleteOptions);
};

// 删除参数
export const deleteDeviceParam = data => {
	const deleteOptions = {
		method: 'delete',
		url: '/api/device/deleteDeviceParam',
		params: {
			categoryItemId: data.categoryItemId,
			id: data.id,
		},
	};

	return axiosFn(deleteOptions);
};

// 删除属性
export const deleteDeviceAttr = data => {
	const deleteOptions = {
		method: 'delete',
		url: '/api/device/deleteDeviceAttr',
		params: {
			categoryItemId: data.categoryItemId,
			id: data.id,
		},
	};

	return axiosFn(deleteOptions);
};
// 获取分类与分类设备信息
export const getDeviceCategoryInfo = () => {
	options.method = 'get';
	options.url = '/api/device/getDeviceCategoryInfo';
	return axiosFn(options);
};

// 获取设备参数
export const getDeviceParam = () => {
	options.method = 'get';
	options.url = '/api/device/getDeviceParam';
	return axiosFn(options);
};

// 获取设备属性
export const getDeviceAttr = () => {
	options.method = 'get';
	options.url = '/api/device/getDeviceAttr';
	return axiosFn(options);
};

// 获取设备 Id
export const getDeviceId = () => {
	options.method = 'get';
	options.url = '/api/device/getDeviceId';
	return axiosFn(options);
};

// 检查唯一性
export const getDeviceUnique = (id, type) => {
	const uniqueOptions = {
		method: 'get',
		url: '/api/device/getDeviceUnique',
		data: null,
		params: {
			id: id,
			type: type,
		},
	};
	return axiosFn(uniqueOptions);
};
