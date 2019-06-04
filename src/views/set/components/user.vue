<template>
    <el-row class="view-user"
            :gutter="24"
            v-loading="loading">
        <el-col :span="14"
                class="view-user-left">
            <el-form class="view-user-left-form"
                     :model="user"
                     :rules="rules"
                     ref="userForm"
                     label-width="100px">
                <el-form-item label="昵称"
                              prop="nickName">
                    <el-input v-model="user.nickName"
                              clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="介绍"
                              prop="intro">
                    <el-input type="textarea"
                              :autosize="{ minRows: 4, maxRows: 6}"
                              resize="none"
                              placeholder="请输入内容"
                              v-model="user.intro">
                    </el-input>
                </el-form-item>
                <el-form-item label="性别"
                              prop="sex">
                    <el-radio-group v-model="user.sex">
                        <el-radio label="男">
                            男
                        </el-radio>
                        <el-radio label="女">
                            女
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="生日"
                              prop="birthday">
                    <el-date-picker v-model="user.birthday"
                                    type="date"
                                    placeholder="年月日"
                                    align="center"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd"
                                    style="width: 200px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="bottom">
                    <el-button type="primary"
                               @click="submit('userForm')">
                        保存
                    </el-button>
                    <el-button @click="initalData">
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :offset="2"
                :span="8"
                class="view-user-right">
            <span class="view-user-right-avatar">
                <img :src="user.avatar"
                     v-if="user.avatar.length"
                     alt="avatar">
            </span>
            <el-upload class="view-user-right-btn"
                       :action="uploadImgUrl"
                       :show-file-list="false"
                       :on-success="setAvatarSuccess"
                       :before-upload="beforeAvatarUpload">
                <el-button plain
                           size="medium">
                    修改头像
                </el-button>
            </el-upload>
        </el-col>
    </el-row>
</template>

<script>
import { updateUserInfo } from '@/api/user';
import { UPLOADIMGURL } from '@/config';

export default {
	name: 'ViewUser',
	data() {
		// 昵称验证
		const validateNickName = (rule, value, callback) => {
			const nameRegExp = /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,18}$/;
			if (!value) {
				callback(new Error('请输入昵称'));
			} else {
				if (nameRegExp.test(this.user.nickName)) {
					callback();
					return;
				}
				callback(new Error('2 - 18 个字，支持中、英文、数字及 _'));
			}
		};
		const validateBirthday = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请选择生日'));
			} else {
				const time = Math.floor(
					(Date.now() - new Date(this.user.birthday).getTime()) /
						(1000 * 60 * 60)
				);
				if (time > 24) {
					callback();
					return;
				}
				callback(new Error('请选择正确的日期'));
			}
		};
		return {
			loading: false,
			disabled: true,
			uploadImgUrl: UPLOADIMGURL,
			rules: {
				nickName: {
					validator: validateNickName,
					required: true,
				},

				intro: {
					min: 1,
					max: 64,
					message: '长度在 1 到 64 个字符',
					trigger: 'blur',
				},

				birthday: {
					validator: validateBirthday,
					required: true,
				},

				sex: {
					required: true,
					message: '请选择生日',
					trigger: 'change',
				},
			},
			user: {
				nickName: '',
				avatar: '',
				intro: '',
				sex: '',
				birthday: '',
			},
		};
	},

	methods: {
		submit(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.updateUserInfoFn();
				} else {
					return false;
				}
			});
		},

		// 初始化数据
		initalData() {
			const user = {};
			Object.assign(user, this.$store.state.user);
			this.user = user;
		},

		// 上传成功回调
		setAvatarSuccess(resData, file) {
			this.isAvatarError = false;
			this.imgUrl = URL.createObjectURL(file.raw);
			this.user.avatar = resData.response.url;
			this.disabled = false;
		},

		// 上传限制
		beforeAvatarUpload(file) {
			const isLt2M = file.size / 1024 / 1024 < 2;
			if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
			}
			return isLt2M;
		},

		// 更新用户信息
		updateUserInfoFn() {
			this.loading = true;
			updateUserInfo(this.user)
				.then(resData => {
					if (resData.userId) {
						this.$store.dispatch('user', resData);
						this.$message({
							showClose: true,
							center: true,
							message: '保存成功！',
							type: 'success',
						});
					}
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
				})
				.then(() => {
					this.loading = false;
				});
		},
	},

	created() {
		this.initalData();
	},
};
</script>

<style lang="scss" scoped>
.view-user {
	height: 100%;
	padding: 20px;

	&-left {
		padding-top: 40px;

		&-form {
			height: 100%;

			.bottom {
				margin-top: 60px;
			}
		}
	}

	&-right {
		@include flex-center(column);

		&-avatar {
			width: 160px;
			height: 160px;
			margin-top: 60px;
			background-color: #fff;
			border: 2px solid rgba(151, 140, 140, 0.4);
			transform: translate(0);
			transition: all 0.5s;

			img {
				position: absolute;
				top: 0;
				left: 0;
			}
		}

		&-btn {
			margin-top: 10px;
		}
	}
}
</style>

