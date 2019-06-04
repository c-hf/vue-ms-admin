<template>
    <section class="set">
        <el-tabs class="set-content"
                 type="border-card"
                 v-model="activeName">
            <el-tab-pane label="个人资料"
                         name="user">
                <view-user />
            </el-tab-pane>
        </el-tabs>
    </section>
</template>

<script>
import ViewUser from './components/user';

export default {
	name: 'Set',
	data() {
		return {
			activeName: 'user',
		};
	},

	components: {
		ViewUser,
	},
};
</script>

<style lang="scss" scoped>
.set {
	@include flex-direction();

	&-content {
		@include flex-direction();
		flex: 1;
	}
}
</style>

<style lang="scss">
.set {
	.el-tabs__content {
		flex: 1;
	}
}
</style>

