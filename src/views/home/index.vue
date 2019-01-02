<template>
    <el-card class="home"
             shadow="never">
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
                        <span class="info device-info-num">
                            设备总数:
                            <i class="num">
                                {{ TotalNum }}
                            </i>
                        </span>
                        <span class="info device-info-warning">
                            告警信息:
                            <i>0</i>
                        </span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
export default {
	name: 'Home',
	data() {
		return {
			TotalNum: 22,
			onLineDeviceNum: 18,
			lineDeviceNum: 4,
		};
	},
	components: {},
};
</script>

<style lang="scss" scoped>
.home {
	background-color: inherit;

	.card-item {
		width: 30%;
		height: 160px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: flex-start;

		&-title {
			font-size: 16px;
		}
	}

	.card-item:nth-of-type(3) {
		width: 40%;
	}

	.on-line-device,
	.line-device {
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
				left: -15px;
				top: 6.4px;
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
		.info {
			font-size: 14px;
			margin-left: 10%;
			color: rgba(48, 49, 51, 0.6);

			i {
				margin-left: 10px;
			}
		}
	}
}
</style>
