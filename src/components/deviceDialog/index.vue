<template>
    <el-dialog custom-class="dialog"
               title="添加"
               :close-on-click-modal="true"
               :visible.sync="visible"
               :before-close="dialogClose"
               width="500px">
        <el-form class="dialog-form"
                 ref="dialogForm"
                 :rules="rules"
                 :model="formData"
                 label-width="100px"
                 label-position="left">
            <el-form-item label="分类设备 ID"
                          prop="categoryItemId">
                <el-input v-model="formData.categoryItemId"
                          :disabled="type !== 'categoryItem'">
                </el-input>
            </el-form-item>
            <el-form-item :label="idName"
                          prop="id">
                <el-input v-model="formData.id">
                </el-input>
            </el-form-item>
            <el-form-item label="名称"
                          prop="name">
                <el-input v-model="formData.name">
                </el-input>
            </el-form-item>
            <el-form-item v-if="type === 'attr'"
                          label="类型"
                          prop="attrType">
                <el-select v-model="formData.attrType"
                           clearable
                           placeholder="请选择"
                           @change="change">
                    <el-option v-for="item in options"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"
                               :disabled="item.disabled">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="默认值"
                          prop="value">
                <el-switch v-if="formData.attrType === 'Boolean'"
                           v-model="formData.value"
                           active-color="#13ce66"
                           inactive-color="#ff4949"
                           active-text="True"
                           inactive-text="False">
                </el-switch>
                <el-input v-else-if="formData.attrType === 'Number'"
                          v-model.number="formData.value">
                </el-input>
                <el-input v-else
                          v-model="formData.value">
                </el-input>
            </el-form-item>
            <el-form-item label="单位">
                <el-input v-model="formData.unit">
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
import { OPTIONS, RULES } from '@/config';

export default {
	name: 'DeviceDialog',
	data() {
		return {
			visible: this.dialogVisible,
			formData: this.dialogData,
			options: OPTIONS,
			rules: RULES,
		};
	},

	computed: {
		idName() {
			const name = {
				attr: '属性 ID',
				param: '参数 ID',
			};
			return name[this.type];
		},
	},

	methods: {
		// Select
		change(newVal) {
			const value = {
				Boolean: false,
				String: '',
				Number: 0,
			};
			this.formData.value = value[newVal];
		},

		// 提交
		dialogSubmit(formName) {
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return;
				}
				const deviceData = this.getData();
				if (
					this.type === 'attr' &&
					this.formData.attrType === 'Number' &&
					isNaN(deviceData.data.value)
				) {
					this.$message({
						showClose: true,
						center: true,
						message: '请按类型填入默认值！',
						type: 'error',
					});
					return;
				}
				this.$emit('addData', deviceData);
				this.$refs[formName].resetFields();
				this.visible = false;
			});
		},

		// 关闭
		dialogClose(done) {
			this.$confirm('确认关闭？')
				.then(() => {
					this.$refs.dialogForm.resetFields();
					done();
				})
				.catch(error => {
					if (error) {
						return false;
					}
				});
		},

		// 取消
		onCancel(formName) {
			this.$refs[formName].resetFields();
			this.visible = false;
		},

		// data
		getData() {
			let reqData = { categoryItemId: '', data: {} };
			Object.keys(this.formData).forEach(el => {
				if (el === 'categoryItemId') {
					reqData.categoryItemId = this.formData.categoryItemId;
				} else {
					reqData.data[el] = this.formData[el];
				}
			});
			return reqData;
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
