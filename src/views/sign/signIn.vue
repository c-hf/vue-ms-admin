<template>
    <el-form :model="data"
             :rules="rules"
             ref="signInForm"
             status-icon
             label-width="0"
             label-position="left"
             @keyup.enter.native="onEnter('signInForm')"
             class="form-sign-in">
        <el-form-item>
            <h1 class="main-title">登录</h1>
            <h2 class="subtitle">XXX 后台管理系统</h2>
        </el-form-item>
        <el-form-item prop="id">
            <el-autocomplete placeholder="邮箱"
                             :fetch-suggestions="querySearch"
                             :trigger-on-focus="false"
                             v-model="data.id">
            </el-autocomplete>
        </el-form-item>
        <el-form-item prop="password">
            <el-input placeholder="密码"
                      type="password"
                      v-model="data.password">
            </el-input>
        </el-form-item>
        <el-form-item size="medium">
            <el-button type="primary"
                       class="sign-in-btn"
                       @click="onSubmit('signInForm')">登录</el-button>
            <span class="sign-up-btn">
                没有账号？
                <el-button type="text"
                           @click="signUp">注册</el-button>
            </span>
        </el-form-item>
        <el-form-item>
            Copyright © 2018-2018 CHF All Rights Reserved
        </el-form-item>
    </el-form>
</template>

<script>
import { signIn, userAvatar } from '@/api/user';
import { EMAIL_SUFFIX } from './config';
import storage from '@/assets/js/storage';

export default {
	name: 'SignIn',
	data() {
		const validateId = (rule, value, callback) => {
			const [phoneRegExp, emailRegExp] = [
				/^1[0-9]{10}$/,
				/^[a-z0-9]+(?:[._-][a-z0-9]+)*@[a-z0-9]+(?:[._-][a-z0-9]+)*\.[a-z]{2,4}$/i,
			];
			if (!value) {
				this.vId = false;
				callback(new Error('请输入邮箱'));
			} else {
				// this.showCode = true;
				if (phoneRegExp.test(this.data.id)) {
					this.data.type = 'phone';
					userAvatar({
						id: this.data.id,
						type: this.data.type,
					})
						.then(data => {
							this.avatar = true;
							this.$emit('setAvatar', data);
							this.vId = true;
						})
						.catch(error => {
							this.$message({
								showClose: true,
								center: true,
								message: error.message,
								type: 'error',
							});
						});
					callback();
				} else if (emailRegExp.test(this.data.id)) {
					this.data.type = 'email';
					userAvatar({
						id: this.data.id,
						type: this.data.type,
					})
						.then(data => {
							this.avatar = true;
							this.$emit('setAvatar', data.avatar);
							this.vId = true;
						})
						.catch(error => {
							this.$message({
								showClose: true,
								center: true,
								message: error.message,
								type: 'error',
							});
						});
					callback();
				}
				this.vId = false;
				callback(new Error('请输入正确的邮箱'));
			}
		};
		const validatePassWord = (rule, value, callback) => {
			const nameRegExp = /^\S{6,16}$/;
			if (!value) {
				callback(new Error('请输入密码'));
			} else {
				nameRegExp.test(this.data.password)
					? callback()
					: callback(new Error('密码为 6 - 16 位，不支持空格'));
			}
		};
		return {
			emailSuffix: EMAIL_SUFFIX,
			vId: false,
			data: {},
			rules: {
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
			},
		};
	},
	methods: {
		// 输入联想
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
		// 提交表单
		onSubmit(formName) {
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return false;
				}
				signIn(this.data)
					.then(data => {
						storage.set('token', data.token);
						storage.set('id', data.emailId);
						this.$store.dispatch('token', data.token);
						this.$store.dispatch('user', data.userInfo);
						this.$message({
							showClose: true,
							center: true,
							message: '登录成功',
							type: 'success',
						});
						this.$router.push({ name: 'home' });
					})
					.catch(error => {
						this.$message({
							showClose: true,
							center: true,
							message: error.message,
							type: 'error',
						});
					});
			});
		},
		onEnter(formName) {
			if (!this.vId) {
				return false;
			}
			this.onSubmit(formName);
		},
		signUp() {
			this.$emit('toggleSign');
		},
	},
};
</script>

<style lang="scss">
.form-sign-in {
	width: 100%;
	padding-top: 12%;
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

	.el-form-item:nth-last-of-type(2) {
		.sign-in-btn {
			width: 100px;
		}
		.sign-up-btn {
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
