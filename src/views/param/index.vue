<template>
    <div class="param">
        <el-card class="param-card"
                 v-loading="loading">
            <div slot="header"
                 class="clearfix">
                <span>设备参数</span>
            </div>
            <el-col :span="8">
                <el-card shadow="never"
                         class="param-data-card">
                    <category-data :deviceData="deviceData"
                                   @change="setDeviceParam"
                                   @setLoading="setLoading" />
                </el-card>
                <el-card shadow="never"
                         class="param-data-card">
                    分类
                </el-card>
                <el-card shadow="never"
                         class="param-data-card">
                    分类设备
                </el-card>
                <el-card shadow="never"
                         class="param-data-card">
                    当前设备参数
                </el-card>
            </el-col>
            <el-col :span="15"
                    :offset="1">
                <device-table :device="deviceParam"
                              :tableData="tableData"
                              addDataBtn="添加参数"
                              @compileData="compileData"
                              @addData="addData"
                              @deleteData="deleteData" />
            </el-col>
        </el-card>
        <device-dialog :dialogTitle="dialogTitle"
                       :dialogMethod="dialogMethod"
                       :dialogMsg="dialogMsg"
                       :dialogData="dialogData"
                       :dialogVisible="dialogVisible"
                       :methods="methods"
                       :storageKey="storageKey"
                       @getDataByHttp="getParamByHttp"
                       @setDialogInit="setDialogInit"
                       @setDialogVisible="setDialogVisible"
                       @setLoading="setLoading" />
    </div>
</template>

<script>
import {
	DATANAME,
	TABLEDATA,
	DEVICEPARAM_DATA_KEY,
	CATEGORY_CONTENT_UPDATE_TIME_INTERVAL,
} from './config.js';

import {
	setDeviceParam,
	getDeviceParam,
	updateDeviceParam,
	deleteDeviceParam,
} from '@/api/device';

import storage from '@/assets/js/storage';
import deviceOperation from '@/assets/js/deviceOperation';

import DeviceTable from '@/components/deviceTable';
import CategoryData from '@/components/categoryData';
import DeviceDialog from '@/components/deviceDialog';

export default {
	name: 'DeviceParam', // 设备参数
	data() {
		return {
			loading: false,
			dataName: DATANAME,
			tableData: TABLEDATA,
			methods: {
				setDeviceParam: setDeviceParam,
				updateDeviceParam: updateDeviceParam,
			},
			paramAggregate: [],
			deviceParam: { categoryItemId: '', data: [] },
			deviceData: {
				id: ['power', 'socket'],
			},
			storageKey: DEVICEPARAM_DATA_KEY,
			dialogData: { dialogFormItems: [] },
			dialogVisible: false,
			dialogMethod: '',
			dialogTitle: '',
			dialogMsg: '',
		};
	},
	methods: {
		// 获取设备参数
		getParam() {
			this.loading = true;
			let [id, paramContents = {}, updateTime] = [
				storage.get('id'),
				storage.get(DEVICEPARAM_DATA_KEY),
				0,
			];

			const curTime = new Date().getTime(); // 获取当前时间

			if (paramContents && paramContents[id]) {
				updateTime = paramContents[id].updateTime;

				if (
					curTime - updateTime <=
					CATEGORY_CONTENT_UPDATE_TIME_INTERVAL
				) {
					// localstorage
					this.paramAggregate = paramContents[id].data;
					this.setDeviceParam(this.deviceData.id);
					this.loading = false;
				} else {
					// HTTP
					this.getParamByHttp(id, paramContents, curTime);
				}
			} else {
				// HTTP
				this.getParamByHttp(id, paramContents, curTime);
			}
		},

		// http获取设备参数
		getParamByHttp(id, contents, updateTime) {
			getDeviceParam()
				.then(resData => {
					if (resData !== 'ok') {
						deviceOperation.updateLocalStorage({
							id: id,
							data: resData,
							contents: contents,
							curTime: updateTime,
							key: DEVICEPARAM_DATA_KEY,
						});
						this.paramAggregate = resData;
						this.setDeviceParam(this.deviceData.id);
						this.loading = false;
					}
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
					this.loading = false;
				});
		},

		// 选择
		setDeviceParam(id) {
			this.paramAggregate.forEach(el => {
				if (el.categoryItemId === id[1]) {
					this.deviceParam.categoryItemId = el.categoryItemId;
					this.deviceParam.data = el.param;
				}
			});
		},

		// 编辑
		compileData(data, categoryItemId) {
			this.dialogData = deviceOperation.setDialogItems(
				{
					categoryItemId: categoryItemId,
					id: data.id,
					name: data.name,
					value: data.value,
					unit: data.unit,
				},
				this.dataName
			);
			this.dialogData.dialogFormItems[1].disable = true;
			this.dialogMethod = 'updateDeviceParam';
			this.dialogMsg = '修改成功！';
			this.dialogTitle = '修改';
			this.dialogVisible = true;
		},

		// 添加
		addData() {
			this.dialogData = deviceOperation.setDialogItems(
				{
					categoryItemId: this.deviceData.id[1],
					id: '',
					name: '',
					value: '',
					unit: '',
				},
				this.dataName
			);
			this.dialogMethod = 'setDeviceParam';
			this.dialogMsg = '添加成功！';
			this.dialogTitle = '添加';
			this.dialogVisible = true;
		},

		// 删除
		deleteData(data) {
			this.loading = true;
			deleteDeviceParam(data)
				.then(() => {
					this.$message({
						showClose: true,
						center: true,
						message: '删除成功！',
						type: 'success',
					});
					const [contents = {}, id, curTime] = [
						storage.get(this.storageKey),
						storage.get('id'),
						new Date().getTime(),
					];
					this.getParamByHttp(id, contents, curTime);
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
					this.loading = false;
				});
		},

		// dialog初始化
		setDialogInit() {
			this.dialogVisible = false;
			this.dialogMsg = '';
			this.dialogMethod = '';
		},

		// 设置 DialogVisible
		setDialogVisible(value) {
			this.dialogVisible = value;
		},

		// loading
		setLoading(load) {
			this.loading = load;
		},
	},
	components: {
		CategoryData,
		DeviceTable,
		DeviceDialog,
	},
	created() {
		this.getParam();
	},
};
</script>

<style lang="scss" scoped>
.param {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	background-color: #f3f6f8;

	&-data-card {
		margin-bottom: 20px;
	}
}
</style>
