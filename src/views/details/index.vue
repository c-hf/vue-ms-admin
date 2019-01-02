<template>
    <div class="details"
         v-loading="loading">
        <el-tabs class="details-tabs"
                 tab-position="left"
                 v-model="activeName">
            <el-tab-pane name="param">
                <span slot="label">
                    <svg-icon iconClass="icon-canshu1" />
                    参数
                </span>
                <device-param :categoryItemName="categoryItemName"
                              :categoryItemId="categoryItemId"
                              :deviceParam="deviceParam"
                              @updateData="updateData"
                              @setLoading="setLoading"
                              @setDialogVisible="setDialogVisible" />
            </el-tab-pane>
            <el-tab-pane name="attr">
                <span slot="label">
                    <svg-icon iconClass="icon-attribute" />
                    属性
                </span>
                <device-attr :categoryItemName="categoryItemName"
                             :categoryItemId="categoryItemId"
                             :deviceAttr="deviceAttr"
                             @setLoading="setLoading"
                             @updateData="updateData"
                             @setDialogVisible="setDialogVisible" />
            </el-tab-pane>
        </el-tabs>
        <device-dialog :type="activeName"
                       :dialogData="dialogData"
                       :dialogVisible="dialogVisible"
                       @addData="addData"
                       @setDialogVisible="setDialogVisible" />
    </div>
</template>

<script>
import DeviceDialog from '@/components/deviceDialog';
import DeviceParam from './param';
import DeviceAttr from './attr';
import { getDeviceParamAndAttrById } from '@/api/device';

export default {
	name: 'Details',
	data() {
		return {
			loading: false,
			timer: null,
			activeName: 'param',
			dialogVisible: false,
			categoryItemId: '',
			categoryItemName: '',
			deviceParam: { categoryItemId: '', data: [] },
			deviceAttr: { categoryItemId: '', data: [] },
		};
	},

	computed: {
		dialogData() {
			const data = {
				param: {
					categoryItemId: this.categoryItemId,
					id: '',
					name: '',
					value: '',
					unit: '',
				},
				attr: {
					categoryItemId: this.categoryItemId,
					id: '',
					name: '',
					attrType: '',
					value: '',
					unit: '',
				},
			};
			return data[this.activeName];
		},
	},

	methods: {
		// 获取路由数据
		getRouteData() {
			this.categoryItemId = this.$route.params.categoryItemId;
			this.categoryItemName = this.$route.query.name;
		},

		// loading
		setLoading(value) {
			this.loading = value;
		},

		// 设置 DialogVisible
		setDialogVisible(value) {
			this.dialogVisible = value;
		},

		// 添加
		addData(data) {
			const types = {
				param: this.deviceParam,
				attr: this.deviceAttr,
			};
			types[this.activeName].data.push(data.data);
		},

		// 更新
		updateData(data) {
			this.$message({
				showClose: true,
				center: true,
				message: '更新成功！',
				type: 'success',
			});
			const types = {
				param: this.deviceParam,
				attr: this.deviceAttr,
			};
			types[this.activeName].data = data;
		},

		// 获取属性参数封装
		getDeviceParamAndAttrFn() {
			this.loading = true;
			getDeviceParamAndAttrById(this.categoryItemId)
				.then(resData => {
					this.deviceParam.categoryItemId = resData.categoryItemId;
					this.deviceParam.data = resData.param;
					this.deviceAttr.categoryItemId = resData.categoryItemId;
					this.deviceAttr.data = resData.attr;
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
					this.loading = false;
				});
		},
	},

	components: {
		DeviceParam,
		DeviceAttr,
		DeviceDialog,
	},

	created() {
		this.getRouteData();
		this.getDeviceParamAndAttrFn();
	},
};
</script>

<style lang="scss" scoped>
.details {
	width: 100%;
	height: 100%;

	&-card {
		margin-bottom: 20px;

		&-content {
			height: 100px;
		}
	}

	.el-row {
		height: 100%;

		.el-col {
			height: 100%;
		}
	}

	&-tabs {
		width: 100%;

		&-content {
			width: 100%;
		}
	}
}
</style>
