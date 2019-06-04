<template>
    <div class="classify"
         v-loading="loading">
        <div class="left">
            <category-tree :options="options"
                           @setLoading="setLoading"
                           @setCategory="setCategory"
                           @getLatestData="getAllDeviceCategoryFn" />
        </div>
        <div class="right">
            <category-card ref="categoryCard"
                           :category="category"
                           @setLoading="setLoading"
                           @getLatestData="getDeviceCategoryByIdFn" />
        </div>
    </div>
</template>

<script>
import { getAllDeviceCategory, getDeviceCategoryById } from '@/api/device';

import CategoryCard from './categoryCard';
import CategoryTree from './categoryTree';

export default {
	name: 'DeviceClassify',
	data() {
		return {
			loading: false,
			options: [],
			category: {},
		};
	},

	computed: {},

	methods: {
		// loading
		setLoading(value) {
			this.loading = value;
		},

		//
		setCategory(data) {
			this.dialogVisible = false;
			this.category = data;
		},

		// 获取分类信息
		getDeviceCategoryByIdFn(categoryId) {
			this.loading = true;
			getDeviceCategoryById(categoryId)
				.then(resData => {
					const index = this.options.findIndex(value => {
						return value.categoryId === resData.categoryId;
					});
					if (index === -1) {
						this.addOption(resData);
						this.$store.dispatch('addCategory', resData);
					} else {
						this.editOption(resData, index);
						this.$store.dispatch('updateCategory', resData);
					}
					this.category = resData;
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

		// 获取全部分类信息
		getAllDeviceCategoryFn() {
			this.loading = true;
			getAllDeviceCategory()
				.then(resData => {
					this.category = resData[0];
					this.setOption(resData);
					this.$store.dispatch('category', resData);
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

		setOption(data) {
			this.options = [];
			data.forEach((el, index) => {
				this.options.push({
					id: index + 1,
					categoryId: el.categoryId,
					name: el.name,
					categoryItem: el.categoryItem,
				});
			});
		},

		addOption(data) {
			this.options.push({
				id: this.options.length + 1,
				categoryId: data.categoryId,
				name: data.name,
				categoryItem: data.categoryItem,
			});
		},

		editOption(data, index) {
			data.id = index + 1;
			this.options.splice(index, 1, data);
		},
	},

	components: {
		CategoryCard,
		CategoryTree,
	},

	created() {
		this.getAllDeviceCategoryFn();
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';
.classify {
	@include flex-center();
	align-items: flex-start;

	.left {
		width: 35%;
		height: 100%;
		padding-right: 10px;
		box-sizing: border-box;
	}

	.right {
		width: 65%;
		height: 100%;
		padding-left: 10px;
		box-sizing: border-box;
	}

	// &-content {
	// 	background-color: #f3f6f8;
	// }

	// &-card {
	// 	margin-bottom: 20px;

	// 	&-content {
	// 		height: 100px;
	// 	}
	// }

	// &-left-card {
	// 	&-footer {
	// 		padding-top: 37px;
	// 	}
	// }

	// &-add-category {
	// 	width: 60px;
	// 	height: 60px;
	// 	position: fixed;
	// 	right: 3%;
	// 	bottom: 10%;
	// 	&:hover {
	// 		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	// 	}
	// }
}
</style>
