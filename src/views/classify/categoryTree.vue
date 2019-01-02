<template>
    <el-card class="classify-tree-card">
        <div slot="header"
             class="classify-tree-card-header">
            <span class="classify-tree-card-header-title">
                设备分类
                <el-button type="info"
                           plain
                           @click="addData">添加分类</el-button>
            </span>
            <el-input placeholder="输入关键字进行过滤"
                      v-model="filterText">
            </el-input>
        </div>
        <div class="classify-tree-card-content">
            <el-scrollbar style="height:100%">
                <el-tree ref="tree"
                         :data="options"
                         :props="defaultProps"
                         node-key="id"
                         expand-on-click-node
                         :default-expanded-keys='[1]'
                         :filter-node-method="filterNode"
                         @node-click="nodeClick">
                    <span class="classify-tree-card-content-node"
                          slot-scope="{ node, data }">
                        <span>
                            {{ node.label }}
                        </span>
                        <span v-if="node.level === 1">
                            <el-button type="primary"
                                       circle
                                       size="mini"
                                       icon="el-icon-edit"
                                       @click="editData(data)">
                            </el-button>
                            <el-button type="danger"
                                       circle
                                       size="mini"
                                       icon="el-icon-delete"
                                       @click="deleteData(data)">
                            </el-button>
                        </span>
                    </span>
                </el-tree>
            </el-scrollbar>
        </div>
        <category-dialog :type="type"
                         :dialogData="dialogData"
                         :dialogVisible="dialogVisible"
                         @getLatestData="addSuccess"
                         @setDialogVisible="setDialogVisible" />
    </el-card>
</template>

<script>
import CategoryDialog from './categoryDialog';
import { deleteDeviceCategory } from '@/api/device';

export default {
	name: 'CategoryTree',
	data() {
		return {
			loading: false,
			edit: false,
			filterText: '',
			defaultProps: {
				children: 'categoryItem',
				label: 'name',
			},
			dialogVisible: false,
			type: 'category',
			dialogData: {
				categoryId: '',
				name: '',
			},
		};
	},

	computed: {},

	methods: {
		setDialogVisible(value) {
			this.dialogVisible = value;
		},

		// 添加
		addData() {
			this.type = 'category';
			this.dialogData = {
				categoryId: '',
				name: '',
			};
			this.dialogVisible = true;
		},

		// 修改
		editData(data) {
			this.type = 'updateCategory';
			this.dialogData = {
				categoryId: data.categoryId,
				name: data.name,
			};
			this.dialogVisible = true;
		},

		addSuccess() {
			this.$emit('getLatestData');
		},

		// 删除
		deleteData(data) {
			this.$confirm(`是否删除 ${data.name} 分类?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.deleteDeviceCategoryFn(data.categoryId);
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

		// 删除分类封装
		deleteDeviceCategoryFn(categoryId) {
			this.$emit('setLoading', true);
			deleteDeviceCategory(categoryId)
				.then(resData => {
					if (resData.ok) {
						this.$message({
							showClose: true,
							center: true,
							message: '删除成功！',
							type: 'success',
						});
						this.$emit('getLatestData', categoryId);
					}
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
					this.$emit('setLoading', false);
				});
		},

		// 节点点击回调
		nodeClick(data, node) {
			if (node.level === 1) {
				this.$emit('setCategory', data);
			} else if (node.level === 2) {
				this.$router.push({
					name: 'details',
					query: {
						name: data.name,
					},
					params: {
						categoryItemId: data.categoryItemId,
					},
				});
			}
		},

		// 节点过滤
		filterNode(value, data) {
			if (!value) return true;
			return data.name.indexOf(value) !== -1;
		},
	},

	props: {
		options: {
			type: Array,
		},

		nodeKey: {
			type: Number,
		},
	},

	components: {
		CategoryDialog,
	},

	watch: {
		filterText(val) {
			this.$refs.tree.filter(val);
		},
	},
};
</script>

<style lang="scss">
@import '~@/assets/scss/mixins';
.classify-tree-card {
	&-header {
		height: 100px;

		&-title {
			@include flex-between();
			margin-bottom: 20px;
		}
	}

	&-content {
		height: 420px;

		.el-tree {
			padding: 10px;

			&-node__content {
				height: 35px;
			}
		}

		&-node {
			width: 100%;
			font-size: 14px;
			@include flex-between();

			span:nth-of-type(1) {
				max-width: 60%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
}
</style>

