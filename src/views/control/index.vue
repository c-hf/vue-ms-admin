<template>
    <div class="control">
        <el-row>
            <el-col :span="24">
                <el-card class="device-list">
                    <div slot="header"
                         class="clearfix">
                        <span>设备列表</span>
                        <el-button size="small"
                                   icon="el-icon-plus"
                                   @click="routeAccess"
                                   plain>添加设备</el-button>
                    </div>
                    <el-input placeholder="请输入DeviceID..."
                              suffix-icon="el-icon-search"
                              v-model="searchInput">
                    </el-input>
                    <device-list></device-list>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import DeviceList from './List';

export default {
	name: 'DeviceControl', // 设备接入
	data() {
		return {
			searchInput: '',
		};
	},
	components: {
		DeviceList,
	},
	methods: {
		routeAccess() {
			this.$router.push({ name: 'access' });
		},
	},
};
</script>

<style lang="scss" scoped>
.control {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	background-color: #f3f6f8;

	.device-list {
		.clearfix {
			display: flex;
			justify-content: space-between;
			.header-item {
				width: 100%;
			}
		}
	}
	.el-input {
		width: 20%;
	}
}
</style>
