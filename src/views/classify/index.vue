<template>
    <div class="classify"
         v-loading.fullscreen.lock="loading">
        <el-row :gutter="24">
            <el-col :span="8"
                    :offset="0">
                <el-card class="box-card">
                    test
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    test
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    test
                </el-card>
            </el-col>
        </el-row>
        <el-form ref="deviceForm"
                 label-position="left"
                 label-width="0"
                 class="device-form">
            <el-row :gutter="24">
                <el-form-item v-for="(item, index) in options"
                              :key="index">
                    <el-col :span="24"
                            class="classify-col"
                            :offset="0">
                        <el-card class="box-card"
                                 shadow="hover">
                            <div slot="header"
                                 class="clearfix">
                                <span> {{item.name}} </span>
                                <el-button-group style="float: right; padding-top: 2px;">
                                    <el-button plain
                                               size="medium"
                                               icon="el-icon-edit"
                                               @click="compileData(item,'updateDeviceCategory')"></el-button>
                                    <el-button plain
                                               size="medium"
                                               icon="el-icon-delete"
                                               @click="removeData(item.categoryId,item.name,'deleteDeviceCategory')"></el-button>
                                </el-button-group>
                            </div>
                            <el-col :span="20"
                                    :offset="2">
                                <el-table :data="item.categoryItem"
                                          highlight-current-row
                                          border
                                          style="width: 90%;">
                                    <el-table-column prop="categoryId"
                                                     label="分类 ID ">
                                    </el-table-column>
                                    <el-table-column prop="categoryItemId"
                                                     label="设备 ID">
                                    </el-table-column>
                                    <el-table-column prop="name"
                                                     label="设备名称">
                                    </el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <!-- <el-tooltip class="item"
                                                    effect="dark"
                                                    content="编辑"
                                                    placement="top"> -->
                                            <el-button type="text"
                                                       icon="el-icon-edit"
                                                       @click="compileData(scope.row,'updateDeviceCategoryItem')"></el-button>
                                            <!-- </el-tooltip> -->
                                            <!-- 编辑 删除 size="medium"-->
                                            <!-- <el-tooltip class="item"
                                                    effect="dark"
                                                    content="删除"
                                                    placement="top"> -->
                                            <el-button type="text"
                                                       icon="el-icon-delete"
                                                       @click="removeData(scope.row.categoryItemId,scope.row.name,'deleteDeviceCategoryItem')"></el-button>
                                            <!-- </el-tooltip> -->
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-col>
                            <el-col :span="20"
                                    :offset="2"
                                    style="padding: 20px 0;">
                                <el-button plain
                                           @click="addData(item,'setDeviceCategoryItem')">添加</el-button>
                            </el-col>
                        </el-card>
                    </el-col>
                </el-form-item>
            </el-row>
        </el-form>
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
        <el-button class="classify-add-category"
                   icon="el-icon-plus"
                   circle
                   @click="addData(deviceCategory,'setDeviceCategory')"></el-button>
    </div>
</template>

<script>
import {
	DEVICE_DATA_KEY,
	CATEGORY_CONTENT_UPDATE_TIME_INTERVAL,
} from './config.js';
import {
	setDeviceCategory,
	setDeviceCategoryItem,
	updateDeviceCategory,
	updateDeviceCategoryItem,
	deleteDeviceCategory,
	deleteDeviceCategoryItem,
	getDeviceCategoryInfo,
	getDeviceUnique,
} from '@/api/device';
import storage from '@/assets/js/storage';

