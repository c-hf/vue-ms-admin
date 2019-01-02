<template>
    <el-form class="device-table"
             ref="form"
             :model="deviceData"
             :rules="rules"
             v-loading="loading"
             label-width="0">
        <el-scrollbar style="height:100%">
            <el-table class="device-table-content"
                      :data="deviceData.data"
                      :row-style="categoryStyle"
                      highlight-current-row
                      @cell-click="cellClick">
                <el-table-column type="index"
                                 :index="index">
                </el-table-column>
                <el-table-column v-for="(item, index) in table"
                                 :key="index"
                                 :label="item.label">
                    <template slot-scope="scope">
                        <span v-if="!editFlag">
                            {{ scope.row[item.prop] }}
                        </span>
                        <el-form-item v-else-if="item.prop === 'attrType'"
                                      :prop="'data.' + scope.$index + '.' + item.prop"
                                      :rules="rules[item.prop]">
                            <el-select v-model="scope.row[item.prop]"
                                       clearable
                                       placeholder="请选择"
                                       @change="change(scope.$index)">
                                <el-option v-for="item in options"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value"
                                           :disabled="item.disabled">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-else-if="item.prop === 'value' && scope.row.attrType ==='Boolean' "
                                      :prop="'data.'+scope.$index+'.'+item.prop"
                                      :rules="rules[item.prop]">
                            <el-switch v-model="scope.row[item.prop]"
                                       active-color="#13ce66"
                                       inactive-color="#ff4949"
                                       active-text="True"
                                       inactive-text="False">
                            </el-switch>
                        </el-form-item>
                        <el-form-item v-else-if="item.prop === 'value' && scope.row.attrType ==='Number' "
                                      :prop="'data.'+scope.$index+'.'+item.prop"
                                      :rules="rules[item.prop]">
                            <el-input v-model.number="scope.row[item.prop]"
                                      required>
                            </el-input>
                        </el-form-item>
                        <el-form-item v-else
                                      :prop="'data.'+scope.$index+'.'+item.prop"
                                      :rules="rules[item.prop]">
                            <el-input :disabled="item.prop === 'id' || item.prop === 'categoryId'"
                                      v-model="scope.row[item.prop]"
                                      required>
                            </el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="操作"
                                 fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   size="mini"
                                   @click="deleteData(scope.row,scope.$index)">
                            Delete
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-scrollbar>
    </el-form>
</template>

<script>
import { OPTIONS, RULES } from '@/config';

export default {
	name: 'DeviceTable',
	data() {
		return {
			loading: false,
			rules: RULES,
			options: OPTIONS,
			deviceData: this.device,
		};
	},

	computed: {
		editFlag() {
			return this.edit;
		},
	},

	methods: {
		index(index) {
			return index + 1;
		},
		// 设置行样式
		categoryStyle(row) {
			if (!this.edit && row.row.categoryId) {
				return { cursor: 'pointer' };
			}
			return;
		},

		// Select
		change(index) {
			this.deviceData.data[index].value = String(
				this.deviceData.data[index].value
			);
		},

		// 点击跳转
		cellClick(row, column) {
			if (!this.edit && row.categoryId && column.label !== '操作') {
				this.$router.push({
					name: 'details',
					query: {
						name: row.name,
					},
					params: {
						categoryItemId: row.categoryItemId,
					},
				});
			}
		},

		// 添加
		addData() {
			this.$emit('addData');
		},

		// 删除
		deleteData(data, index) {
			this.$confirm(`是否删除${data.name} ?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				if (this.edit && !data.categoryId) {
					this.deviceData.data.splice(index, 1);
					return;
				}

				if (data.categoryId) {
					data = {
						categoryId: this.deviceData.categoryId,
						categoryItemId: data.categoryItemId,
					};
				} else {
					data = {
						categoryItemId: this.deviceData.categoryItemId,
						id: data.id,
					};
				}
				this.$emit('deleteData', data);
			});
		},
	},

	props: {
		device: {
			type: Object,
		},

		table: {
			type: Array,
		},

		edit: {
			type: Boolean,
		},
	},

	watch: {
		device(newVal) {
			this.deviceData = newVal;
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';
.device-table {
	height: 420px;

	.el-form-item {
		margin: 18px 0;
	}
}
</style>
