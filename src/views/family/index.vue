<template>
    <div class="family">
        <div class="content"
             v-loading="loading">
            <el-table :data="tableData"
                      stripe
                      style="width: 100%">
                <el-table-column type="index"
                                 width="50">
                </el-table-column>
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
                <el-table-column label="所在地">
                    <template slot-scope="scope">
                        {{ scope.row.region[0].name }}
                        {{ scope.row.region[1].name }}
                        {{ scope.row.region[2].name }}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="scope">
                        {{ new Date(scope.row.createTime).toLocaleString('zh-CN', { hour12: false }) }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { getGroup } from '@/api/admin';

export default {
	name: 'Family',
	data() {
		return {
			loading: false,
			tableData: [],
		};
	},

	computed: {},

	methods: {
		getGroupFn() {
			this.loading = true;
			getGroup()
				.then(resData => {
					this.tableData = resData;
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

	components: {},

	props: {},

	watch: {},

	created() {
		this.getGroupFn();
	},

	mounted() {},
};
</script>

<style lang="scss" scoped>
.family {
	display: flex;

	.content {
		flex: 1;
		display: flex;
		padding: 20px;
		@include info-card();

		.el-table {
			flex: 1;
		}

		.icon {
			width: 40px;
			height: 40px;
			// border-radius: 50%;
		}
	}
}
</style>
