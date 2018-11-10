<template>
    <el-row class="header-content">
        <el-col :md="4"
                :sm="4"
                :xs="4"
                class="left">
            <a class="left-menu-btn"
               @click.stop="setCollapse">
                <i class="fa fa-bars fa-fw"></i>
            </a>
            <h1 class="left-title">{{ title }}</h1>
        </el-col>
        <el-col :md="12"
                :sm="10"
                :xs="6"
                class="center">
            Logo
        </el-col>
        <el-col :md="8"
                :sm="10"
                :xs="14"
                class="right">
            <header-search></header-search>
            <dir class="right-item">
                <el-badge :value="promptBadge"
                          class="right-prompt">
                    <i class="fa fa-bell-o"></i>
                </el-badge>
                <el-badge :value="emailBadge"
                          class="right-email">
                    <i class="fa fa-envelope-o"></i>
                </el-badge>
            </dir>
            <el-dropdown trigger="click"
                         @command='handleCommand'
                         placement="bottom">
                <div class="right-user el-dropdown-link">
                    <span class="right-user-avatar">
                        <img :src="user.avatar"
                             :alt="user.nickName">
                    </span>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item disabled>Welcome!</el-dropdown-item>
                    <el-dropdown-item command="userInfo"><i class="fa fa-user fa-fw"></i>&nbsp;我的账号</el-dropdown-item>
                    <el-dropdown-item><i class="fa fa-gear fa-fw"></i>&nbsp;设置</el-dropdown-item>
                    <el-dropdown-item command="signOut"><i class="fa fa-sign-out fa-fw"></i>&nbsp;登出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-col>
    </el-row>
</template>

<script>
import HeaderSearch from './search';
import { userInfo, signOut } from '@/api/user';
import storage from '@/assets/js/storage';

export default {
	name: 'Header',
	data() {
		return {};
	},
	props: {
		title: {
			type: String,
			default: '首页',
		},
		user: {
			type: Object,
		},
		promptBadge: {
			type: Number,
		},
		emailBadge: {
			type: Number,
		},
	},
	methods: {
		setCollapse() {
			this.$emit('setCollapse');
		},
		handleCommand(command) {
			if (command === 'signOut') {
				signOut()
					.then(data => {
						if (data === 'ok') {
							storage.remove('token');
							this.$store.dispatch('token', '');
							this.$router.replace({
								name: 'sign',
							});
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
			} else if (command === 'userInfo') {
				userInfo()
					.then(data => {
						if (data) {
							console.log(data);
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
			}
		},
	},
	components: {
		HeaderSearch,
	},
};
</script>

<style lang="scss" scoped>
.header-content {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	.left,
	.center,
	.right {
		height: 100%;
		display: flex;
		align-items: center;
	}

	.left {
		justify-content: flex-start;

		&-menu-btn {
			display: block;
			color: #000;
			margin: 0 20px;
			cursor: pointer;
		}

		&-title {
			user-select: none;
			font-size: 16px;
		}
	}

	.center {
		justify-content: center;
	}

	.right {
		height: 100%;
		justify-content: space-around;

		.el-input {
			flex: 5;
			margin-right: 10px;
		}

		&-item {
			flex: 2;
			display: flex;
			justify-content: space-around;
			cursor: pointer;
		}

		.el-dropdown {
			flex: 1;
		}

		&-user {
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;

			&-avatar {
				display: block;
				width: 32px;
				height: 32px;
				border-radius: 50%;
				// margin: 0 10px;

				img {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}

			&-name {
				width: 40%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
}
</style>
