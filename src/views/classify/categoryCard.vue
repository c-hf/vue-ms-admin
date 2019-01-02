<template>
    <el-card class="category-card">
        <div slot="header"
             class="category-card-header">
            <span>
                {{category.name}}
            </span>
            <el-button type="primary"
                       v-if="!edit"
                       @click="setEdit">编辑</el-button>
            <el-button type="primary"
                       v-else
                       @click="setEdit">保存</el-button>
        </div>
        <device-table ref="deviceTable"
                      :device="device"
                      :table="table"
                      :edit="edit"
                      @deleteData="deleteData" />
        <category-dialog :type="type"
                         :dialogData="dialogData"
                         :dialogVisible="dialogVisible"
                         @getLatestData="addSuccess"
                         @setDialogVisible="setDialogVisible" />

        <div class="category-card-add-btn">
            <el-button plain
                       @click="dialogVisible = true"
                       v-show="edit">
                添加
            </el-button>
        </div>
    </el-card>
</template>

<script>
import DeviceTable from '@/components/deviceTable';
import CategoryDialog from './categoryDialog';
import { TABLE } from './config.js';
import {
	updateDeviceCategoryItem,
	deleteDeviceCategoryItem,
} from '@/api/device';

export default {
	name: 'CategoryCard',
	data() {
		return {
			table: TABLE,
			edit: false,
			timer: null,
			dialogVisible: false,
			type: 'categoryItem',
		};
	},

	computed: {
		device() {
			const device = {
				categoryId: this.category.categoryId,
				data: this.category.categoryItem,
			};
			return device;
		},

		dialogData() {
			return {
				categoryId: this.category.categoryId,
				categoryItemId: '',
				name: '',
			};
		},
	},

	methods: {
		setDialogVisible(value) {
			this.dialogVisible = value;
		},

		// 添加
		addSuccess() {
			this.$emit('getLatestData', this.category.categoryId);
		},

		// 编辑
		setEdit() {
			if (!this.edit) {
				this.edit = true;
				return;
			}
			this.$refs.deviceTable.$refs.form.validate(valid => {
				if (!valid) {
					return;
				}
				this.edit = false;
				if (this.timer) {
					clearTimeout(this.timer);
					this.timer = null;
				}
				this.timer = setTimeout(() => {
					this.updateDeviceCategoryItemFn(
						this.$refs.deviceTable.deviceData
					);
				}, 300);
			});
		},

		// 删除
		deleteData(data) {
			this.$emit('setLoading', true);
			deleteDeviceCategoryItem(data.categoryItemId)
				.then(resData => {
					if (resData.ok) {
						this.$emit('getLatestData', data.categoryId);
						this.$message({
							showClose: true,
							center: true,
							message: '删除成功！',
							type: 'success',
						});
					}
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
					this.$emit('setLoading', false);
				});
		},

		// 更新
		updateDeviceCategoryItemFn(data) {
			this.$emit('setLoading', true);
			updateDeviceCategoryItem(data.data)
				.then(resData => {
					if (resData.ok) {
						this.$emit('getLatestData', data.categoryId);
						this.$message({
							showClose: true,
							center: true,
							message: '更新成功！',
							type: 'success',
						});
					}
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
					this.$emit('setLoading', false);
				});
		},
	},

	props: {
		category: {
			type: Object,
		},
	},

	components: {
		DeviceTable,
		CategoryDialog,
	},

	watch: {
		category(newVal, oldVal) {
			if (newVal.categoryId !== oldVal.categoryId) {
				this.edit = false;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';
.category-card {
	&-header {
		@include flex-between();
		width: 100%;
		height: 40px;
	}

	&-add-btn {
		height: 60px;
		line-height: 60px;
	}
}
</style>
