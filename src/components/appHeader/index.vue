<template>
    <div class="app-header-content">
        <div class="left">
            <div class="left-logo"
                 :style="{width: `${width}px`}">
                <svg-icon iconClass="icon-logo" />
                <transition name="el-fade-in-linear">
                    <span v-if="width === 220">
                        智家管理后台
                    </span>
                </transition>
            </div>
            <div class="left-menu">
                <el-button type="text"
                           :disabled="disabled"
                           class="left-menu-btn"
                           @click.stop="setCollapse">
                    <svg-icon :iconClass="collapseIcon" />
                </el-button>
            </div>
        </div>
        <div class="right">
            <transition name="el-fade-in-linear"
                        mode="out-in">
                <el-input v-if="isSearch"
                          placeholder="Search..."
                          v-model="searchKey">
                    <i slot="suffix"
                       class="el-input__icon el-icon-search">
                    </i>
                </el-input>
            </transition>
            <span class="right-prompt"
                  @click="setSearch">
                <svg-icon iconClass="icon-search" />
            </span>
            <span class="right-prompt"
                  :disabled="disabled"
                  @click.stop="toggleFullScreen">
                <svg-icon :iconClass="fullScreenIcon" />
            </span>
            <!-- <el-tooltip effect="dark"
                        content="消息中心"
                        :open-delay="600"
                        placement="bottom">
                <el-badge :value="messageUnread"
                          class="right-message"
                          type="primary"
                          :hidden="!messageUnread">
                    <span @click="routerMessage">
                        <svg-icon iconClass="icon-message" />
                    </span>
                </el-badge>
            </el-tooltip> -->
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
                        <svg-icon iconClass="icon-people" />
                        我的账号
                    </el-dropdown-item>
                    <el-dropdown-item command="set">
                        <svg-icon iconClass="icon-setup" />
                        设置
                    </el-dropdown-item>
                    <el-dropdown-item command="signOut">
                        <svg-icon iconClass="icon-signout" />
                        登出
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <el-dialog :visible.sync="visible"
                   :modal-append-to-body="false"
                   width="360px"
                   class="app-dialog-user">
            <app-dialog-user :user="user"
                             type="own"
                             @setVisible="setVisible" />
        </el-dialog>
    </div>
</template>

<script>
import AppDialogUser from '@/components/appDialogUser';

export default {
	name: 'AppHeader',
	data() {
		return {
			searchKey: '',
			isSearch: false,
			isFullscreen: false,
			visible: false,
			collapseIcon: 'icon-menu-unfold',
			fullScreenIcon: 'icon-jujiao',
		};
	},

	computed: {
		messageUnread() {
			return this.$store.state.messageUnread;
		},
	},

	methods: {
		searchBlur() {
			if (!this.searchKey) {
				this.isSearch = false;
			}
		},

		setSearch() {
			this.isSearch = !this.isSearch;
		},

		// 设置折叠
		setCollapse() {
			this.$emit('setCollapse');
		},

		// 打开消息列表
		routerMessage() {
			this.$emit('routerMessage', true);
		},

		// 选择
		handleCommand(command) {
			if (command === 'signOut') {
				this.$emit('signOut');
			} else if (command === 'userInfo') {
				this.visible = true;
			} else if (command === 'set') {
				this.$router.push({ name: 'set' });
			}
		},

		// 设置折叠按钮图标
		setCollapseIcon(value) {
			this.collapseIcon = value;
		},

		// 设置全屏按钮图标
		setFullScreenIcon(value) {
			if (this.isFullscreen === value) {
				return;
			}
			this.isFullscreen = value;
			if (value) {
				this.fullScreenIcon = 'icon-suoxiao';
			} else {
				this.fullScreenIcon = 'icon-jujiao';
			}
		},

		// 显示/关闭用户信息卡
		setVisible(value) {
			this.visible = value;
		},

		// H5 fullscreen Api实现全屏
		fullScreen(el) {
			if (!this.isFullscreen) {
				//退出全屏
				const exitMethod =
					document.exitFullscreen || //W3C
					document.mozCancelFullScreen || //FireFox
					document.webkitExitFullscreen || //Chrome等
					document.webkitExitFullscreen; //IE11
				if (exitMethod) {
					exitMethod.call(document);
				} else if (typeof window.ActiveXObject !== 'undefined') {
					//for Internet Explorer
					/* global ActiveXObject  */
					const wscript = new ActiveXObject('WScript.Shell');
					if (wscript !== null) {
						wscript.SendKeys('{F11}');
					}
				}
			} else {
				//进入全屏
				const requestMethod =
					el.requestFullScreen || //W3C
					el.webkitRequestFullScreen || //FireFox
					el.mozRequestFullScreen || //Chrome 等
					el.msRequestFullScreen; //IE11
				if (requestMethod) {
					requestMethod.call(el);
				} else if (typeof window.ActiveXObject !== 'undefined') {
					//for Internet Explorer
					const wscript = new ActiveXObject('WScript.Shell');
					if (wscript !== null) {
						wscript.SendKeys('{F11}');
					}
				}
			}
		},

		// 切换全屏
		toggleFullScreen() {
			this.setFullScreenIcon(!this.isFullscreen);
			const el = document.documentElement;
			this.fullScreen(el);
		},
	},

	components: {
		AppDialogUser,
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
.app-header-content {
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

			font-size: 36px;
			svg {
				margin: 0 10px;
			}

			span {
				font-size: 16px;
				margin: 0 10px;
			}
		}

		&-menu {
			height: 100%;
			margin-right: 10px;
			@include flex-center();

			&-btn {
				margin: 0 10px;
				display: block;
				color: #000;
				cursor: pointer;
				font-size: 18px;
			}
		}
	}

	.right {
		height: 100%;
		padding-right: 30px;
		@include flex-center();
		justify-content: flex-end;

		.el-input {
			margin-right: 10px;
			width: 300px;
		}

		&-prompt,
		&-message {
			font-size: 22px;
			margin: 0 10px;
			cursor: pointer;
		}

		&-item {
			flex: 4;
			display: flex;
			justify-content: space-around;
			cursor: pointer;
		}

		&-user {
			margin: 0 20px;
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
