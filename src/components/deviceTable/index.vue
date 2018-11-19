<template>
    <div class="device-table">
        <el-table :data="device.data"
                  highlight-current-row
                  border
                  style="width: 100%;">
            <el-table-column v-for="(item, index) in tableData"
                             :key="index"
                             :prop="item.prop"
                             :label="item.label">
            </el-table-column>
            <el-table-column label="操作"
                             fixed="right">
                <template slot-scope="scope">
                    <el-button type="text"
                               size="mini"
                               @click="compileData(scope.row,device.categoryItemId)">
                        Compile
                    </el-button>
                    <el-button type="text"
                               size="mini"
                               @click="deleteData(scope.row,device.categoryItemId)">
                        Delete
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="device-table-add-btn">
            <el-button plain
                       @click="addData()">{{ addDataBtn }}</el-button>
        </div>
    </div>
</template>

<script>
export default {
	name: 'DeviceTable',
	data() {
		return {};
	},
	methods: {
		// 编辑
		compileData(data, categoryItemId) {
			this.$emit('compileData', data, categoryItemId);
		},

		// 添加
		addData() {
			this.$emit('addData');
		},

		// 删除
		deleteData(data, categoryItemId) {
			this.$confirm(`是否删除 ${data.id} - ${data.name} ?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					data = {
						categoryItemId: categoryItemId,
						id: data.id,
					};
					this.$emit('deleteData', data);
				})
				.catch(() => {
					this.$message({
						showClose: true,
						center: true,
						type: 'info',
						message: '已取消删除',
					});
				});
		},
	},
	props: {
		device: {
			type: Object,
		},
		tableData: {
			type: Array,
		},
		addDataBtn: {
			type: String,
		},
	},
};
</script>

<style lang="scss" scoped>
.device-table {
	&-add-btn {
		margin-top: 20px;
	}
}
</style>
