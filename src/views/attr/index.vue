<template>
    <div class="attr">
        <el-card class="attr-card"
                 v-loading="loading">
            <div slot="header"
                 class="clearfix">
                <span>设备参数</span>
            </div>
            <el-col :span="8">
                <el-card shadow="never"
                         class="attr-data-card">
                    <category-data :deviceData="deviceData"
                                   @change="setDeviceAttr"
                                   @setLoading="setLoading" />
                </el-card>
                <el-card shadow="never"
                         class="attr-data-card">
                    分类
                </el-card>
                <el-card shadow="never"
                         class="attr-data-card">
                    分类设备
                </el-card>
                <el-card shadow="never"
                         class="attr-data-card">
                    当前设备参数
                </el-card>
            </el-col>
            <el-col :span="15"
                    :offset="1">
                <device-table :device="deviceAttr"
                              :tableData="tableData"
                              addDataBtn="添加属性"
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
                       @getDataByHttp="getAttrByHttp"
                       @setDialogInit="setDialogInit"
                       @setDialogVisible="setDialogVisible"
                       @setLoading="setLoading" />
    </div>
</template>

<script>
import {
	DATANAME,
	TABLEDATA,
	DEVICEATTR_DATA_KEY,
	CATEGORY_CONTENT_UPDATE_TIME_INTERVAL,
} from './config.js';

import {
	setDeviceAttr,
	getDeviceAttr,
	updateDeviceAttr,
	deleteDeviceAttr,
} from '@/api/device';

import storage from '@/assets/js/storage';
import deviceOperation from '@/assets/js/deviceOperation';

import DeviceTable from '@/components/deviceTable';
import CategoryData from '@/components/categoryData';
import DeviceDialog from '@/components/deviceDialog';

export default {
	name: 'DeviceAttr',
	data() {
		return {
			loading: false,
			dataName: DATANAME,
			tableData: TABLEDATA,
			methods: {
				setDeviceAttr: setDeviceAttr,
				updateDeviceAttr: updateDeviceAttr,
			},
			attrAggregate: [],
			deviceAttr: { categoryItemId: '', data: [] },
			deviceData: {
				id: ['power', 'socket'],
			},
			storageKey: DEVICEATTR_DATA_KEY,
			dialogData: { dialogFormItems: [] },
			dialogVisible: false,
			dialogMethod: '',
			dialogTitle: '',
			dialogMsg: '',
		};
	},
	methods: {
		// 获取设备参数
		getAttr() {
			this.loading = true;
			let [id, attrContents = {}, updateTime] = [
				storage.get('id'),
				storage.get(DEVICEATTR_DATA_KEY),
				0,
			];

			const curTime = new Date().getTime(); // 获取当前时间

			if (attrContents && attrContents[id]) {
				updateTime = attrContents[id].updateTime;

				if (
					curTime - updateTime <=
					CATEGORY_CONTENT_UPDATE_TIME_INTERVAL
				) {
					// localstorage
					this.attrAggregate = attrContents[id].data;
					this.setDeviceAttr(this.deviceData.id);
					this.loading = false;
				} else {
					// HTTP
					this.getAttrByHttp(id, attrContents, curTime);
				}
			} else {
				// HTTP
				this.getAttrByHttp(id, attrContents, curTime);
			}
		},

		// http获取设备参数
		getAttrByHttp(id, contents, updateTime) {
			getDeviceAttr()
				.then(resData => {
					if (resData !== 'ok') {
						deviceOperation.updateLocalStorage({
							id: id,
							data: resData,
							contents: contents,
							curTime: updateTime,
							key: DEVICEATTR_DATA_KEY,
						});
						this.attrAggregate = resData;
						this.setDeviceAttr(this.deviceData.id);
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
		setDeviceAttr(id) {
			this.attrAggregate.forEach(el => {
				if (el.categoryItemId === id[1]) {
					this.deviceAttr.categoryItemId = el.categoryItemId;
					this.deviceAttr.data = el.attr;
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
					attrType: data.attrType,
					value: data.value,
					unit: data.unit,
				},
				this.dataName
			);
			this.dialogData.dialogFormItems[1].disable = true;
			this.dialogMethod = 'updateDeviceAttr';
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
					attrType: '',
					value: '',
					unit: '',
				},
				this.dataName
			);
			this.dialogMethod = 'setDeviceAttr';
			this.dialogMsg = '添加成功！';
			this.dialogTitle = '添加';
			this.dialogVisible = true;
		},

		// 删除
		deleteData(data) {
			this.loading = true;
			deleteDeviceAttr(data)
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
					this.getAttrByHttp(id, contents, curTime);
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

		// 初始化 dialog
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
		this.getAttr();
	},
};
</script>

<style lang="scss" scoped>
.attr {
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
	background-color: #f3f6f8;
	padding-bottom: 200px;
}
</style>
