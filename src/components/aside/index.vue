<template>
    <div class="app-aside">
        <div class="user">
            <span class="user-avatar">
                <img :src="user.avatar"
                     :alt="user.nickName">
            </span>
            <span class="user-name"
                  v-show="!isCollapse">
                {{ user.nickName }}
            </span>
            <span class="user-item">

            </span>
        </div>
        <el-menu class="el-menu-vertical"
                 :default-active="$route.path"
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 :router="true"
                 :unique-opened="true">

            <el-menu-item index="/"
                          :route="{name: 'home'}">
                <i class="fa fa-home fa-fw fa-lg"></i>
                <span slot="title">&nbsp;&nbsp;首页</span>
            </el-menu-item>
            <el-menu-item index="user"
                          :route="{name: 'home'}">
                <i class="fa fa-user fa-fw fa-lg"></i>
                <span slot="title">&nbsp;&nbsp;用户模块</span>
            </el-menu-item>
            <el-submenu index="device">
                <template slot="title">
                    <i class="fa fa-briefcase fa-fw fa-lg"></i>
                    <span slot="title">&nbsp;&nbsp;设备模块</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/device"
                                  :route="{name: 'device'}">
                        设备概览
                    </el-menu-item>
                    <el-menu-item index="/device/classify"
                                  :route="{name: 'classify'}">
                        设备分类
                    </el-menu-item>
                    <el-menu-item index="/device/param"
                                  :route="{name: 'param'}">
                        设备参数
                    </el-menu-item>
                    <el-menu-item index="/device/attr"
                                  :route="{name: 'attr'}">
                        设备属性
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="/message"
                          :route="{name: 'message'}">
                <i class="fa fa-bell fa-fw fa-lg"></i>
                <span slot="title">&nbsp;&nbsp;消息中心</span>
            </el-menu-item>
            <el-menu-item index="/set"
                          :route="{name: 'set'}">
                <i class="fa fa-cog fa-fw fa-lg"></i>
                <span slot="title">&nbsp;&nbsp;设置</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
import { menuRouterList } from './config.js';

export default {
	name: 'Aside',
	data() {
		return {
			active: '/',
		};
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
	methods: {
		select(key) {
			this.$emit('setTitle', menuRouterList[key]);
		},
		setTitle() {
			// console.log('a');
		},
	},
	watch: {
		$route: 'setTitle',
	},
	beforeUpdate() {
		this.select(this.$route.path);
	},
};
</script>

<style lang="scss" scoped>
.app-aside {
	min-width: 64px;
	background-color: #fff;
	transition: all 0.5s;

	.user {
		width: auto;
		height: 160px;
		padding-top: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;

		&-avatar {
			width: 55px;
			height: 55px;
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
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			text-align: center;
		}
	}

	.el-menu {
		width: 100%;
		height: 100%;
		border-right: none;
		transition: all 0.5s;
	}

	.el-menu-vertical:not(.el-menu--collapse) {
		width: 220px;
	}
}
</style>
