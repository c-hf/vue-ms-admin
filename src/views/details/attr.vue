<template>
    <el-card class="attr"
             body-style="overflow: hidden">
        <div slot="header"
             class="attr-header">
            <el-button type="text"
                       icon="el-icon-arrow-left"
                       circle
                       @click="goBack">返回</el-button>
            <span>
                {{categoryItemName}}
            </span>
            <el-button type="primary"
                       v-if="!edit"
                       @click="setEdit">编辑</el-button>
            <el-button type="primary"
                       v-else
                       @click="setEdit">保存</el-button>
        </div>
        <device-table ref="deviceTable"
                      :device="deviceAttr"
                      :table="table"
                      :edit="edit"
                      @deleteData="deleteData" />

        <div class="attr-add-btn">
            <el-button plain
                       @click="addData"
                       v-show="edit">
                添加
            </el-button>
        </div>
    </el-card>

</template>

<script>
import DeviceTable from '@/components/deviceTable';
import { updateDeviceAttr, deleteDeviceAttr } from '@/api/device';
import { ATTRTABLE } from './config.js';

export default {
	name: 'DeviceAttr',
	data() {
		return {
			timer: null,
			edit: false,
			table: ATTRTABLE,
		};
	},

	computed: {
		dialogData() {
			return {
				categoryItemId: this.categoryItemId,
				id: '',
				name: '',
				attrType: '',
				value: '',
				unit: '',
			};
		},
	},

	methods: {
		// 返回
		goBack() {
			this.$router.push({
				name: 'classify',
			});
		},

		// 添加
		addData() {
			this.$emit('setDialogVisible', true);
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
					this.updateDeviceAttrFn(this.$refs.deviceTable.deviceData);
				}, 300);
			});
		},

		// 更新参数封装
		updateDeviceAttrFn(data) {
			this.$emit('setLoading', true);
			updateDeviceAttr(data)
				.then(resData => {
					console.log(resData);
					this.$emit('updateData', resData.attr);
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

		// 删除参数封装
		deleteData(data) {
			this.$emit('setLoading', true);
			deleteDeviceAttr(data)
				.then(resData => {
					this.$message({
						showClose: true,
						center: true,
						message: '删除成功！',
						type: 'success',
					});
					this.$emit('updateData', resData.attr);
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
		categoryItemName: {
			type: String,
		},

		categoryItemId: {
			type: String,
		},

		deviceAttr: {
			type: Object,
		},
	},

	components: {
		DeviceTable,
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';

.attr {
	width: 100%;

	&-header {
		@include flex-between();
	}

	&-add-btn {
		height: 60px;
		line-height: 60px;
	}
}
</style>
