define(['jquery','weixin','base'],function($,wx,base){
	//opt.hidemenu 不为false时隐藏微信菜单
	//opt.showmenu 不为false时显示微信菜单
	//opt.share 为object时启用自定义分享
	//opt.scan 为true时调用微信扫一扫,为function类型时当做callback接受返回数据
	//opt.preview 控制调用微信图片预览
	var weixinctl = function(opt,openid,callback){
		
		if(!window.wxtoken || openid){
			var link = location.origin + location.pathname;
			if(location.href.indexOf('?pay=true')!==-1){
				link = location.origin + location.pathname+'?pay=true';
			}
			var postdata = {
				Htmlurl: link
			};
			if(openid){
				postdata.openid = openid;
			}
			//请求签名
			$.ajax('/API/WxAbout/GetWXtoken',{
				type: 'post',
				data: postdata,
				beforeSend: function(){},
				complete: function(){}
			}).done(function(res){
				//if (res.status !== 1) {
				//	base.ui.alert(res.msg);
				//	return false;
				//}
				res = JSON.parse(res);
				window.wxtoken = res;

				if(!window.wxconfig || openid){
					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: window.wxtoken.appId,
						timestamp:window.wxtoken.timestamp,
						nonceStr: window.wxtoken.nonceStr,
						signature: window.wxtoken.signature,
						jsApiList: [
							'checkJsApi',
							'onMenuShareTimeline',
							'onMenuShareAppMessage',
							'onMenuShareQQ',
							'onMenuShareWeibo',
							'hideMenuItems',
							'showMenuItems',
							'hideAllNonBaseMenuItem',
							'showAllNonBaseMenuItem',
							'translateVoice',
							'startRecord',
							'stopRecord',
							'onRecordEnd',
							'playVoice',
							'pauseVoice',
							'stopVoice',
							'uploadVoice',
							'downloadVoice',
							'chooseImage',
							'previewImage',
							'uploadImage',
							'downloadImage',
							'getNetworkType',
							'openLocation',
							'getLocation',
							'hideOptionMenu',
							'showOptionMenu',
							'closeWindow',
							'scanQRCode',
							'chooseWXPay',
							'openProductSpecificView',
							'addCard',
							'chooseCard',
							'openCard'
						]
					});
					window.wxconfig = true;
				}
				if(typeof callback === 'function'){
					callback();
				}
				wxfun(opt);
			});
		}
		else{
			wxfun(opt);
		}
	};

	function wxfun(opt){
		
		opt = opt || {};

		wx.ready(function (){

			if(opt.hidemenu){
				wx.hideOptionMenu();
			}

			if(opt.showmenu){
				wx.showOptionMenu();
			}

			//微信扫一扫
			if(opt.scan){
				wx.scanQRCode({
					needResult: (typeof opt.scan === 'function' ? 1 : 0), // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
					scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
					success: function (res) {
						var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
						if(typeof opt.scan === 'function'){
							opt.scan(result);
						}
					}
				});
			}

			//调用微信相册
			if(opt.preview){
				wx.previewImage(opt.preview);
			}
            //
			////调用微信支付
			//if(opt.pay){
			//	wx.chooseWXPay({
			//		timestamp: opt.pay.oldTimeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
			//		nonceStr: opt.pay.oldNonceStr, // 支付签名随机串，不长于 32 位
			//		package: 'prepay_id=' + opt.pay.PayId, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
			//		signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
			//		paySign: opt.pay.sign, // 支付签名
			//		success: function (res) {
			//			// 支付成功后的回调函数
			//			if(opt.pay.reload){
			//				window.location.reload();
			//			}
			//			else{
			//				location.hash = opt.pay.hash;
			//			}
			//		},
			//		cancel: function(res){
			//			base.ui.alert('您已经取消了支付');
			//		},
			//		fail: function(res){
			//			// 支付失败后的回调函数
			//			base.ui.alert('支付失败',function(){
			//				if(opt.pay.hash){
			//					location.hash = opt.pay.hash+'/fail';
			//				}
			//			});
			//		}
			//	});
			//}

			//分享数据为json时自定义分享
			if(opt.share && typeof opt.share === "object" && Object.prototype.toString.call(opt.share).toLowerCase() === "[object object]"){
				var link = location.origin + location.pathname;
				var oDomBox = null;
				var wxdata = opt.share;
					
				wx.onMenuShareAppMessage({
			
					desc: wxdata.desc, // 分享描述
					title: wxdata.title, // 分享标题
					link: wxdata.link, // 分享链接
					imgUrl: wxdata.imgUrl, // 分享图标
					type: '', // 分享类型,music、video或link，不填默认为link
					dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					success: function (){ 
						// 用户确认分享后执行的回调函数
						if( typeof opt.share.callback === 'function' ){
							opt.share.callback('分享给朋友');
						}
					},
					cancel: function (){ 
						// 用户取消分享后执行的回调函数
					}
					
				});
				wx.onMenuShareTimeline({
					title: wxdata.title2 || wxdata.title, // 分享标题
					link: wxdata.link, // 分享链接
					imgUrl: wxdata.imgUrl, // 分享图标
					success: function () { 
						// 用户确认分享后执行的回调函数
						if( typeof opt.share.callback === 'function' ){
							opt.share.callback('分享朋友圈');
						}
					},
					cancel: function (){ 
						// 用户取消分享后执行的回调函数
					}
				});
			}
			
		});
		wx.error(function(res){
			//alert(1111)
			// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
			//alert(JSON.stringify(res))
			//请求签名
			$.ajax('/API/WxAbout/GetWXtoken_new',{
				type: 'post',
				data: {},
				beforeSend: function(){},
				complete: function(){}
			}).done(function(res){
				//wxfun(opt);
				//window.location.reload();
			})
		});
	}

	return weixinctl;
});