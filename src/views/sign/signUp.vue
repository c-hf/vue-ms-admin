<template>
    <el-form :model="data"
             :rules="rules"
             ref="signUpForm"
             status-icon
             label-width="0"
             label-position="top"
             @keyup.enter.native="onEnter('signUpForm')"
             class="form-sign-up">
        <el-form-item>
            <h1 class="main-title">欢迎注册 XXX</h1>
            <h2 class="subtitle">开启智慧生活</h2>
        </el-form-item>
        <el-form-item prop="nickName">
            <el-input placeholder="昵称"
                      v-model="data.nickName">
            </el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input placeholder="密码"
                      type="password"
                      v-model="data.password">
            </el-input>
        </el-form-item>
        <el-form-item prop="id">
            <el-autocomplete placeholder="邮箱"
                             :fetch-suggestions="querySearch"
                             :trigger-on-focus="false"
                             v-model="data.id">
            </el-autocomplete>
        </el-form-item>
        <transition name="el-fade-in">
            <el-form-item prop="code"
                          v-show="data.id.length">
                <el-input placeholder="验证码"
                          v-model="data.code">
                </el-input>
                <el-button type="primary"
                           :disabled="sendCodeBtn"
                           @click="sendCode('signUpForm')"> {{ sendCodeMsg }}</el-button>
            </el-form-item>
        </transition>
        <el-form-item>
            <el-button type="primary"
                       class="sign-up-btn"
                       :disabled="signUpBtn"
                       @click="onSubmit('signUpForm')">注册</el-button>
            <span class="sign-in-btn">
                已经有账号？
                <el-button type="text"
                           @click="signIn">登录</el-button>
            </span>
        </el-form-item>
        <el-form-item>
            Copyright © 2018-2018 CHF All Rights Reserved
        </el-form-item>
    </el-form>
</template>

<script>
import { signUp, signSendCode } from '@/api/user';
import { EMAIL_SUFFIX } from './config';
import storage from '@/assets/js/storage';

