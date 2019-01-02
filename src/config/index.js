// axios URL
const baseURL = 'http://localhost:3000';

// 上传头像 URL
const uploadImgUrl = 'http://localhost:3000/api/user/setUserAvatar';

const OPTIONS = [
	{
		value: 'String',
		label: 'String',
		disabled: false,
	},
	{
		value: 'Number',
		label: 'Number',
		disabled: false,
	},
	{
		value: 'Boolean',
		label: 'Boolean',
		disabled: false,
	},
	{
		value: 'Array',
		label: 'Array',
		disabled: true,
	},
	{
		value: 'Object',
		label: 'Object',
		disabled: true,
	},
];

const RULES = {
	categoryId: [{ required: true, message: '请输入分类 ID', trigger: 'blur' }],
	categoryItemId: [
		{ required: true, message: '请输入分类设备 ID', trigger: 'blur' },
	],
	id: [{ required: true, message: '请输入 ID', trigger: 'blur' }],
	name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
	value: [{ required: true, message: '请输入默认值', trigger: 'blur' }],
	unit: [{ required: false }],
	attrType: [
		{ required: true, message: '请选择属性类型', trigger: 'change' },
	],
};

export { baseURL, uploadImgUrl, OPTIONS, RULES };
