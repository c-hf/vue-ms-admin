<template>
    <div class="classify"
         v-loading="loading">
        <el-form ref="deviceForm"
                 label-position="left"
                 label-width="0"
                 class="device-form">
            <el-form-item v-for="(item, index) in options"
                          :key="index">
                <el-card class="box-card">
                    <div slot="header"
                         class="clearfix">
                        <span> {{item.name}} </span>
                        <el-button-group style="float: right; padding-top: 2px;">
                            <el-button plain
                                       size="medium"
                                       icon="el-icon-edit"
                                       @click="addData(item.categoryId,item.name,'setDeviceCategory')"></el-button>
                            <el-button plain
                                       size="medium"
                                       icon="el-icon-delete"></el-button>
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
                                    <el-button type="text"
                                               size="medium"
                                               @click="compileData(scope.row,index,'updateDeviceCategoryItem')">编辑</el-button>
                                    <el-button type="text"
                                               size="medium"
                                               @click="removeData(scope.row.categoryItemId,scope.row.name,'deleteDeviceCategoryItem')">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                    <el-col :span="20"
                            :offset="2"
                            style="padding: 20px 0;">
                        <el-button plain
                                   @click="addData(item,index,'setDeviceCategoryItem')">添加</el-button>
                    </el-col>
                </el-card>
            </el-form-item>
        </el-form>
        <el-dialog title="编辑设备分类项"
                   center
                   :visible.sync="dialogVisible"
                   width="460px"
                   :before-close="dialogClose">
            <el-form :model="dialogData"
                     label-width="120px"
                     label-position="left">
                <el-form-item v-for="(item, index) in dialogItems"
                              :key="index"
                              :label="item.name">
                    <el-input placeholder=""
                              :disabled="item.disable"
                              v-model="dialogData[item.id]">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer"
                  class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           @click="dialogSubmit">确 定</el-button>
            </span>
        </el-dialog>
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
			deviceCategoryItem: {
				categoryId: '',
				categoryItemId: '',
				name: '',
			},

			dialogVisible: false,
			dialogItems: [],
			dialogMethod: '',
			dialogData: {},
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
		compileData(data, index, method) {
			this.dialogItems = [];
			this.categoryItemIndex = this.options[index].categoryItem.indexOf(
				data
			);
			this.setDialogItems(data);
			this.dialogItems[1].disable = true;
			this.dialogMethod = method;
			this.dialogMsg = '修改成功！';
			this.dialogVisible = true;
		},

		// 添加
		addData(data, index, method) {
			this.dialogItems = [];
			this.deviceCategoryItem.categoryId = data.categoryId;
			this.setDialogItems(this.deviceCategoryItem);
			this.dialogMethod = method;
			this.dialogMsg = '添加成功！';
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
		dialogSubmit() {
			let [id, type] = ['', ''];
			if (this.dialogMethod === 'setDeviceCategory') {
				id = this.dialogData.categoryId;
				type = 'category';
			} else if (this.dialogMethod === 'setDeviceCategoryItem') {
				id = this.dialogData.categoryItemId;
				type = 'categoryItem';
			}
			if (!id && !type) {
				this.dbOperation(
					this.dialogMethod,
					this.dialogData,
					this.dialogMsg
				);
				this.dialogVisible = false;
			} else {
				getDeviceUnique(id, type)
					.then(resData => {
						if (resData) {
							this.dbOperation(
								this.dialogMethod,
								this.dialogData,
								this.dialogMsg
							);
							this.dialogVisible = false;
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
				this.dialogMsg = '';
				this.dialogMethod = '';
				this.dialogData = {};
			}
		},

		// 关闭
		dialogClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					if (_) {
						done();
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
		},

		// http获取设备分类
		getInfoByHttp(id, contents, updateTime) {
			getDeviceCategoryInfo()
				.then(data => {
					this.options = data;
					this.updateLocalStorage(id, contents, updateTime);
					this.loading = false;
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

		// 添加新分类
		addNewCategory() {
			this.options.push({
				categoryId: '',
				categoryItem: [],
				name: '添加新分类',
			});
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
					item.value = data[key];
					item.name = dataName[key];
					item.id === 'categoryId'
						? (item.disable = true)
						: (item.disable = false);
					this.dialogItems.push(item);
					this.dialogData[item.id] = data[key];
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

			return methods[method](data).then(resData => {
				console.log(resData);
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
		// this.addNewCategory();
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
}
</style>
