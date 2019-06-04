<template>
    <el-container class="app-container"
                  v-loading="loading">
        <el-header class="app-header">
            <app-header ref="appHeader"
                        :user="user"
                        :width="width"
                        :disabled="setDisabled"
                        @setCollapse="setCollapse"
                        @signOut="signOut" />
        </el-header>
        <el-container class="app-content">
            <el-aside class="app-aside"
                      :style="{width: `${width}px`}">
                <app-aside :isCollapse="isCollapse"
                           :user="user"
                           @signOut="signOut" />
            </el-aside>
            <el-scrollbar style="height:100%; width:100%;">
                <el-main class="app-main">
                    <div class="app-main-title">
                        <span class="app-main-title-text">
                            {{ breadcrumb.name }}
                        </span>
                        <el-breadcrumb separator-class="el-icon-arrow-right"
                                       class="app-main-title-breadcrumb">
                            <el-breadcrumb-item :to="{ path: '/home' }">
                                智家管理员后台
                            </el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: item.path }"
                                                v-for="(item, index) in breadcrumb.data"
                                                :key="index">
                                {{ item.name }}
                            </el-breadcrumb-item>
                            <el-breadcrumb-item>
                                {{ breadcrumb.name }}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <transition name="router"
                                mode="out-in">
                        <router-view class="app-main-content" />
                    </transition>
                </el-main>
                <el-footer class="app-footer">
                    Smart Home Admin &copy; 2019 chf
                </el-footer>
            </el-scrollbar>
        </el-container>
    </el-container>
</template>
<script>
import AppHeader from '@/components/appHeader';
import AppAside from '@/components/appAside';

import storage from '@/assets/js/storage';
import { signOut } from '@/api/user';

export default {
	name: 'Index',
	data() {
		return {
			loading: false,
			isCollapse: false,
			setDisabled: false,
			width: 220,
			timer: null,
		};
	},

	computed: {
		user() {
			return this.$store.state.user;
		},

		// 面包屑
		breadcrumb() {
			const menuRouterList = {
				home: { path: '/home', name: '首页' },
				user: { path: '/user', name: '用户管理' },
				family: { path: '/family', name: '家庭组管理' },
				device: { path: '/device', name: '设备管理' },
				overview: { path: '/device/overview', name: '概览' },
				classify: { path: '/device/classify', name: '分类' },
				set: { path: '/set', name: '设置' },
			};

			const path = this.$route.path.split('/');
			let breadcrumb = {
				name: '',
				data: [],
			};
			path.forEach((el, index) => {
				if (index === path.length - 1) {
					menuRouterList[el]
						? (breadcrumb.name = menuRouterList[el].name)
						: (breadcrumb.name = this.$route.query.name);
				} else if (menuRouterList[el]) {
					breadcrumb.data.push({
						path: menuRouterList[el].path,
						name: menuRouterList[el].name,
					});
				}
			});
			return breadcrumb;
		},
	},
	methods: {
		// 侧边栏折叠
		setCollapse() {
			if (this.isCollapse) {
				this.$refs.appHeader.setCollapseIcon('icon-menu-unfold');
				this.isCollapse = false;
				this.width = 220;
				return;
			}
			this.$refs.appHeader.setCollapseIcon('icon-menu-fold');
			this.isCollapse = true;
			this.width = 64;
		},

		// 登出
		signOut() {
			this.signOutFn();
		},

		// 登出封装
		signOutFn() {
			this.loading = true;
			signOut()
				.then(resData => {
					if (resData === 'ok') {
						this.$router.replace({
							name: 'sign',
						});
						storage.remove('token');
						this.$store.dispatch('token', '');
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
					this.loading = false;
				});
		},

		// 宽度设置
		setWidth(width) {
			if (width < 1250) {
				this.setDisabled = true;
				this.isCollapse = true;
				this.width = 64;
				this.$refs.appHeader.setCollapseIcon('icon-menu-fold');
			} else {
				this.setDisabled = false;
				this.isCollapse = false;
				this.width = 220;
				this.$refs.appHeader.setCollapseIcon('icon-menu-unfold');
			}
		},

		checkFull() {
			let isFull =
				window.fullScreen ||
				document.webkitIsFullScreen ||
				document.mozIsFullScreen ||
				document.msFullscreenEnabled;

			if (isFull === undefined) {
				isFull = false;
			}
			return isFull;
		},

		// resize 监听回调
		onResize() {
			if (!this.checkFull()) {
				this.$refs.appHeader.setFullScreenIcon(false);
			}
			if (this.timer) {
				clearInterval(this.timer);
			}
			this.timer = null;
			this.timer = setTimeout(() => {
				this.setWidth(document.body.clientWidth);
			}, 500);
		},
	},

	components: {
		AppHeader,
		AppAside,
	},

	mounted() {
		this.setWidth(document.body.clientWidth);
		window.onresize = this.onResize;
	},
};
</script>

<style lang="scss" scoped>
.app-main {
	display: flex;
	flex-direction: column;

	&-title {
		height: 40px;
		margin: 0 20px;
		box-sizing: border-box;
		border-bottom: 1px solid #ebeef5;
		@include flex-between();

		&-text {
			font-weight: bold;
		}
	}

	&-content {
		flex: 1;
		min-height: calc(100vh - 160px);
		margin: 20px;
		box-sizing: border-box;
		overflow: hidden;
	}
}

.router-leave-active,
.router-enter-active {
	transition: all 0.4s;
}

.router-enter {
	opacity: 0;
	transform: translateX(30px);
}

.router-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
</style>
