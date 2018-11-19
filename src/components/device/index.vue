<template>
    <div class="param">
        <el-card class="param-card"
                 v-loading="loading">
            <el-col :span="8">
                <el-card shadow="never"
                         class="param-data-card">
                    <el-form ref="paramForm"
                             :model="deviceData"
                             label-position="left"
                             label-width="100px">
                        <el-form-item label="分类设备">
                            <el-cascader :options="options"
                                         :show-all-levels="true"
                                         v-model="deviceData.id"
                                         @change="change"></el-cascader>
                        </el-form-item>
                    </el-form>
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
                    {{ cardTitle }}
                </el-card>
            </el-col>
            <el-col :span="15"
                    :offset="1">
                <el-table :data="deviceParam.param"
                          highlight-current-row
                          border
                          style="width: 100%;">
                    <el-table-column v-for="(item, index) in tableData"
                                     :key="index"
                                     :prop="item.id"
                                     :label="item.label">
                    </el-table-column>
                    <el-table-column label="操作"
                                     fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text"
                                       size="mini"
                                       @click="compileData(scope.row,deviceParam.categoryItemId)">
                                Compile
                            </el-button>
                            <el-button type="text"
                                       size="mini"
                                       @click="deleteData(scope.row,deviceParam.categoryItemId)">
                                Delete
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button plain
                           @click="addData()">添加属性</el-button>
            </el-col>
        </el-card>
        <el-dialog :title="dialogTitle"
                   center
                   :visible.sync="dialogVisible"
                   width="460px"
                   :before-close="dialogClose">
            <el-form ref="dialogForm"
                     :model="dialogData"
                     label-width="120px"
                     label-position="left">
                <el-form-item v-for="(item, index) in dialogData.dialogFormItems"
                              :key="index"
                              :prop="'dialogFormItems.' + index + '.value'"
                              :rules="{required: true, message: '此项为必填项', trigger: 'blur'}"
                              :label="item.name">
                    <el-input placeholder=""
                              :disabled="item.disable"
                              v-model="item.value">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer"
                  class="dialog-footer">
                <el-button @click="onCancel('dialogForm')">取 消</el-button>
                <el-button type="primary"
                           @click="dialogSubmit('dialogForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
	DEVICE_DATA_KEY,
	DEVICEPARAM_DATA_KEY,
	CATEGORY_CONTENT_UPDATE_TIME_INTERVAL,
} from './config.js';

import {
	setDeviceParam,
	getDeviceCategoryInfo,
	getDeviceParam,
	updateDeviceParam,
	deleteDeviceParam,
} from '@/api/device';

import storage from '@/assets/js/storage';
import deviceOperation from '@/assets/js/deviceOperation';

export default {
	name: 'DeviceParam', // 设备参数
	data() {
		return {
			loading: false,
			paramAggregate: [],
			deviceParam: { categoryItemId: '', param: [] },
			deviceData: {
				id: ['power', 'socket'],
			},
			options: [],
			dialogData: { dialogFormItems: [] },
			dialogVisible: false,
			dialogMethod: '',
			dialogTitle: '',
			dialogMsg: '',
		};
	},
	methods: {
		// 获取设备分类
		getInfo() {
			this.loading = true;
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
					this.loading = false;
				} else {
					// HTTP
					this.getInfoByHttp(id, deviceContents, curTime);
				}
			} else {
				// HTTP
				this.getInfoByHttp(id, deviceContents, curTime);
			}
		},

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
					this.change();
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
						this.change();
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
		change() {
			this.paramAggregate.forEach(el => {
				if (el.categoryItemId === this.deviceData.id[1]) {
					this.deviceParam = el;
				}
			});
		},

		// 编辑
		compileData(data, categoryItemId) {
			this.setDialogItems({
				categoryItemId: categoryItemId,
				id: data.id,
				name: data.name,
				value: data.value,
				unit: data.unit,
			});
			this.dialogMethod = 'updateDeviceParam';
			this.dialogMsg = '修改成功！';
			this.dialogTitle = '修改';
			this.dialogVisible = true;
		},

		// 添加
		addData() {
			this.setDialogItems({
				categoryItemId: this.deviceData.id[1],
				id: '',
				name: '',
				value: '',
				unit: '',
			});
			this.dialogMethod = 'setDeviceParam';
			this.dialogMsg = '添加成功！';
			this.dialogTitle = '添加';
			this.dialogVisible = true;
		},

		// 删除
		deleteData(data, categoryItemId) {
			this.$confirm(`是否删除 ${data.id} - ${data.name} ?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					data = {
						categoryItemId: categoryItemId,
						id: data.id,
					};
					this.dbOperation('deleteDeviceParam', data, '删除成功！');
				})
				.catch(() => {
					this.$message({
						showClose: true,
						center: true,
						type: 'info',
						message: '已取消删除',
					});
				});
		},

		// 提交
		dialogSubmit(formName) {
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return false;
				}
				let data = this.setData();
				this.dbOperation(this.dialogMethod, data, this.dialogMsg).then(
					() => {
						this.dialogVisible = false;
						this.dialogMsg = '';
						this.dialogMethod = '';
						this.$refs[formName].resetFields();
					}
				);
			});
		},

		// 取消
		onCancel(formName) {
			this.$refs[formName].resetFields();
			this.dialogVisible = false;
		},

		// 关闭
		dialogClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					if (_) {
						this.$refs.dialogForm.resetFields();
						done();
					}
				})
				.catch(error => {
					if (error) {
						return false;
					}
				});
		},

		// DialogItem
		setDialogItems(data) {
			const dataName = {
				categoryItemId: '分类设备 ID',
				id: '参数名称',
				name: '显示名称',
				value: '值',
				unit: '单位',
			};
			this.dialogData = { dialogFormItems: [] };
			for (let key of Object.keys(data)) {
				let item = {};
				if (dataName[key]) {
					item.id = key;
					item.name = dataName[key];
					item.value = data[key];
					item.id === 'categoryItemId'
						? (item.disable = true)
						: (item.disable = false);
					this.dialogData.dialogFormItems.push(item);
				}
			}
		},

		// 数据库操作
		dbOperation(method, data, msg) {
			const methods = {
				setDeviceParam: setDeviceParam,
				updateDeviceParam: updateDeviceParam,
				deleteDeviceParam: deleteDeviceParam,
			};
			this.loading = true;
			return methods[method](data)
				.then(resData => {
					if (!resData) {
						return;
					}
					this.$message({
						showClose: true,
						center: true,
						message: msg,
						type: 'success',
					});
					let [contents = {}, id] = [
						storage.get(DEVICEPARAM_DATA_KEY),
						storage.get('id'),
					];
					const curTime = new Date().getTime(); // 获取当前时间
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

		// data
		setData() {
			let data = {
				param: {},
			};
			this.dialogData.dialogFormItems.forEach(el => {
				if (el.id === 'categoryItemId') {
					data[el.id] = el.value;
				} else {
					data.param[el.id] = el.value;
				}
			});
			return data;
		},
	},
	created() {
		this.getInfo();
		this.getParam();
	},
	props: {
		cardTitle: {
			type: String,
			default: '',
		},
		tableData: {
			type: Array,
		},
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