export default {
	name: 'DeviceClassify',
	data() {
		return {
			loading: false,
			options: [],
			deviceCategory: {
				categoryId: '',
				name: '',
			},
			deviceCategoryItem: {
				categoryId: '',
				categoryItemId: '',
				name: '',
			},
			dialogData: { dialogFormItems: [] },
			dialogVisible: false,
			dialogMethod: '',
			dialogTitle: '',
			dialogMsg: '',
		};
	},
	methods: {
		// 获取信息
		getInfo() {
			this.loading = true;
			let [contents = {}, id, updateTime] = [
				storage.get(DEVICE_DATA_KEY),
				storage.get('id'),
				'',
			];
			const curTime = new Date().getTime(); // 获取当前时间
			if (contents && contents[id]) {
				updateTime = contents[id].updateTime || 0;

				if (
					curTime - updateTime <=
					CATEGORY_CONTENT_UPDATE_TIME_INTERVAL
				) {
					// localstorage
					this.options = contents[id].data;
					this.loading = false;
				} else {
					// HTTP
					this.getInfoByHttp(id, contents, curTime);
				}
			} else {
				// HTTP
				this.getInfoByHttp(id, contents, curTime);
			}
		},

		// 编辑
		compileData(data, method) {
			this.dialogData = {
				dialogFormItems: [],
			};
			this.setDialogItems(data);
			if (this.dialogData.dialogFormItems[1].id === 'categoryItemId') {
				this.dialogData.dialogFormItems[1].disable = true;
			}
			this.dialogMethod = method;
			this.dialogMsg = '修改成功！';
			this.dialogTitle = '编辑';
			this.dialogVisible = true;
		},

		// 添加
		addData(data, method) {
			this.dialogData = {
				dialogFormItems: [],
			};
			if (method === 'setDeviceCategoryItem') {
				this.deviceCategoryItem.categoryId = data.categoryId;
				this.setDialogItems(this.deviceCategoryItem);
			} else {
				this.setDialogItems(data);
				this.dialogData.dialogFormItems[0].disable = false;
			}
			this.dialogMethod = method;
			this.dialogMsg = '添加成功！';
			this.dialogTitle = '添加';
			this.dialogVisible = true;
		},

		// 删除
		removeData(data, name, method) {
			this.$confirm(`是否删除 ${data} - ${name} ?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.dbOperation(method, data, '删除成功！');
				})
				.catch(() => {
					this.$message({
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

				let [data, id, type] = [{}, '', ''];

				this.dialogData.dialogFormItems.forEach(el => {
					data[el.id] = el.value;
				});

				if (this.dialogMethod === 'setDeviceCategory') {
					id = data.categoryId;
					type = 'category';
				} else if (this.dialogMethod === 'setDeviceCategoryItem') {
					id = data.categoryItemId;
					type = 'categoryItem';
				}

				if (!id && !type) {
					this.dbOperation(this.dialogMethod, data, this.dialogMsg);
					return;
				}
				getDeviceUnique(id, type)
					.then(resData => {
						if (resData) {
							this.dbOperation(
								this.dialogMethod,
								data,
								this.dialogMsg
							);
						}
					})
					.catch(error => {
						this.$message({
							showClose: true,
							center: true,
							message: error.message,
							type: 'error',
						});
					});
				this.$refs[formName].resetFields();
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

		// http获取设备分类
		getInfoByHttp(id, contents, updateTime) {
			getDeviceCategoryInfo()
				.then(resData => {
					if (resData !== 'ok') {
						this.options = resData;
						this.updateLocalStorage(id, contents, updateTime);
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

		// 更新本地缓存
		updateLocalStorage(id, contents, curTime) {
			contents = contents || {};
			contents[id] = {};
			contents[id].data = this.options;
			contents[id].updateTime = curTime;
			storage.set(DEVICE_DATA_KEY, contents);
		},

		// 设置 DialogItem
		setDialogItems(data) {
			const dataName = {
				categoryId: '分类 ID',
				categoryItemId: '分类设备 ID',
				name: '显示名称',
			};
			for (let key of Object.keys(data)) {
				let item = {};
				if (dataName[key]) {
					item.id = key;
					item.name = dataName[key];
					item.value = data[key];
					item.id === 'categoryId'
						? (item.disable = true)
						: (item.disable = false);
					this.dialogData.dialogFormItems.push(item);
				}
			}
		},

		// 数据库操作
		dbOperation(method, data, msg) {
			const methods = {
				setDeviceCategory: setDeviceCategory,
				setDeviceCategoryItem: setDeviceCategoryItem,
				updateDeviceCategory: updateDeviceCategory,
				updateDeviceCategoryItem: updateDeviceCategoryItem,
				deleteDeviceCategory: deleteDeviceCategory,
				deleteDeviceCategoryItem: deleteDeviceCategoryItem,
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
					this.dialogVisible = false;
					this.dialogMethod = '';
					this.dialogMsg = '';
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
				})
				.then(() => {
					let [contents = {}, id] = [
						storage.get(DEVICE_DATA_KEY),
						storage.get('id'),
					];
					const curTime = new Date().getTime(); // 获取当前时间
					this.getInfoByHttp(id, contents, curTime);
				});
		},
	},
	components: {},
	created() {
		this.getInfo();
	},
};
</script>

<style lang="scss" scoped>
.classify {
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
	background-color: #f3f6f8;
	padding-bottom: 200px;

	&-header {
		width: 100%;
		height: 100px;
	}

	&-add-category {
		width: 60px;
		height: 60px;
		position: fixed;
		right: 3%;
		bottom: 10%;
		&:hover {
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		}
	}
}
</style>
