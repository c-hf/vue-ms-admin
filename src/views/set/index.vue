<template>
    <el-card class="box-card">
        <el-col :span="18"
                :offset="3">
            <el-tabs v-model="activeName"
                     @tab-click="handleClick">
                <el-tab-pane label="个人资料"
                             name="first">个人资料</el-tab-pane>
                <el-tab-pane label="系统设置"
                             name="second">系统设置</el-tab-pane>
            </el-tabs>
        </el-col>
    </el-card>
</template>

<script>
export default {
	name: 'Set',
	data() {
		return {
			activeName: 'first',
		};
	},
	methods: {
		handleClick(tab, event) {
			console.log(tab, event);
		},
	},
};
</script>

<style lang="scss" scoped>
</style>
