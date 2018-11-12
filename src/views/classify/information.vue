<template>
    <div class="access-information"
         v-loading="loading">
        <el-row>
            <el-col :span="24">
                <el-card class="device-list">
                    <div slot="header"
                         class="clearfix">
                        <span>设备信息</span>
                    </div>
                    <el-form ref="deviceForm"
                             :model="deviceData"
                             :rules="rules"
                             label-position="left"
                             label-width="120px">

                        <el-form-item label="DeviceID:"
                                      prop="id"
                                      class="device-id">
                            <el-col :span="8">
                                <span class="device-id">{{ deviceData.id }}</span>
                            </el-col>
                            <el-col :span="2">
                                <el-button icon="el-icon-refresh"
                                           size="mini"
                                           :loading="getIdLoading"
                                           @click="getId"
                                           circle></el-button>
                            </el-col>
                        </el-form-item>

                        <el-form-item label="设备名称:"
                                      prop="name">
                            <el-col :span="8">
                                <el-input v-model="deviceData.name"
                                          placeholder="最多输入 16 个字符"></el-input>
                            </el-col>
                        </el-form-item>

                        <el-form-item label="设备类型:"
                                      prop="type">
                            <el-col :span="8">
                                <el-cascader :options="options"
                                             :show-all-levels="true"
                                             v-model="deviceData.type"></el-cascader>
                            </el-col>
                        </el-form-item>

                        <el-form-item label="设备描述:"
                                      prop="desc">
                            <el-col :span="8">
                                <el-input type="textarea"
                                          :autosize="{ minRows: 4, maxRows: 6}"
                                          v-model="deviceData.desc"></el-input>
                            </el-col>
                        </el-form-item>

                        <el-form-item label="操作系统"
                                      prop="os">
                            <el-radio-group v-model="deviceData.os">
                                <el-radio label="Linux"></el-radio>
                                <el-radio label="Android"
                                          disabled></el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="联网方式"
                                      prop="networking">
                            <el-radio-group v-model="deviceData.networking">
                                <el-radio label="wifi"></el-radio>
                                <el-radio label="移动蜂窝网络"
                                          disabled></el-radio>
                                <el-radio label="NB-IoT"
                                          disabled>
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="设备接入协议"
                                      prop="protocol">
                            <el-col :span="4">
                                <el-select v-model="deviceData.protocol"
                                           @change="setProtocol"
                                           placeholder="请选择">
                                    <el-option label="HTTP"
                                               value="HTTP"></el-option>
                                    <el-option label="MQTT"
                                               value="MQTT"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="8"
                                    :offset="1">
                                <div class="device-protocol"
                                     v-show="deviceData.protocol">
                                    <h5>{{ deviceData.protocol }} 基本功能：</h5>
                                    <span>{{ protocolIntro }}</span>
                                </div>
                            </el-col>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary"
                                       @click="submitForm('deviceForm')">下一步</el-button>
                            <el-button @click="resetForm('deviceForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {
	RULES,
	INFORMATION_DATA_KEY,
	CATEGORY_CONTENT_UPDATE_TIME_INTERVAL,
} from './config.js';
import { getDeviceCategoryInfo, getDeviceId } from '@/api/device';
import storage from '@/assets/js/storage';

export default {
	name: 'AccessInformation',
	data() {
		return {
			// 表单信息
			deviceData: {
				id: '',
				name: '',
				type: [],
				desc: '',
				os: 'Linux',
				networking: 'wifi',
				protocol: '',
			},
			// 验证规则
			rules: RULES,
			// 数据源
			options: [],
			protocolIntro: '',
			loading: false,
			getIdLoading: false,
			custom: false,
		};
	},
	methods: {
		// 获取设备id
		getId() {
			this.getIdLoading = true;
			getDeviceId()
				.then(data => {
					this.deviceData.id = data.deviceId;
					this.getIdLoading = false;
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
					this.getIdLoading = false;
				});
		},
		// 获取设备分类
		getInfo() {
			this.loading = true;
			let [contents = {}, id, updateTime] = [
				storage.get(INFORMATION_DATA_KEY),
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
		// 设置 intro 信息
		setProtocol(value) {
			if (value === 'MQTT') {
				this.protocolIntro =
					'1、上传设备状态信息    2、订阅自定义TOPIC    3、接收实时消息或离线消息';
			} else if (value === 'HTTP') {
				this.protocolIntro = '1、上传设备状态信息';
			}
		},
		// 提交按钮事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$emit('infoSubmit', this.deviceData, this.custom);
				} else {
					return false;
				}
			});
		},
		// 重置按钮事件
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		// http获取设备分类
		getInfoByHttp(id, contents, updateTime) {
			getDeviceCategoryInfo()
				.then(data => {
					this.setOptions(data);
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
			storage.set(INFORMATION_DATA_KEY, contents);
		},
		// 设置 options
		setOptions(data) {
			data.forEach(el => {
				let optionItem = {};
				optionItem.value = el.categoryId;
				optionItem.label = el.name;
				optionItem.children = [];
				el.categoryItem.forEach(el => {
					let childrenItem = {};
					childrenItem.value = el.categoryItemId;
					childrenItem.label = el.name;
					optionItem.children.push(childrenItem);
				});
				this.options.push(optionItem);
			});
		},
	},
	created() {
		this.getId();
		this.getInfo();
	},
};
</script>

<style lang="scss" scoped>
.access-information {
	.el-form {
		padding-left: 8%;

		.device-id {
			width: 100%;
			display: block;
			.el-button {
				margin-left: 10px;
			}
		}

		.device-protocol {
			height: 40px;
			display: flex;
			flex-direction: column;

			h5 {
				height: 50%;
				line-height: 20px;
			}
			span {
				height: 50%;
				display: block;
				font-size: 10px;
				line-height: 20px;
			}
		}
	}
}
</style>
