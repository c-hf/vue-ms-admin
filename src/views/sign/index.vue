<template>
    <transition name="el-fade-in-linear">
        <el-row class="sign">
            <el-col :span="24">
                <el-card class="sign-card"
                         v-loading="loading">
                    <transition name="el-zoom-in-center">
                        <el-col :span="8"
                                class="left"
                                v-show="show">
                            <div class="left-content">
                                <span class="left-user-avatar">
                                    <img :src="avatar"
                                         alt="avatar"
                                         draggable="false">
                                </span>
                                <span class="left-user-title">
                                    {{ title }}
                                    <p>{{ subtitle }}</p>
                                </span>
                                <span class="left-toggle-btn">
                                    <i class="el-icon-s-help"></i>
                                </span>
                            </div>
                        </el-col>
                    </transition>
                    <transition name="el-zoom-in-center">
                        <el-col :span="16"
                                class="right"
                                v-show="show">
                            <sign-in @setAvatar="setAvatar"
                                     @setLoad="setLoad" />
                        </el-col>
                    </transition>
                </el-card>
            </el-col>
        </el-row>
    </transition>
</template>

<script>
// import SignUp from './components/signUp';
import SignIn from './components/signIn';

import avatar from '@//assets/img/avatar/avatar.jpg';

export default {
	name: 'signUpAndIn',
	data() {
		return {
			loading: false,
			show: true,
			title: 'SignIn',
			subtitle: 'Start a smart life',
			avatar: avatar,
			sign: false,
		};
	},

	methods: {
		// 获取头像
		setAvatar(avatar) {
			this.avatar = avatar;
		},

		// loading
		setLoad(value) {
			this.loading = value;
		},
	},

	components: {
		SignIn,
	},
};
</script>

<style lang="scss">
.sign {
	width: 100%;
	height: 100%;
	max-height: 100vh;
	min-width: 1024px;
	position: absolute;
	top: 0;
	left: 0;
	background-color: #f3f6f8;
	z-index: 1000;

	.el-col {
		height: 100%;
		display: flex;
	}

	@media screen and (min-width: 1600px) {
		.el-card {
			height: 660px !important;
		}
	}

	.el-card {
		width: 60%;
		height: 560px;
		min-width: 800px;
		margin: auto;

		.el-card__body {
			width: 100%;
			height: 100%;
			display: flex;
			padding: 0;
		}

		.left {
			height: 100%;
			background-image: url(~@/assets/img/signLeft/1.jpg);
			background-size: 100% 100%;
			background-position: center center;
			position: relative;
			user-select: none;

			&::after {
				content: ' ';
				display: block;
				width: 100%;
				height: 100%;
				opacity: 0.4;
				background: #d4d4d6;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 2;
			}

			&-content {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				z-index: 10;
			}

			&-user-avatar {
				width: 120px;
				height: 120px;
				border-radius: 50%;
				display: block;
				border: 2px solid rgb(210, 214, 222);

				img {
					height: 100%;
					width: 100%;
					border-radius: 50%;
				}
			}

			&-user-title {
				width: 80%;
				margin-top: 50px;
				font-size: 20px;
				font-weight: bold;
				color: #ffffff;
				text-align: center;

				p {
					margin-top: 10px;
					font-size: 16px;
				}
			}

			&-toggle-btn {
				display: block;
				width: 50px;
				height: 50px;
				border-radius: 50%;
				font-size: 24px;
				line-height: 50px;
				text-align: center;
				background: rgba($color: #c0c4cc, $alpha: 0.8);
				color: #f3f6f8;
				box-shadow: 2px 2px 10px 5px rgba(255, 255, 255, 0.1);
				margin-top: 50px;
				cursor: pointer;

				&:hover {
					background: rgba($color: #c0c4cc, $alpha: 1);
				}
				&:active {
					background: rgba($color: #c0c4cc, $alpha: 0.9);
				}
			}
		}

		.right {
			min-height: 100%;
		}
	}
}
</style>
