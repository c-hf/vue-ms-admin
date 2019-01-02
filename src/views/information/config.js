export const RULES = {
	groupName: [
		{
			required: true,
			message: '请输入名称',
			trigger: 'blur',
		},
		{
			min: 3,
			max: 12,
			message: '长度在 3 到 12 个字符',
			trigger: 'blur',
		},
	],
	region: [
		{
			required: true,
			message: '请选择居住地',
			trigger: 'change',
		},
	],
};
