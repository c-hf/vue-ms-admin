<template>
    <el-dialog custom-class="dialog"
               :title="title"
               :close-on-click-modal="true"
               :visible.sync="visible"
               :before-close="dialogClose"
               v-loading="loading"
               width="500px">
        <el-form class="dialog-form"
                 ref="dialogForm"
                 :rules="rules"
                 :model="formData"
                 label-width="100px"
                 label-position="left">
            <el-form-item label="分类 ID"
                          prop="categoryId">
                <el-input v-model="formData.categoryId"
                          :disabled="type !== 'category'">
                </el-input>
            </el-form-item>
            <el-form-item v-if="type === 'categoryItem'"
                          label="分类设备 ID"
                          prop="categoryItemId">
                <el-input v-model="formData.categoryItemId">
                </el-input>
            </el-form-item>
            <el-form-item label="名称"
                          prop="name">
                <el-input v-model="formData.name">
                </el-input>
            </el-form-item>
        </el-form>
        <span slot="footer"
              class="dialog-footer">
            <el-button @click="onCancel('dialogForm')">取消</el-button>
            <el-button type="primary"
                       @click="dialogSubmit('dialogForm')">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {
	updateDeviceCategory,
	setDeviceCategory,
	setDeviceCategoryItem,
} from '@/api/device';
import { RULES } from '@/config';

export default {
	name: 'CategoryDialog',
	data() {
		return {
			loading: false,
			visible: this.dialogVisible,
			formData: this.dialogData,
			rules: RULES,
		};
	},

	computed: {
		title() {
			if (this.type === 'updateCategory') {
				return '修改';
			}
			return '添加';
		},

		method() {
			const methods = {
				updateCategory: updateDeviceCategory,
				category: setDeviceCategory,
				categoryItem: setDeviceCategoryItem,
			};
			return methods[this.type];
		},
	},

	methods: {
		// 提交
		dialogSubmit(formName) {
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return;
				}
				this.dbOperation(this.formData).then(() => {
					this.fromDataInit();
					this.visible = false;
					this.loading = false;
				});
			});
		},

		// 关闭
		dialogClose(done) {
			this.$confirm('确认关闭？')
				.then(() => {
					this.fromDataInit();
					done();
				})
				.catch(error => {
					if (error) {
						return false;
					}
				});
		},

		// 取消
		onCancel() {
			this.fromDataInit();
			this.visible = false;
		},

		// 数据初始化
		fromDataInit() {
			this.$refs.dialogForm.clearValidate();
			if (this.type === 'categoryItem') {
				this.formData.categoryItemId = '';
			} else {
				this.formData.categoryId = '';
			}
			this.formData.name = '';
		},

		// 数据库操作
		dbOperation(data) {
			let msg = '添加成功！';
			if (this.type === 'updateCategory') {
				msg = '修改成功！';
			}
			this.loading = true;
			return this.method(data)
				.then(() => {
					this.$message({
						showClose: true,
						center: true,
						message: msg,
						type: 'success',
					});
					this.$emit('getLatestData', data.categoryId);
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
	},

	props: {
		// 添加数据类型
		type: {
			type: String,
		},

		// 数据
		dialogData: {
			type: Object,
		},

		// 是否开启
		dialogVisible: {
			type: Boolean,
			default: false,
		},
	},

	watch: {
		dialogVisible(newVal) {
			this.visible = newVal;
		},

		visible(newVal) {
			if (newVal === false) {
				this.$emit('setDialogVisible', false);
			}
		},

		dialogData(newVal) {
			this.formData = newVal;
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';
.dialog {
	@include flex-center();

	&-form {
		width: 360px;
		margin: auto;

		.el-select {
			width: 100%;
		}
	}
}
</style>
