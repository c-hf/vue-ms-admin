// axios URL
const BASEURL = 'http://118.24.169.3/v1';

// 上传头像 URL
const UPLOADIMGURL = 'http://118.24.169.3/v1/api/user/setUserAvatar';

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

const DEVICEICON = {
	ceilingLamp: 'icon-light_lamp',
	tableLamp: 'icon-tableLamp',
	airConditioner: 'icon-airConditioner',
	LEDLamp: 'icon-light',
	alarm: 'icon-shengguangbaojingqi',
	airFan: 'icon-fengshan',
	flameSensor: 'icon-huoyantanceqi',
	humidityTemperatureSensor: 'icon-icon-temperature',
	lightIntensitySensor: 'icon-sensor-guangzhao',
	car: 'icon-chelianwang',
};

export { BASEURL, UPLOADIMGURL, OPTIONS, RULES, DEVICEICON };
