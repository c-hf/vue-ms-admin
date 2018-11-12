<template>
    <el-table ref="multipleTable"
              class="device-list"
              :data="tableData"
              highlight-current-row
              tooltip-effect="dark"
              :default-sort="{prop:'最后活跃时间',order: 'ascending'}"
              style="width: 100%">

        <el-table-column type="selection"
                         width="30">
        </el-table-column>
        <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left"
                         inline
                         class="device-list-table-expand">
                    <el-form-item label="DeviceID">
                        <span>{{ props.row.id }}</span>
                    </el-form-item>
                    <el-form-item label="名称">
                        <span>{{ props.row.name }}</span>
                    </el-form-item>
                    <el-form-item label="描述">
                        <span>{{ props.row.description }}</span>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <span>{{ props.row.createDate }}</span>
                    </el-form-item>
                    <el-form-item label="最后活跃时间">
                        <span>{{ props.row.LastActiveTime }}</span>
                    </el-form-item>
                </el-form>
            </template>
        </el-table-column>
        <el-table-column label="DeviceID">
            <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column prop="name"
                         label="名称">
        </el-table-column>
        <el-table-column prop="type"
                         label="节点类型">
        </el-table-column>
        <el-table-column prop="status"
                         label="状态">
        </el-table-column>
        <el-table-column prop="LastActiveTime"
                         label="最后活跃时间"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作"
                         width="200">
            <template slot-scope="scope">
                <el-tooltip class="item"
                            effect="dark"
                            content="编辑"
                            placement="top">
                    <el-button size="mini"
                               icon="el-icon-edit-outline"
                               circle
                               @click="handleEdit(scope.$index, scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item"
                            effect="dark"
                            content="删除"
                            placement="top">
                    <el-button size="mini"
                               icon="el-icon-delete"
                               circle
                               @click="handleDelete(scope.$index, scope.row)"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { TABLEDATA } from './config.js';

export default {
	name: 'DeviceList',
	data() {
		return {
			tableData: TABLEDATA,
			multipleSelection: [],
		};
	},
	methods: {
		handleEdit(index, row) {
			console.log(index);
			console.log(row);
		},
		handleDelete(index, row) {
			console.log(index);
			console.log(row);
		},
	},
};
</script>

<style lang="scss">
.device-list {
	&-table-expand {
		font-size: 0;
		padding-left: 50px;

		.el-form-item {
			width: 50%;
			margin-right: 0;
			margin-bottom: 0;

			&__label {
				width: 100px;
				color: #99a9bf;
			}
		}
	}
}
</style>
