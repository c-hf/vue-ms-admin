<template>
    <div class="home">
        <el-row :gutter="24">
            <el-col :span="24">
                <el-card :body-style="{display: 'flex',
                'justify-content': 'space-between',
                'align-items': 'center'}">
                    <div class="card-item on-line-device">
                        <span class="card-item-title">
                            在线设备
                        </span>
                        <span class="device-num">
                            {{ onLineDeviceNum }}
                            <i>台</i>
                        </span>
                    </div>
                    <div class="card-item line-device">
                        <span class="card-item-title">
                            离线设备
                        </span>
                        <span class="device-num">
                            {{ lineDeviceNum }}
                            <i>台</i>
                        </span>
                    </div>
                    <div class="card-item device-info">
                        <span class="card-item-title">
                            信息概览
                        </span>
                        <div class="card-item-content">
                            <span class="info device-info-num">
                                设备总数:
                                <i class="num">
                                    {{ TotalNum }}
                                </i>
                            </span>
                            <span class="info device-info-num">
                                家庭组总数:
                                <i class="num">
                                    {{ groupTotal }}
                                </i>
                            </span>
                            <span class="info device-info-num">
                                用户总数:
                                <i class="num">
                                    {{ userTotal }}
                                </i>
                            </span>
                        </div>

                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card :body-style="{height:'560px'}">
                    <el-scrollbar style="height:100%">
                        <el-table :data="familyData"
                                  stripe
                                  style="width: 100%">
                            <el-table-column label="家庭组"
                                             width="100">
                                <template>
                                    <div class="icon">
                                        <svg-icon iconClass="icon-house" />
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="groupId"
                                             label="GroupID"
                                             width="200">
                            </el-table-column>
                            <el-table-column prop="groupName"
                                             label="名称">
                            </el-table-column>
                            <el-table-column prop="ownerId"
                                             label="群主ID">
                            </el-table-column>
                            <el-table-column label="群成员数量">
                                <template slot-scope="scope">
                                    {{ scope.row.member.length }}
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-scrollbar>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card :body-style="{height:'560px'}">
                    <el-scrollbar style="height:100%">
                        <el-table :data="deviceData"
                                  stripe
                                  style="width: 100%">
                            <el-table-column type="index"
                                             width="50">
                            </el-table-column>
                            <el-table-column label="设备"
                                             width="80">
                                <template slot-scope="scope">
                                    <div class="icon">
                                        <svg-icon :iconClass="deviceIcon[scope.row.categoryItemId]" />
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="deviceId"
                                             label="DeviceID"
                                             width="200">
                            </el-table-column>
                            <el-table-column prop="groupId"
                                             label="GroupID">
                            </el-table-column>
                            <el-table-column prop="name"
                                             label="名称">
                            </el-table-column>
                            <el-table-column label="创建时间">
                                <template slot-scope="scope">
                                    {{ new Date(scope.row.createTime).toLocaleString('zh-CN', { hour12: false }) }}
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-scrollbar>
                </el-card>
            </el-col>
        </el-row>
    </div>

</template>

<script>
import {
	getDevicesNum,
	getGroupNum,
	getUserNum,
	getDevicesStatusNum,
	getGroup,
	getDevices,
} from '@/api/admin';
import { DEVICEICON } from '@/config';
export default {
	name: 'Home',
	data() {
		return {
			TotalNum: 0,
			groupTotal: 0,
			userTotal: 0,
			onLineDeviceNum: 0,
			lineDeviceNum: 0,
			familyData: [],
			deviceData: [],
			deviceIcon: DEVICEICON,
		};
	},
	methods: {
		getDevicesNumFn() {
			getDevicesNum().then(resData => {
				this.TotalNum = resData.total;
			});
		},
		getGroupNumFn() {
			getGroupNum().then(resData => {
				this.groupTotal = resData.total;
			});
		},
		getUserNumFn() {
			getUserNum().then(resData => {
				this.userTotal = resData.total;
			});
		},

		getDevicesStatusNumFn() {
			getDevicesStatusNum().then(resData => {
				this.onLineDeviceNum = resData.onLineDeviceNum;
				this.lineDeviceNum = resData.lineDeviceNum;
			});
		},

		getGroupFn() {
			this.loading = true;
			getGroup()
				.then(resData => {
					this.familyData = resData;
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

		getDevicesFn() {
			this.loading = true;
			getDevices()
				.then(resData => {
					this.deviceData = resData;
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

	created() {
		this.getDevicesNumFn();
		this.getGroupNumFn();
		this.getUserNumFn();
		this.getDevicesStatusNumFn();
		this.getGroupFn();
		this.getDevicesFn();
	},
};
</script>

<style lang="scss" scoped>
.home {
	background-color: inherit;
	.el-col {
		margin-bottom: 20px;
	}

	.card-item {
		width: 30%;
		height: 160px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: flex-start;

		&-title {
			font-size: 24px;
		}
	}

	.on-line-device,
	.line-device {
		padding: 0 40px;
		border-right: 1px solid #e4e7ed;

		.card-item-title {
			margin-left: 10px;
			position: relative;

			&::before {
				content: '';
				display: block;
				width: 10px;
				height: 10px;
				border-radius: 50%;
				background-color: rgba($color: #67c23a, $alpha: 1);
				position: absolute;
				left: -20px;
				top: 10px;
			}
		}

		.device-num {
			display: block;
			margin-left: 20%;
			font-size: 64px;
			i {
				font-style: normal;
				font-size: 16px;
				margin-left: 5px;
			}
		}
	}

	.line-device {
		.card-item-title {
			&::before {
				background-color: rgba($color: #f56c6c, $alpha: 1);
			}
		}
	}

	.device-info {
		padding: 0 40px;

		.card-item-content {
			width: 100%;
			@include flex-around();
		}

		.info {
			font-size: 18px;
			// margin-left: 10%;
			color: rgba(48, 49, 51, 0.6);

			i {
				margin-left: 10px;
			}
		}
	}

	.icon {
		width: 20px;
		height: 20px;
	}
}
</style>
