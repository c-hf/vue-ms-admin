const suffix = 'key';
export const INFORMATION_DATA_KEY = `information-content-${suffix}`;
export const PARAM_DATA_KEY = `param-content-${suffix}`;
export const CATEGORY_CONTENT_UPDATE_TIME_INTERVAL = 1 * 24 * 60 * 60 * 1000; // 过期时间

// 验证规则
export const RULES = {
	id: [
		{
			required: true,
		},
	],
	name: [
		{
			required: true,
			message: '请输入设备名称',
			trigger: 'blur',
		},
		{
			min: 4,
			max: 16,
			message: '长度在 4 到 16 个字符',
			trigger: 'blur',
		},
	],
	type: [
		{
			required: true,
			message: '请选择设备类型',
			trigger: 'change',
		},
	],
	desc: [
		{
			required: true,
			message: '请输入设备描述',
			trigger: 'blur',
		},
		{
			min: 0,
			max: 128,
			message: '0 到 128 个字符',
			trigger: 'blur',
		},
	],
	os: [
		{
			required: true,
			message: '请选择操作系统',
			trigger: 'change',
		},
	],
	networking: [
		{
			required: true,
			message: '请选择联网方式',
			trigger: 'change',
		},
	],
	protocol: [
		{
			required: true,
			message: '请选择设备接入协议',
			trigger: 'change',
		},
	],
};

// 数据源
export const OPTIONS = [
	{
		value: 'power',
		label: '电源开关',
		children: [
			{
				value: 'socket',
				label: '智能插座',
			},
		],
	},
	{
		value: 'lighting',
		label: '照明',
		children: [
			{
				value: ' LEDLamp',
				label: 'LED灯',
			},
			{
				value: ' ceilingLamp',
				label: '吸顶灯',
			},
			{
				value: 'bedsideLamp',
				label: '床头灯',
			},
			{
				value: 'tableLamp',
				label: '台灯',
			},
		],
	},
	{
		value: 'environment',
		label: '环境电器',
		children: [
			{
				value: 'airConditioner',
				label: '空调',
			},
			{
				value: 'airPurifier',
				label: '空气净化器',
			},
			{
				value: 'pm2.5Detector',
				label: 'Pm2.5检测仪',
			},
		],
	},
	{
		value: 'sensor',
		label: '传感器',
		children: [
			{
				value: 'smokeAlarm',
				label: '烟雾报警器',
			},
			{
				value: 'tempHumiditySensor',
				label: '温湿度传感器',
			},
		],
	},
	{
		value: 'kitchen',
		label: '厨房电器',
		children: [
			{
				value: 'refrigerator',
				label: '冰箱',
			},
			{
				value: 'kettle',
				label: '电热水壶',
			},
		],
	},
];
