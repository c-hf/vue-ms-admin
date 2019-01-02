<template>
    <el-card class="param">
        <div slot="header"
             class="param-header">
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
        <!-- <div class="param-content"> -->

        <device-table ref="deviceTable"
                      :device="deviceParam"
                      :table="table"
                      :edit="edit"
                      @deleteData="deleteData" />

        <!-- </div> -->
        <div class="param-add-btn">
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
import { deleteDeviceParam, updateDeviceParam } from '@/api/device';
import { PARAMTABLE } from './config.js';

export default {
	name: 'DeviceParam',
	data() {
		return {
			table: PARAMTABLE,
			edit: false,
			timer: null,
		};
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
					this.updateDeviceParamFn(this.$refs.deviceTable.deviceData);
				}, 300);
			});
		},

		// 更新参数封装
		updateDeviceParamFn(data) {
			this.$emit('setLoading', true);
			updateDeviceParam(data)
				.then(resData => {
					this.$emit('updateData', resData.param);
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
			deleteDeviceParam(data)
				.then(resData => {
					this.$message({
						showClose: true,
						center: true,
						message: '删除成功！',
						type: 'success',
					});
					this.$emit('updateData', resData.param);
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

	components: {
		DeviceTable,
	},

	props: {
		categoryItemName: {
			type: String,
		},

		categoryItemId: {
			type: String,
		},

		deviceParam: {
			type: Object,
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';

.param {
	width: 100%;

	&-header {
		@include flex-between();
	}

	&-content {
		height: 420px;
	}

	&-add-btn {
		height: 60px;
		line-height: 60px;
	}
}
</style>
