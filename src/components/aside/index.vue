<template>
    <div class="app-aside">
        <div class="app-aside-user">
            <span class="app-aside-user-avatar">
                <img :src="user.avatar"
                     :alt="user.nickName">
            </span>
            <span class="app-aside-user-name">
                <i v-if="!isCollapse">
                    {{ user.nickName }}
                </i>
                <i v-else>...</i>
            </span>
            <span class="app-aside-user-btn">
                <el-button size="mini"
                           v-show="!isCollapse"
                           circle>
                    <svg-icon iconClass="icon-people_fill" />
                </el-button>
                <el-button size="mini"
                           v-show="!isCollapse"
                           circle>
                    <svg-icon iconClass="icon-setup_fill" />
                </el-button>
                <el-button size="mini"
                           v-show="!isCollapse"
                           circle
                           @click="signOut">
                    <svg-icon iconClass="icon-signout" />
                </el-button>
            </span>
        </div>
        <el-menu class="app-aside-menu"
                 :default-active="active"
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 :router="true"
                 :unique-opened="true">
            <el-menu-item index="home"
                          :route="{name: 'home'}">
                <svg-icon class="app-aside-icon"
                          iconClass="icon-homepage_fill" />
                <span slot="title">
                    首页
                </span>
            </el-menu-item>
            <el-submenu index="device">
                <template slot="title">
                    <svg-icon class="app-aside-icon"
                              iconClass="icon-tasklist_fill" />
                    <span slot="title">
                        设备管理
                    </span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="overview"
                                  :route="{name: 'overview'}">
                        概览
                    </el-menu-item>
                    <el-menu-item index="classify"
                                  :route="{name: 'classify'}">
                        分类
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="message"
                          :route="{name: 'message'}">
                <svg-icon class="app-aside-icon"
                          iconClass="icon-mail_fill" />
                <span slot="title">
                    消息中心
                </span>
            </el-menu-item>
            <el-menu-item index="set"
                          :route="{name: 'set'}">
                <svg-icon class="app-aside-icon"
                          iconClass="icon-setup_fill" />
                <span slot="title">
                    设置
                </span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {
	name: 'Aside',
	data() {
		return {};
	},

	computed: {
		active() {
			const path = this.$route.path.split('/');
			if (path[path.length - 2] === 'details') {
				return 'classify';
			}
			return path[path.length - 1];
		},
	},

	methods: {
		signOut() {
			this.$emit('signOut');
		},
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
@import '~@/assets/scss/mixins';
.app-aside {
	min-width: 64px;
	background-color: #fff;
	transition: all 0.5s;
	overflow: hidden;

	&-user {
		width: auto;
		height: 160px;
		padding: 20px;
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
