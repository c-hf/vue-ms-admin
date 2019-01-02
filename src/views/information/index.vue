<template>
    <div class="information">
        <el-col :span="12"
                class="information-col">
            <el-steps :active="active"
                      simple
                      finish-status="success"
                      style="margin: 30px 0;">
                <el-step title="个人信息"></el-step>
                <el-step title="创建家庭组"></el-step>
                <el-step title="开始使用"></el-step>
            </el-steps>

            <el-col :span="16"
                    :offset="4"
                    class="information-card">
                <information-personal @next="next"
                                      :personalData="personalData"
                                      v-if="active === 0" />
                <information-household @next="next"
                                       @prev="prev"
                                       v-else-if="active === 1" />
                <information-complete v-else
                                      :personalData="personalData"
                                      :householdGroupData="householdGroupData" />
            </el-col>
        </el-col>
    </div>
</template>

<script>
import InformationPersonal from './personal';
import InformationHousehold from './household';
import InformationComplete from './complete';

export default {
	name: 'Information',
	data() {
		return {
			active: 0,
			personalData: {
				avatar: '',
				sex: '',
				birthday: '',
			},
			householdGroupData: {
				groupName: '',
				region: [],
			},
		};
	},

	methods: {
		prev() {
			if (this.active-- < 0) this.active = 0;
		},
		next(data) {
			if (this.active === 0) {
				this.personalData = data;
			} else if (this.active === 1) {
				this.householdGroupData = data;
			}
			if (this.active++ > 2) this.active = 0;
		},
	},

	components: {
		InformationPersonal,
		InformationHousehold,
		InformationComplete,
	},
};
</script>

<style lang="scss">
@import '~@/assets/scss/mixins';

.information {
	width: 100%;
	height: 100%;
	background-color: #f5f7fa;

	@include flex-center();

	.information-col {
		height: 100%;

		.information-card {
			height: 580px;
			background-color: #fff;
			border-radius: 6px;
			box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.2);
		}
	}
}
</style>
