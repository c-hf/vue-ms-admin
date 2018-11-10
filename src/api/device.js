import { options, axiosFn } from './config';

export const getDeviceCategoryInfo = () => {
	options.method = 'get';
	options.url = '/api/device/getDeviceCategoryInfo';
	return axiosFn(options);
};

export const getDeviceId = () => {
	options.method = 'get';
	options.url = '/api/device/getDeviceId';
	return axiosFn(options);
};
