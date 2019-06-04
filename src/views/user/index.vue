<template>
    <div class="user">
        <div class="content"
             v-loading="loading">
            <el-table :data="tableData"
                      stripe
                      style="width: 100%">
                <el-table-column label="用户头像">
                    <template slot-scope="scope">
                        <div class="avatar">
                            <img :src="scope.row.avatar"
                                 alt="头像">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="userId"
                                 label="UserID">
                </el-table-column>
                <el-table-column prop="nickName"
                                 label="昵称">
                </el-table-column>
                <el-table-column prop="groupId"
                                 label="家庭组ID">
                </el-table-column>
                <el-table-column prop="intro"
                                 label="简介">
                </el-table-column>
                <el-table-column prop="sex"
                                 label="性别">
                </el-table-column>
                <el-table-column prop="birthday"
                                 label="出生年月日">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { getUser } from '@/api/admin';
export default {
	name: 'User',
	data() {
		return {
			loading: false,
			tableData: [],
		};
	},

	methods: {
		getUserFn() {
			this.loading = true;
			getUser()
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

	created() {
		this.getUserFn();
	},
};
</script>

<style lang="scss" scoped>
.user {
	display: flex;

	.content {
		flex: 1;
		display: flex;
		padding: 20px;
		@include info-card();

		.el-table {
			flex: 1;
		}

		.avatar {
			width: 60px;
			height: 60px;
			border-radius: 50%;

			img {
				border-radius: 50%;
			}
		}
	}
}
</style>
