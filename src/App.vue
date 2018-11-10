<template>
    <div id="app">
        <el-container class="app-container">
            <el-header class="app-header">
                <app-header :user="user"
                            :title="title"
                            @setCollapse="setCollapse" />
            </el-header>
            <el-container class="app-content">
                <el-aside :style="{width: `${width}px`}">
                    <app-aside :isCollapse="isCollapse"
                               :user="user"
                               @setTitle="setTitle" />
                </el-aside>
                <el-main class="app-main">
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import AppHeader from '@/components/header';
import AppAside from '@/components/aside';
import { userInfo } from '@/api/user';

export default {
	data() {
		return {
			title: '首页',
			isCollapse: false,
			width: 220,
			user: {},
		};
	},
	components: {
		AppHeader,
		AppAside,
	},

	methods: {
		setTitle(title) {
			this.title = title;
		},
		setCollapse() {
			if (this.isCollapse) {
				this.isCollapse = false;
				this.width = 220;
				return;
			}
			this.isCollapse = true;
			this.width = 64;
		},
	},
	created() {
		userInfo()
			.then(data => {
				if (data !== 'ok') {
					this.user = data;
					this.$store.dispatch('user', data);
				}
			})
			.catch(error => {
				this.$message({
					showClose: true,
					center: true,
					message: error.message,
					type: 'error',
				});
			});
	},
	updated() {
		if (!this.user.nickName) {
			// console.log(this.user);
			this.user = this.$store.state.user;
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
