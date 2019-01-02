<template>
    <div class="information-household">
        <div class="information-household-title">
            <span class="information-household-title-icon"></span>
        </div>
        <el-form :model="group"
                 :rules="rules"
                 ref="groupForm"
                 class="information-household-form"
                 label-position="top"
                 label-width="0">
            <span class="information-household-form-text">
                家庭名称
            </span>
            <el-form-item prop="groupName">
                <el-input placeholder="名称"
                          v-model="group.groupName"
                          clearable
                          style="width: 240px;">
                </el-input>
            </el-form-item>
            <span class="information-household-form-text">
                选择居住地
            </span>
            <el-form-item prop="region">
                <el-cascader placeholder="居住地"
                             :options="regionOptions"
                             v-model="group.region"
                             @active-item-change="regionItemChange"
                             style="width: 240px;"></el-cascader>
            </el-form-item>
            <el-form-item class="information-household-form-btn">
                <el-button type="info"
                           @click="prev">上一步
                    <i class="el-icon-arrow-left el-icon--right"></i>
                </el-button>
                <el-button type="success"
                           @click="next('groupForm')">下一步
                    <i class="el-icon-arrow-right el-icon--right"></i>
                </el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
import { getProvinceInfo, getCityInfo, getDistrictInfo } from '@/api/user';
import { RULES } from './config.js';

export default {
	name: 'InformationHousehold',
	data() {
		return {
			group: {
				groupName: `${this.$store.state.user.nickName} 的家`,
				region: [],
			},
			regionOptions: [],
			rules: RULES,
			provinceindex: null,
			cityindex: null,
		};
	},
	methods: {
		regionItemChange(value) {
			if (value.length === 1) {
				this.getCityInfoFn(value);
			} else {
				this.getDistrictInfoFn(value);
			}
		},

		prev() {
			this.$emit('prev');
		},

		next(formName) {
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return;
				}
				this.setRegion();
				this.$emit('next', this.group);
			});
		},

		// 查找省
		getProvinceInfoFn() {
			getProvinceInfo({ type: 'province', adcode: '' }).then(resData => {
				this.regionOptions = resData;
			});
		},

		// 查找市
		getCityInfoFn(value) {
			this.provinceindex = this.regionOptions.findIndex(el => {
				return el.value === value[0];
			});
			if (this.regionOptions[this.provinceindex].children.length) {
				return;
			}

			getCityInfo({ adcode: value[0] }).then(resData => {
				this.regionOptions[this.provinceindex].children = resData;
			});
		},

		// 查找县/区
		getDistrictInfoFn(value) {
			this.provinceindex = this.regionOptions.findIndex(el => {
				return el.value === value[0];
			});
			this.cityindex = this.regionOptions[
				this.provinceindex
			].children.findIndex(el => {
				return el.value === value[1];
			});

			if (
				this.regionOptions[this.provinceindex].children[this.cityindex]
					.children.length
			) {
				return;
			}
			getDistrictInfo({ adcode: value[1] }).then(resData => {
				this.regionOptions[this.provinceindex].children[
					this.cityindex
				].children = resData;
			});
		},

		// 设置 region
		setRegion() {
			const districtIndex = this.regionOptions[
				this.provinceindex
			].children[this.cityindex].children.findIndex(el => {
				return el.value === this.group.region[2];
			});
			const reqion = [
				{
					adcode: this.group.region[0],
					name: this.regionOptions[this.provinceindex].label,
				},
				{
					adcode: this.group.region[1],
					name: this.regionOptions[this.provinceindex].children[
						this.cityindex
					].label,
				},
				{
					adcode: this.group.region[2],
					name: this.regionOptions[this.provinceindex].children[
						this.cityindex
					].children[districtIndex].label,
				},
			];
			this.group.region = reqion;
		},
	},
	created() {
		this.getProvinceInfoFn();
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';

.information-household {
	height: 100%;
	position: relative;

	@include flex-center(column);
	justify-content: flex-start;

	&-title {
		width: 100%;
		height: 120px;
		margin-top: 60px;

		@include flex-center(column);

		&-icon {
			display: block;
			width: 120px;
			height: 120px;
			border-radius: 50%;
			border: 2px solid rgba(151, 140, 140, 0.4);
			box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
			background-image: url(~@/assets/img/information/house.svg);
			background-color: rgba($color: #d7dada, $alpha: 0.3);
			background-size: 70% 70%;
			background-position: center center;
			background-repeat: no-repeat;
		}

		&-text {
			display: block;
			height: 20px;
			margin-top: 20px;
			color: #909399;
		}
	}

	&-form {
		width: 80%;
		height: 360px;
		display: flex;
		align-items: center;
		flex-direction: column;
		position: relative;
		margin-top: 40px;

		&-text {
			color: #909399;
			margin-bottom: 20px;
		}

		&-btn {
			margin: 0;
			font-size: 16px;
			position: absolute;
			bottom: 70px;

			.el-button {
				width: 160px;
				font-size: 16px;
			}
		}
	}
}
</style>