export default {
	name: 'SignUp',
	data() {
		// 昵称验证
		const validateNickName = (rule, value, callback) => {
			const nameRegExp = /^[\u4e00-\u9fa5a-zA-Z0-9_]{4,18}$/;
			if (!value) {
				this.vNickName = false;
				callback(new Error('请输入昵称'));
			} else {
				if (nameRegExp.test(this.data.name)) {
					this.vNickName = true;
					callback();
					return;
				}
				this.vNickName = false;
				callback(
					new Error('昵称为 4 - 18 个字，支持中、英文、数字及 _')
				);
			}
		};

		// 注册账号验证
		const validateId = (rule, value, callback) => {
			const [phoneRegExp, emailRegExp] = [
				/^1[0-9]{10}$/,
				/^[a-z0-9]+(?:[._-][a-z0-9]+)*@[a-z0-9]+(?:[._-][a-z0-9]+)*\.[a-z]{2,4}$/i,
			];
			if (!value) {
				this.vId = false;
				callback(new Error('请输入邮箱'));
			} else {
				if (phoneRegExp.test(this.data.id)) {
					this.data.type = 'phone';
					this.vId = true;
					callback();
					return;
				} else if (emailRegExp.test(this.data.id)) {
					this.data.type = 'email';
					this.vId = true;
					callback();
					return;
				}
				this.vId = false;
				callback(new Error('请输入正确的邮箱'));
			}
		};

		// 密码验证
		const validatePassWord = (rule, value, callback) => {
			const nameRegExp = /^\S{6,16}$/;
			if (!value) {
				this.vPassWord = false;
				callback(new Error('请输入密码'));
			} else {
				if (nameRegExp.test(this.data.password)) {
					this.vPassWord = true;
					callback();
					return;
				}
				this.vPassWord = false;
				callback(new Error('密码为 6 - 16 位，不支持空格'));
			}
		};

		// 验证码
		const validateCode = (rule, value, callback) => {
			if (!value) {
				callback(new Error('请输入验证码'));
			} else {
				value.length === 6
					? callback()
					: callback(new Error('验证码为 6 位数字'));
			}
		};

		return {
			vNickName: false,
			vId: false,
			vPassWord: false,
			data: {
				nickName: '',
				password: '',
				id: '',
				code: '',
			},
			rules: {
				nickName: [
					{
						validator: validateNickName,
						required: true,
					},
				],

				id: [
					{
						validator: validateId,
						required: true,
						trigger: 'blur',
					},
				],
				password: [
					{
						validator: validatePassWord,
						required: true,
						trigger: 'blur',
					},
				],
				code: [
					{
						validator: validateCode,
						required: true,
						trigger: 'blur',
					},
				],
			},
			emailSuffix: EMAIL_SUFFIX,
			sendCodeBtn: false,
			sendCodeMsg: '发送验证码',
			sendCodeNum: 60,
			signUpBtn: false,
			timer: null,
		};
	},

	methods: {
		// 输入建议
		querySearch(queryString, callback) {
			let [restaurants, results, email] = [[], [], ''];
			if (queryString.includes('@') && !queryString.startsWith('@')) {
				const emailRegExp = /^([a-z0-9]+(?:[._-][a-z0-9]+)*)@/;
				email = queryString.match(emailRegExp)[1];
				Array.from(this.emailSuffix).forEach(item => {
					restaurants.push({ value: `${email}${item.value}` });
				});
			}
			results = restaurants
				? restaurants.filter(this.createFilter(queryString))
				: restaurants;
			// 调用 callback 返回建议列表的数据
			callback(results);
		},
		createFilter(queryString) {
			return restaurant => {
				return restaurant.value.includes(queryString);
			};
		},

		// 发送验证码
		sendCode() {
			if (!this.vId) {
				return false;
			}
			const data = {
				type: this.data.type,
				id: this.data.id,
			};
			this.sendCodeBtn = true;
			this.sendCodeMsg = `重新发送 ${this.sendCodeNum}s`;
			this.setCodeTime().then(() => {
				this.sendCodeBtn = false;
				this.sendCodeMsg = '重新发送';
				this.sendCodeNum = 60;
			});
			this.signSendCodeFn(data);
		},

		// 提交
		onSubmit(formName) {
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return false;
				}
				this.signUpFn();
			});
		},

		// 登录页
		signIn() {
			this.$emit('toggleSign');
		},

		// 等待时间
		setCodeTime() {
			return new Promise(resolve => {
				this.timer = setInterval(() => {
					this.sendCodeNum -= 1;
					this.sendCodeMsg = `重新发送 (${this.sendCodeNum}s)`;

					if (this.sendCodeNum === 0) {
						clearInterval(this.timer);
						this.timer = null;
						resolve();
					}
				}, 1000);
			});
		},

		// keyup.enter
		onEnter(formName) {
			if (!this.vNickName || !this.vId || !this.vPassWord) {
				return false;
			}
			this.onSubmit(formName);
		},

		// signSendCode 方法封装
		signSendCodeFn(data) {
			signSendCode(data)
				.then(info => {
					if (info) {
						this.$message({
							showClose: true,
							center: true,
							message: '邮件已发送',
							type: 'success',
						});
					}
				})
				.catch(error => {
					clearInterval(this.timer);
					this.timer = null;
					this.sendCodeBtn = false;
					this.sendCodeMsg = '重新发送';
					this.sendCodeNum = 60;
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
				});
		},

		// signUp 方法封装
		signUpFn() {
			this.signUpBtn = true;
			this.$emit('setLoad', true);
			signUp(this.data)
				.then(resData => {
					storage.set('token', resData.token);
					this.$store.dispatch('token', resData.token);
					this.$store.dispatch('user', {
						userId: resData.userInfo.userId,
						nickName: resData.userInfo.nickName,
						avatar: '',
						birthday: '',
						groupId: '',
						intro: '',
						sex: '',
					});

					this.$emit('setLoad', false);
					this.$message({
						showClose: true,
						center: true,
						message: '注册成功',
						type: 'success',
					});
					this.$router.push({ name: 'information' });
				})
				.catch(error => {
					this.signUpBtn = false;
					this.$emit('setLoad', false);
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
				});
		},
	},
};
</script>

<style lang="scss" >
.form-sign-up {
	width: 100%;
	height: 100%;
	padding-top: 12%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;

	.el-form-item {
		width: 320px;
		.el-autocomplete {
			width: 100%;
		}
	}

	.el-form-item:nth-of-type(1) {
		.el-form-item__content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			.main-title {
				font-size: 30px;
			}
			.subtitle {
				margin-top: 10px;
				font-size: 22px;
			}
		}
	}
	.el-form-item:nth-of-type(2) {
		margin-top: 10px;
	}
	.el-form-item:nth-of-type(5) {
		.el-input {
			width: 40%;
			margin-right: 10%;
		}
		.el-button {
			width: 50%;
		}
	}
	.el-form-item:nth-last-of-type(2) {
		.sign-up-btn {
			width: 100px;
		}
		.sign-in-btn {
			color: #bbb;
			margin-left: 10px;
		}
	}
	.el-form-item:nth-last-of-type(1) {
		width: 100%;
		color: #bbb;
		text-align: center;
		position: absolute;
		left: 0;
		bottom: 10px;
	}
}
</style>
