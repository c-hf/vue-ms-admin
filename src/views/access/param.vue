<template>
    <div class="access-param">
        <el-row>
            <el-col :span="24">
                <el-card class="device-list">
                    <div slot="header"
                         class="clearfix">
                        <span>{{ name }} 属性参数</span>
                    </div>
                    <el-form ref="deviceForm"
                             label-position="left"
                             label-width="115px"
                             class="device-form">
                        <el-form-item v-for="(item, index) in deviceParam"
                                      :key="index"
                                      :label="item.name">
                            <el-col :span="6">
                                <span>{{ item.value }}<i v-show="item.unit"> {{ item.unit }}</i></span>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="属性">
                            <el-table :data="deviceAttr"
                                      highlight-current-row
                                      style="width: 90%;">
                                <el-table-column prop="id"
                                                 label="属性名称">
                                </el-table-column>
                                <el-table-column prop="name"
                                                 label="显示名称">
                                </el-table-column>
                                <el-table-column prop="type"
                                                 label="类型">
                                </el-table-column>
                                <el-table-column prop="attr"
                                                 label="值">
                                </el-table-column>
                                <el-table-column prop="unit"
                                                 label="单位">
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button v-if="!custom"
                                                   type="text"
                                                   size="mini"
                                                   disabled>
                                            Delete
                                        </el-button>
                                        <el-button v-else
                                                   type="text"
                                                   size="mini">
                                            Delete
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                        <el-form-item>
                            <el-button plain
                                       :disabled="disabled"
                                       @click="dialogVisible = true">添加属性</el-button>

                        </el-form-item>
                    </el-form>
                    <div class="device-list-btn">
                        <el-button type="primary"
                                   @click="submitForm('deviceForm')">创建</el-button>
                        <el-button @click="resetForm('deviceForm')">上一步</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog title="添加参数"
                   center
                   :visible.sync="dialogVisible"
                   width="460px"
                   :before-close="handleClose">
            <el-form :model="attr"
                     :rules="rules"
                     label-width="80px"
                     label-position="left">
                <el-form-item label="参数名称"
                              prop="attr">
                    <el-input placeholder="请输入参数名称"
                              v-model="attr.id">
                    </el-input>
                </el-form-item>
                <el-form-item label="显示名称"
                              prop="attr">
                    <el-input placeholder="请输入显示名称"
                              v-model="attr.name">
                    </el-input>
                </el-form-item>
                <el-form-item label="类型"
                              prop="attr">
                    <el-input placeholder="请选择类型"
                              v-model="attr.type">
                    </el-input>
                </el-form-item>
                <el-form-item label="参数值"
                              prop="attr">
                    <el-input placeholder="请输入参数值"
                              v-model="attr.value">
                    </el-input>
                </el-form-item>
                <el-form-item label="单位">
                    <el-input placeholder="请输入单位"
                              v-model="attr.unit">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer"
                  class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
	name: 'AccessParam',
	data() {
		return {
			disabled: false,
			dialogVisible: false,
			attr: {},
			rules: {
				attr: [
					{
						required: true,
						message: '此项为必填项',
						trigger: 'blur',
					},
				],
			},
			deviceParam: [
				{
					id: 'type',
					name: '设备分类',
					value: '照明 - 吸顶灯',
					unit: null,
				},
				{
					id: 'model',
					name: '型号',
					value: '9290012681',
					unit: null,
				},
				{
					id: 'voltage',
					name: '额定电压',
					value: '100 - 240',
					unit: 'V',
				},
				{
					id: 'frequency',
					name: '额定频率',
					value: '50/60',
					unit: 'HZ',
				},
				{
					id: 'current',
					name: '额定电流',
					value: '0.3',
					unit: 'A',
				},
				{
					id: 'power',
					name: '额定功率',
					value: '10',
					unit: 'W',
				},
				{
					id: 'wifi',
					name: 'Wi-Fi 模组',
					value: 'Wi-Fi IEEE 802.11 b/g/n 2.4G',
					unit: null,
				},
			],
			deviceAttr: [
				{
					id: 'activate',
					name: '是否激活',
					type: 'Boolean',
					attr: 'true',
					unit: null,
				},
				{
					id: 'status',
					name: '状态',
					type: 'String',
					attr: '在线',
					unit: null,
				},
				{
					id: 'switch',
					name: '开关',
					type: 'Boolean',
					attr: 'true',
					unit: null,
				},
				{
					id: 'luminance',
					name: '亮度',
					type: 'Number',
					attr: 45,
					unit: '%',
				},
				{
					id: 'delay',
					name: '延时关灯',
					type: 'Number',
					attr: 0,
					unit: '分',
				},
				{
					id: 'runTime',
					name: '运行时间',
					type: 'Number',
					attr: 0,
					unit: '分',
				},
				{
					id: 'totalRunningTime',
					name: '总运行时间',
					type: 'Number',
					attr: 0,
					unit: '分',
				},
			],
		};
	},
	props: {
		name: {
			type: String,
			default: '设备',
		},
		custom: {
			tyep: Boolean,
			default: false,
		},
	},
	methods: {
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then(info => {
					console.log(info);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		},
		// 提交按钮事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$emit('infoSubmit', this.device);
				} else {
					return false;
				}
			});
		},
		// 重置按钮事件
		resetForm() {
			this.$emit('setInfo');
		},
	},
};
</script>

<style lang="scss" scoped>
.access-param {
	.device-form {
		// width: 100%;
		padding-left: 8%;

		.title {
			margin-left: -0%;
		}
		.el-table {
			border: 1px solid #ebeef5;
			border-bottom: none;
		}
	}
	.device-list-btn {
		padding-left: 8%;
		padding-top: 50px;
		padding-bottom: 50px;
	}
}
</style>
