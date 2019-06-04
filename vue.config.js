const path = require('path');

module.exports = {
	// baseUrl: process.env.NODE_ENV === 'production' ? './' : '/',
	// baseUrl: '/smartHome/',
	// outputDir: 'dist',
	// outputDir: process.env.outputDir,
	// publicPath: '/smartHome/',
	// productionSourceMap: false,
	// configureWebpack: {
	// 	externals: {
	// 		vue: 'Vue',
	// 		'vue-router': 'VueRouter',
	// 		vuex: 'Vuex',
	// 		axios: 'axios',
	// 		'element-ui': 'ELEMENT',
	// 		dayjs: 'dayjs',
	// 		// TweenMax: 'TweenMax',
	// 		// Draggable: 'draggable',
	// 	},
	// },

	pluginOptions: {
		'style-resources-loader': {
			preProcessor: 'scss',
			patterns: [path.resolve(__dirname, 'src/assets/scss/_mixins.scss')],
		},
	},
};
