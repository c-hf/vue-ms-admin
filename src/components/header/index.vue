<template>
    <div class="header-content">
        <div class="left">
            <div class="left-logo"
                 :style="{width: `${width}px`}">
                Logo
            </div>
            <div class="left-menu">
                <el-button type="text"
                           :disabled="disabled"
                           class="left-menu-btn"
                           @click.stop="setCollapse">
                    <svg-icon iconClass="icon-bars" />
                </el-button>
            </div>
        </div>
        <div class="right">
            <header-search />
            <dir class="right-item">
                <el-badge :value="promptBadge"
                          class="right-prompt">
                    <svg-icon iconClass="icon-remind" />
                </el-badge>
                <el-badge :value="emailBadge"
                          class="right-email">
                    <svg-icon iconClass="icon-mail" />
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
                    <el-dropdown-item disabled>
                        Welcome!
                    </el-dropdown-item>
                    <el-dropdown-item command="userInfo">
                        <svg-icon class="dropdown-icon"
                                  iconClass="icon-people" />
                        我的账号
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <svg-icon class=""
                                  iconClass="icon-setup" />
                        设置
                    </el-dropdown-item>
                    <el-dropdown-item command="signOut">
                        <svg-icon class=""
                                  iconClass="icon-signout" />
                        登出
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import HeaderSearch from './search';
import { getUserInfo } from '@/api/user';

export default {
	name: 'Header',
	data() {
		return {};
	},

	methods: {
		setCollapse() {
			this.$emit('setCollapse');
		},

		handleCommand(command) {
			if (command === 'signOut') {
				this.$emit('signOut');
			} else if (command === 'userInfo') {
				this.getUserInfoFn();
			}
		},

		// getUserInfo 封装
		getUserInfoFn() {
			getUserInfo()
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
		},
	},

	components: {
		HeaderSearch,
	},

	props: {
		user: {
			type: Object,
		},
		width: {
			type: Number,
		},
		promptBadge: {
			type: Number,
		},
		emailBadge: {
			type: Number,
		},
		disabled: {
			type: Boolean,
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';
.header-content {
	width: 100%;
	height: 100%;
	@include flex-between();

	.left,
	.right {
		height: 100%;
		display: flex;
		align-items: center;
		box-sizing: border-box;
	}

	.left {
		&-logo {
			height: 100%;
			transition: all 0.5s;
			@include flex-center();
		}

		&-menu {
			height: 100%;
			@include flex-center();

			&-btn {
				display: block;
				color: #000;
				margin: 0 20px;
				cursor: pointer;
				font-size: 18px;
			}
		}
	}

	.right {
		width: 500px;
		height: 100%;
		padding-right: 20px;

		.el-input {
			flex: 5;
			margin-right: 10px;
		}

		&-prompt,
		&-email {
			font-size: 20px;
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
			@include flex-around();
			cursor: pointer;

			&-avatar {
				display: block;
				width: 32px;
				height: 32px;
				border-radius: 50%;

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
