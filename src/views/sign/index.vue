<template>
    <transition name="el-fade-in-linear">
        <el-row class="sign">
            <el-col :span="24">
                <el-card class="box-card">
                    <transition name="el-zoom-in-center">
                        <el-col :span="8"
                                class="left"
                                v-show="show">
                            <div class="left-content">
                                <span class="left-user-avatar">
                                    <img :src="avatar"
                                         alt="avatar">
                                </span>
                                <span class="left-user-title">
                                    {{ title }}
                                    <p>{{ subtitle }}</p>
                                </span>
                                <span class="left-toggle-btn"
                                      @click="toggleSign">
                                    <i class="el-icon-arrow-right"></i>
                                </span>
                            </div>
                        </el-col>
                    </transition>
                    <transition name="el-zoom-in-center">
                        <el-col :span="16"
                                class="right"
                                v-show="show">
                            <sign-up v-if="sign"
                                     @toggleSign="toggleSign"
                                     @setSign="toggleSign" />
                            <sign-in v-else
                                     @toggleSign="toggleSign"
                                     @setAvatar="setAvatar" />
                        </el-col>
                    </transition>
                </el-card>
            </el-col>
        </el-row>
    </transition>
</template>

<script>
import SignUp from './signUp';
import SignIn from './signIn';

export default {
	name: 'signUpAndIn',
	data() {
		return {
			show: true,
			title: 'SignIn',
			subtitle: 'Start a smart life',
			avatar: 'http://localhost:3000/static/avatar/0.jpg',
			sign: false,
		};
	},
	components: {
		SignUp,
		SignIn,
	},
	methods: {
		setAvatar(avatar) {
			this.avatar = avatar || 'http://localhost:3000/static/avatar/0.jpg';
		},
		toggleSign() {
			this.show = false;
			setTimeout(() => {
				this.sign ? (this.sign = false) : (this.sign = true);
				this.title === 'SignIn'
					? (this.title = 'SignUp')
					: (this.title = 'SignIn');
				this.show = true;
			}, 300);
		},
	},
};
</script>

<style lang="scss">
.sign {
	width: 100%;
	height: 100%;
	min-width: 768px;
	position: absolute;
	top: 0;
	left: 0;
	background-color: #f3f6f8;
	z-index: 1000;

	.el-col {
		height: 100%;
		display: flex;
	}

	.el-card {
		width: 60%;
		height: 80%;
		margin: auto;

		.el-card__body {
			width: 100%;
			height: 100%;
			display: flex;
			padding: 0;
		}

		.left {
			height: 100%;
			background-image: url(~@/assets/img/signLeft/3.jpg);
			background-size: 100% 100%;
			background-position: center center;
			position: relative;

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
