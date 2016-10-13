define(['Backbone','routes'], function(Backbone, Routes) {
	return {
		init : function(){
			//配置路由
			var router = Backbone.Router.extend({
				routes: {
					//"": 					Routes.router("index"),//首页
					"index/:uid": 				Routes.router("index"),//首页
					"classlist/:uid": 				Routes.router("classlist"),//课程列表
					"classlisttop/:uid": 				Routes.router("classlisttop"),//课程列表top10
					"classlist/:uid/:dbid":			Routes.router("classlist"),//戴柏课程列表
					"classlist/:uid/:dbid/:word":			Routes.router("classlist"),//关键字搜索跳转
					"detail/:id/:uid/:openid": 				Routes.router("detail"),//微信课程详情
					"detail/:id/:uid": 				Routes.router("detail"),//课程详情
					"detailold/:id/:uid": 				Routes.router("detailold"),//课程详情
					"detailold/:id/:uid/:openid": 				Routes.router("detailold"),//课程详情
					"dssppl/:id/:index/:uid": 		Routes.router("dssppl"),//商品详情、导师详情、评论详情
					"accounts/:id/:uid/:openid": 			Routes.router("accounts"),//微信下单
					"accounts/:id/:uid": 			Routes.router("accounts"),//下单
					"olist/:uid": 			Routes.router("olist"),//订单列表
					"odetail/:oid/:openid": 			Routes.router("odetail"),//微信订单详情
					"odetail/:oid": 			Routes.router("odetail"),//订单详情
					"boboclass/:uid": 			Routes.router("boboclass"),//波波俱乐部课程
					"cityclass/:uid/:clubid":				Routes.router("cityclass"),//上海俱乐部
					"evaluating/:index/:uid": 			Routes.router("evaluating"),//评级
					"hairschool":					Routes.router("hairschool"),//美发学院
					"hairschool/:uid":					Routes.router("hairschool"),//美发学院
					"daibai/:clubid":				Routes.router("daibai"),//戴柏美发技术进修
					"daibai/:clubid/:uid":				Routes.router("daibai"),//戴柏美发技术进修
					"dbxyjs/:clubid/:uid":				Routes.router("dbxyjs"),//戴柏美发技术进修
					"dbdstd/:clubid/:uid":				Routes.router("dbdstd"),//戴柏美发技术进修
					"dbzxtg/:clubid/:uid":				Routes.router("dbzxtg"),//戴柏美发技术进修
					"dbzxkc/:clubid/:uid":				Routes.router("dbzxkc"),//戴柏美发技术进修
					"dbxyhd/:clubid/:uid":				Routes.router("dbxyhd"),//戴柏美发技术进修

					"search/:uid":				Routes.router("search"),//课程搜索
					"search/:uid/:fuid":				Routes.router("search"),//分享课程搜索
					"classlistf/:uid/:fuid": 				Routes.router("classlistf"),//分享课程列表
					"detailf/:id/:uid/:fuid": 				Routes.router("detailf"),//分享课程详情
					"accountsf/:id/:uid/:fuid": 			Routes.router("accountsf"),//分享下单
					"accountsf/:id/:uid/:fuid/:openid": 			Routes.router("accountsf"),//分享微信下单
					"*anything": Routes.router("notFound")//无效路由
				}
			});
			new router();
			Backbone.history.start({pushstate:true});
		}
	};
});	