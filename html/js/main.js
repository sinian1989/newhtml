require.config({
	baseUrl: './js/',
	paths: {
		'jquery': 'lib/jquery',
		'lazyload': 'lib/jquery.lazyload',
		'underscore': 'lib/underscore',
		'Backbone': 'lib/backbone',
		'juicer': 'lib/juicer.min',
		'Swiper': 'lib/swiper.min',
		'weixin': 'lib/jweixin-1.0.0',
		'pingpp': 'lib/pingpp',
		'calendar': 'calendar',
		'base': 'base',
		'app': 'app',
		'view': 'view',
		'hammer': 'lib/hammer.min',
		'funcs': 'funcs',
		'qas': 'qas'
	},
	shim: {
		'Backbone' : { 
			exports: 'Backbone',
			deps: ['jquery','underscore']
		},
		'jquery':{
			exports: '$'
		},
		'lazyload' : {
			deps: ['jquery']
		},
		'iscroll': {
			exports: 'iScroll'
		}
	}
});
define(['app'], function (app) {
	app.init();
});