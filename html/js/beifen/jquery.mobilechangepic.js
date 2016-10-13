//焦点图
;(function($){
	$.fn.focuschange = function(opt,callback){
		/*
		**	opt.auto 控制自动播放，默认为true
		**	opt.cycle 控制是否循环，auto为true时恒为true
		**  opt.once 单位长度，默认为1
		**  callback 切换时可以执行的事情，便于插件之外做一些事情
		*/
		var self = this;
		var auto,cycle,len,once=1,now=0,timer;
		var rundom = self.find('.pic');
		var list = rundom.find('li');
		var idxdom = self.find('.idx');
		var oncewidth = self.width();
		var oMouseTime = null;
		var autoRunVedio = null;
		var iDefault = false;

		len = Math.ceil(list.length/once);

		if(opt){
			if(!$.isJson(opt)){
				console.log('请检查你所传入的数据格式!');
				return false;
			}
			else{
				auto = (opt.auto && len>1) ? true : false;
				cycle = auto ? true : opt.cycle;
				once = opt.once ? parseInt(opt.once) : 1;
			}
		}

		self.data('focusopen',true);

		if(idxdom.length && len>1){
			idxdom.html('');
			for (var i = 0; i < len; i++) {
				idxdom.append('<i></i>')
			};
			idxdom.find('i').eq(0).addClass('current');
		}
		if(once == 1){
			list.width(oncewidth);
		}
		
		if(cycle){
			list.eq(0).clone().appendTo(rundom);
			list.eq(0).before(list.eq(list.length-1).clone());
			now = 1;
		}
		//console.log(oncewidth +'++++'+len)

		len = Math.ceil(rundom.find('li').length/once);
		rundom.width(oncewidth*len).css('left',-oncewidth*now+'px');

		if(auto){
			clearInterval(timer);
			timer = setInterval(function(){
				change(now+1);
			},3000);
		}

		self.on('touchstart',function(ev){
			var touch = ev.originalEvent.targetTouches[0];
			var iState = true;
			//判断触发方向，当次只能触发一个方向的touch事件
			var iHandle = true;
			try{
				touch = ev.changedTouches[0]
			}catch(err){}
			iDefault = true;
			rundom.stop(true,true);

			var disX = touch.pageX;
			var disY = touch.pageY;
			var nowL = parseInt(rundom.css('left'));

			clearInterval(autoRunVedio);

			$(document).on('touchmove',function(e){	

				var touch = e.originalEvent.changedTouches[0];
				try{
					touch = e.changedTouches[0]
				}catch(err){}

				var iL = touch.pageX - disX;
				var iT = touch.pageY - disY;

				//竖向滚动
				if(iHandle && Math.abs(iL)<Math.abs(iT)){
					iHandle = false;
				}
				//横向滚动
				if(iHandle){
					rundom.css('left',nowL+iL+'px');
				
					clearTimeout(oMouseTime);
					oMouseTime = setTimeout(function(){
						
						if(iState){
							iState = false;
							$(document).off('touchmove');
							if(iL<-200){
								change(now+1);
							}
							else if(iL>200){
								change(now-1);
							}
							else{
								change(now);
							}
						}
					},200);
					//在touchstart中取消默认行为会阻止整个页面无法正常滚动，加在这儿值阻止横向默认行为就不会影响整个页面了
					return false;
				}
			}).on('touchend',function(e){
				if(iState){
					var  touch = e.originalEvent.changedTouches[0];
					try{
						touch = e.changedTouches[0];
					}catch(err){}

					var iL = touch.pageX - disX;

					if(iL<-100){
						change(now+1);
					}
					else if(iL>100){
						change(now-1);
					}
					else{
						change(now);
					}

					$(this).off('touchmove touchend');
					iState = false;
				}
			});
			
		});

		function change(index){

			var base = now-index;
			var toidx;
			var newidx = now-base;

			if(cycle){
				//最后及最前
				if(index>len-2){
					toidx = 'first';
				}
				if(index<1){
					toidx = 'last';
				}
				//索引控制
				if(newidx == len-1){
					newidx = 1;
				}
				else if(newidx == 0){
					newidx = len-2;
				}
			}
			else{
				if(index>len-1 || index<0){
					base = 0;
					index = now;
				}
				newidx = index + 1;
			}

			rundom.animate({'left':-(now-base)*oncewidth+'px'},200,function(){

				if(toidx){
					switch(toidx){
						case 'first':
							index = 1;
							break;
						case 'last':
							index = len-2;
							break;
					}
					rundom.css({'left':-index*oncewidth+'px'})
				}
				
				now = index;
				if(auto){
					clearInterval(timer);
					timer = setInterval(function(){
						change(now+1);
					},3000);
				}
			});

			callback && typeof callback == 'function' && callback(newidx-1,len);

			if(idxdom.length){
				idxdom.find('i').eq(newidx-1).addClass('current').siblings().removeClass('current');
			}
		};
		//为插件外切换提供接口
		return {
			change : function(i){
				change(i);
			}
		};
	};
	$.isJson = function(obj){
		var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
		return isjson;
	};
})(jQuery);