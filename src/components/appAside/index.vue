<template>
    <div class="app-aside-content">
        <div class="app-aside-content-user">
            <span class="app-aside-content-user-avatar">
                <img :src="user.avatar"
                     :alt="user.nickName">
            </span>
            <span class="app-aside-content-user-name">
                <i v-if="!isCollapse">
                    {{ user.nickName }}
                </i>
                <i v-else>...</i>
            </span>
            <span class="app-aside-content-user-btn">
                <el-tooltip effect="dark"
                            content="设置"
                            :open-delay="600"
                            placement="top-start">
                    <el-button size="mini"
                               v-show="!isCollapse"
                               circle
                               @click="routerSet">
                        <svg-icon iconClass="icon-setup_fill" />
                    </el-button>
                </el-tooltip>
                <el-tooltip effect="dark"
                            content="登出"
                            :open-delay="600"
                            placement="top-start">
                    <el-button size="mini"
                               v-show="!isCollapse"
                               circle
                               @click="signOut">
                        <svg-icon iconClass="icon-signout" />
                    </el-button>
                </el-tooltip>
            </span>
        </div>
        <el-menu class="app-aside-content-menu"
                 :default-active="active"
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 :router="true"
                 :unique-opened="true">
            <el-menu-item index="home"
                          :route="{name: 'home'}">
                <svg-icon class="app-aside-content-icon"
                          iconClass="icon-homepage_fill" />
                <span slot="title">
                    首页
                </span>
            </el-menu-item>
            <el-menu-item index="user"
                          :route="{name: 'user'}">
                <svg-icon class="app-aside-content-icon"
                          iconClass="icon-people_fill" />
                <span slot="title">
                    用户管理
                </span>
            </el-menu-item>
            <el-menu-item index="family"
                          :route="{name: 'family'}">
                <svg-icon class="app-aside-content-icon"
                          iconClass="icon-group_fill" />
                <span slot="title">
                    家庭组管理
                </span>
            </el-menu-item>
            <el-submenu index="device">
                <template slot="title">
                    <svg-icon class="app-aside-content-icon"
                              iconClass="icon-tasklist_fill" />
                    <span slot="title">
                        设备管理
                    </span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="device"
                                  :route="{name: 'device'}">
                        概览
                    </el-menu-item>
                    <el-menu-item index="classify"
                                  :route="{name: 'classify'}">
                        分类
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="set"
                          :route="{name: 'set'}">
                <svg-icon class="app-aside-content-icon"
                          iconClass="icon-setup_fill" />
                <span slot="title">
                    设置
                </span>
            </el-menu-item>
        </el-menu>
        <el-dialog :visible.sync="visible"
                   :modal-append-to-body="false"
                   width="360px"
                   class="app-dialog-user">
            <app-dialog-user :user="user"
                             type="own" />
        </el-dialog>
    </div>
</template>

<script>
import AppDialogUser from '@/components/appDialogUser';

export default {
	name: 'AppAside',
	data() {
		return { visible: false };
	},

	computed: {
		active() {
			const path = this.$route.path.split('/');
			if (path[path.length - 1] === 'access') {
				return 'control';
			}
			if (path[path.length - 2] === 'details') {
				return 'overview';
			}
			return path[path.length - 1];
		},

		disabled() {
			if (this.$store.state.user.groupId) {
				return false;
			} else {
				return true;
			}
		},
	},

	methods: {
		// 打开用户信息
		displayUserInfo() {
			this.visible = true;
		},

		// 路由至设置页面
		routerSet() {
			this.$router.push({ name: 'set' });
		},

		// 登出
		signOut() {
			this.$emit('signOut');
		},
	},

	components: {
		AppDialogUser,
	},

	props: {
		isCollapse: {
			type: Boolean,
			default: false,
		},

		user: {
			type: Object,
		},
	},
};
</script>
<style lang="scss" scoped>
.app-aside-content {
	min-width: 64px;
	transition: all 0.5s;
	overflow: hidden;

	&-user {
		width: 100%;
		min-width: 64px;
		height: 160px;
		padding-top: 20px;
		@include flex-around(column);

		&-avatar {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			display: block;
			border: 2px solid rgb(210, 214, 222);

			img {
				height: 100%;
				width: 100%;
				border-radius: 50%;
			}
		}

		&-name {
			width: 50%;
			font-size: 18px;
			font-weight: bold;
			white-space: nowrap;
			text-overflow: ellipsis;
			text-align: center;
			overflow: hidden;
			cursor: pointer;
		}

		&-btn {
			@include flex-center();
		}
	}

	&-icon {
		vertical-align: middle;
		padding-right: 10px;
		font-size: 20px;
		color: #909399;
	}

	.el-menu-item.is-active &-icon {
		color: inherit;
	}

	&-menu {
		width: 100%;
		height: 100%;
		border-right: none;
		transition: all 0.5s;

		&:not(.el-menu--collapse) {
			width: 220px;
		}
	}
}
</style>
