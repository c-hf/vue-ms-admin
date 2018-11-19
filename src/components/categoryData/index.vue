<template>
    <el-form :model="deviceData"
             label-position="left"
             label-width="100px">
        <el-form-item label="分类设备">
            <el-cascader :options="options"
                         :show-all-levels="true"
                         v-model="deviceData.id"
                         @change="change"></el-cascader>
        </el-form-item>
    </el-form>
</template>

<script>
import { getDeviceCategoryInfo } from '@/api/device';

import storage from '@/assets/js/storage';
import deviceOperation from '@/assets/js/deviceOperation';

import {
	DEVICE_DATA_KEY,
	CATEGORY_CONTENT_UPDATE_TIME_INTERVAL,
} from './config.js';

export default {
	name: 'CategoryData',
	data() {
		return {
			options: [],
		};
	},
	methods: {
		// 获取设备分类
		getInfo() {
			this.$emit('setLoading', true);
			let [id, deviceContents = {}, updateTime] = [
				storage.get('id'),
				storage.get(DEVICE_DATA_KEY),
				0,
			];

			const curTime = new Date().getTime(); // 获取当前时间

			if (deviceContents && deviceContents[id]) {
				updateTime = deviceContents[id].updateTime;

				if (
					curTime - updateTime <=
					CATEGORY_CONTENT_UPDATE_TIME_INTERVAL
				) {
					// localstorage
					this.options = deviceOperation.setOptions(
						deviceContents[id].data
					);
					this.$emit('setLoading', false);
				} else {
					// HTTP
					this.getInfoByHttp(id, deviceContents, curTime);
				}
			} else {
				// HTTP
				this.getInfoByHttp(id, deviceContents, curTime);
			}
		},

		// http获取设备分类
		getInfoByHttp(id, contents, updateTime) {
			getDeviceCategoryInfo()
				.then(resData => {
					if (resData !== 'ok') {
						deviceOperation.updateLocalStorage({
							id: id,
							data: resData,
							contents: contents,
							curTime: updateTime,
							key: DEVICE_DATA_KEY,
						});
						this.options = deviceOperation.setOptions(resData);
						this.$emit('setLoading', false);
					}
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
					this.$emit('setLoading', false);
				});
		},

		// 选择
		change() {
			this.$emit('change', this.deviceData.id);
		},
	},
	props: {
		deviceData: {
			type: Object,
		},
	},
	created() {
		this.getInfo();
	},
};
</script>

<style lang="scss" scoped>
</style>
