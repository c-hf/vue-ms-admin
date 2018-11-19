<template>
    <el-dialog :title="dialogTitle"
               center
               :close-on-click-modal="false"
               :visible.sync="dialogVisible"
               width="460px">
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
</template>

<script>
import storage from '@/assets/js/storage';

export default {
	name: 'DeviceDialog',
	data() {
		return {};
	},
	methods: {
		// 提交
		dialogSubmit(formName) {
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return false;
				}
				this.dbOperation(
					this.dialogMethod,
					this.getData(),
					this.dialogMsg
				).then(() => {
					this.$emit('setDialogInit');
					this.$refs[formName].resetFields();
				});
			});
		},

		// 取消
		onCancel(formName) {
			this.$refs[formName].resetFields();
			this.$emit('setDialogVisible', false);
		},

		// 数据库操作
		dbOperation(method, data, msg) {
			this.$emit('setLoading', true);
			return this.methods[method](data)
				.then(() => {
					this.$message({
						showClose: true,
						center: true,
						message: msg,
						type: 'success',
					});

					const [contents = {}, id, curTime] = [
						storage.get(this.storageKey),
						storage.get('id'),
						new Date().getTime(),
					];
					this.$emit('getDataByHttp', id, contents, curTime);
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
					this.$emit('setLoading', false);
				});
		},

		// data
		getData() {
			let reqData = {
				data: {},
			};
			this.dialogData.dialogFormItems.forEach(el => {
				el.id === 'categoryItemId'
					? (reqData[el.id] = el.value)
					: (reqData.data[el.id] = el.value);
			});
			return reqData;
		},
	},
	props: {
		// 标题
		dialogTitle: {
			type: String,
		},
		// 方法
		dialogMethod: {
			type: String,
		},
		// 成功提示 msg
		dialogMsg: {
			type: String,
		},
		// Data
		dialogData: {
			type: Object,
		},
		// 是否开启
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		// 方法集合
		methods: {
			type: Object,
		},
		// 存储关键字
		storageKey: {
			type: String,
		},
	},
};
</script>

<style lang="scss" scoped>
</style>
