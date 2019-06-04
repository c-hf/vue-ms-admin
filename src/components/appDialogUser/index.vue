<template>
    <div v-loading="loading">
        <span class="app-dialog-user-avatar block">
            <img :src="user.avatar"
                 alt="头像">
        </span>
        <span class="app-dialog-user-nickName block">
            {{ user.nickName }}
        </span>
        <span class="app-dialog-user-intro block">
            <i v-if="!user.intro">
                暂无介绍 ┐(´∇｀)┌
            </i>
            <i v-else>
                {{ user.intro }}
            </i>
        </span>
        <span class="app-dialog-user-item">
            <i>账号</i>
            <i>
                {{ user.userId }}
            </i>
        </span>
        <span class="app-dialog-user-item">
            <i>昵称</i>
            <i>
                {{ user.nickName }}
            </i>
        </span>
        <span class="app-dialog-user-item">
            <i>性别</i>
            <i>
                {{ user.sex }}
            </i>
        </span>
        <span class="app-dialog-user-item"
              :class="{bottom: type !== 'member'}">
            <i>年龄</i>
            <i>
                {{ new Date().getFullYear() - user.birthday.split('-')[0] }}
            </i>
        </span>
        <span v-show="type === 'member'"
              class="app-dialog-user-item bottom">
            <i>所在地</i>
            <i>
                {{ user.region }}
            </i>
        </span>
        <el-button class="app-dialog-user-delete"
                   type="primary"
                   icon="el-icon-edit"
                   circle
                   @click="routerSet">
        </el-button>
    </div>

</template>

<script>
export default {
	name: 'AppDialogUser',
	data() {
		return {
			loading: false,
		};
	},

	methods: {
		// 路由至设置页面
		routerSet() {
			this.$router.push({ name: 'set' });
			this.$emit('setVisible', false);
		},
	},

	props: {
		user: {
			type: Object,
		},

		type: {
			type: String,
			default: 'user',
		},
	},
};
</script>

<style lang="scss">
.app-dialog-user {
	.el-dialog__header,
	.el-dialog__body {
		padding: 0;
	}

	.block {
		display: block;
	}

	.bottom {
		padding-bottom: 20px;
	}

	&-avatar {
		width: 100%;
		height: 300px;
		position: relative;
		overflow: hidden;
		box-shadow: 0 0 24px 1px rgba(0, 0, 0, 0.02);

		img {
			width: 100%;
			height: 360px;
			position: absolute;
			top: -60px;
		}
	}

	&-nickName {
		height: 50px;
		font-size: 22px;
		font-weight: bold;
		text-align: center;
		line-height: 50px;
	}

	&-intro {
		width: 80%;
		height: 30px;
		line-height: 30px;
		margin: 0 auto;
		text-align: center;
		font-size: 14px;
		color: #99a9bf;
		@include ellipsis();
	}

	&-item {
		font-size: 14px;
		text-align: center;
		margin: 10px 0;
		color: #303133;
		@include flex-center();

		i:nth-of-type(1) {
			display: inline-block;
			width: 50px;
			color: #c0c4cc;
			padding: 0 5px;
			text-align: right;
		}

		i:nth-of-type(2) {
			display: inline-block;
			width: 120px;
			padding-left: 10px;
			text-align: left;
		}
	}

	&-delete {
		position: absolute;
		top: 277px;
		right: 15px;
		font-size: 20px;
	}
}
</style>
