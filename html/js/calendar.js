define(['jquery'],function(){
	//日历插件
	var theCalendar = {
		/*
		 * dom为存储日历的dom节点。
		 * data为需要匹配的日期
		*/
		init : function(dom,dates,nowMonth){
			this.dates = dates;
			this.now = new Date();
			//this.oBox = $('#date');
			this.oBox = dom;
			this.oBox.html('');
			this.createMonth();
			this.createWeek();
			this.createDate();
			this.selectDate ='';

			if(nowMonth){
				this.update(nowMonth)
			}
		},
		//创建月
		createMonth : function(){
			var _self = this;
			var isPrev = false;

			_self.oldDate = _self.now.getDate();
			_self.changeDate = 0;

			_self.year = _self.now.getFullYear();
			_self.month = _self.now.getMonth();//当前月

			$('<div class="month"><a class="change-prev" href="javascript:;"></a><span></span><a class="change-next" href="javascript:;"></a></div>').appendTo(_self.oBox);

			_self.oBox.find('.month').find('span').html(this.year + '年' + (this.month+1) + '月').end().on('click',function(e){
				if(e.clientX < $(e.currentTarget).offset().left + e.currentTarget.clientWidth/2){
					_self.update(-1);
				}
				else{
					_self.update(1);
				}
			});

			/*
			_self.oBox.find('.change-prev').on('click',function(){
				//if($(this).hasClass('disabled')) return false;

				_self.update(-1);
				//$(this).addClass('disabled');
				//$('.change-next').removeClass('disabled');

			});
			_self.oBox.find('.change-next').on('click',function(){
				//if($(this).hasClass('disabled')) return false;

				_self.update(1);

				//$(this).addClass('disabled');
				//$('.change-prev').removeClass('disabled');
			});
			*/
		},
		update : function(offset){
			var day = 1;
			this.changeDate += offset;
			if(this.changeDate == 0){
				day = this.oldDate;
			}

			this.now = new Date((new Date()).setFullYear(this.year,this.month+offset,day));

			this.year = this.now.getFullYear();
			this.month = this.now.getMonth();//当前月

			this.oBox.find('.month').find('span').html(this.year + '年' + (this.month+1) + '月');
			this.createDate();
		},
		//创建星期
		createWeek : function(){

			var arrWeek = ['日','一','二','三','四','五','六'];
			var oWeekUl = $('<ul class="week-list clearfix"></ul>');
			for(var i=0; i<arrWeek.length; i++){
				var aHeadLi = $('<li></li>');
				if(i==0||i==arrWeek.length-1){
					aHeadLi.addClass('red');
				}
				aHeadLi.html(arrWeek[i]).appendTo(oWeekUl);
				
			}
			oWeekUl.appendTo(this.oBox);
		},
		//创建日期
		createDate : function(){
			var arrMonth = [31,29,31,30,31,30,31,31,30,31,30,31];//每月最多日
			var oDateCnt = this.oBox.find('.date-list').length ? this.oBox.find('.date-list') : $('<ul class="date-list clearfix"></ul>');
			var oFirst = this.getFirstDay( this.now.getTime() );
			var oLast = this.getLastDay( this.now.getTime() );
			var datestr = '';
			var datehtml = '';
			var _self = this;
			var nowmonth = 0;
			var baseday = this.now.getDate();//当前日期
			if(this.now.getFullYear() % 4 === 0){
				arrMonth[1] = 29;
			}

			oDateCnt.html('');

			//小于当前月的日期全部过期，大于当前月的日期全部不过期
			if(_self.changeDate<0){
				baseday = 31;
			}
			else if(_self.changeDate>0){
				baseday = 0;
			}

			//前一月末尾几天
			for(var i=oFirst-1; i>=0; i--){
				
				//当前日期拼装
				if(_self.month == 0){
					nowmonth = 11;
					datestr = (_self.year -1) + '-12' + '-' + (arrMonth[nowmonth]-i);
				}
				else{
					nowmonth = _self.month-1;
					datestr = _self.year + '-' + ( _self.month >= 10 ? _self.month : ('0'+ (_self.month) ) ) + '-' + (arrMonth[nowmonth]-i);
				}	

				/*
				if($.inArray(datestr,_self.dates) != -1){
					datehtml += '<li class="before gray" data-date="'+ datestr +'">'+(arrMonth[nowmonth]-i)+ '<br>开课' +'</li>';
				}
				else{
					datehtml += '<li class="before gray" data-date="'+ datestr +'">'+(arrMonth[nowmonth]-i)+'</li>';
				}
				*/
				datehtml += '<li class="before gray" data-date="'+ datestr +'"></li>';
			};

			//当月所有日期
			for(var j=1; j<=arrMonth[_self.month]; j++){
				datehtml += '<li class="';

				/*
				//周六周日高亮
				if((j+oFirst)%7==0||(j+oFirst-1)%7==0){
					datehtml += 'red ';
				};
				
				//过时的日期变灰
				if(j<baseday){
					datehtml += 'gray ';
				};
				*/

				//当前日期拼装
				datestr = _self.year + '-' + (_self.month+1 >= 10 ? (_self.month+1) : ('0'+ (_self.month+1) )) + '-' + (j >= 10 ? j : ('0' + j));
				//有开课
				if($.inArray(datestr,_self.dates) != -1){
					if(j<baseday){
						datehtml += 'sign gray" data-date="'+ datestr +'">';
					}
					else{
						//已选择日期
						if(datestr === _self.selectDate){
							datehtml += 'sign current" data-date="'+ datestr +'">';
						}
						else{
							datehtml += 'sign" data-date="'+ datestr +'">';
						}
					}
					datehtml += j + '<br>开课</li>';
				}
				else{
					datehtml += 'gray" data-date="'+ datestr +'">';
					datehtml += j + '</li>';
				}
			};

			//下一月前几天
			for(var k=oLast+1; k<7; k++){

				//当前日期拼装
				if(_self.month == 11){
					datestr = (_self.year +1) + '-01' + '-0' + (k-oLast);
				}
				else{
					datestr = _self.year + '-' + ( _self.month+2 >= 10 ? (_self.month+2) : ('0'+ (_self.month+2) ) ) + '-0' + (k-oLast);
				}

				//datehtml +=  '<li class="after gray" data-date="'+ datestr +'">'+(k-oLast)+'</li>';
				datehtml +=  '<li class="after gray" data-date="'+ datestr +'"></li>';
			}

			if(_self.oBox.find('.date-list').length){
				oDateCnt.append(datehtml)
			}
			else{
				oDateCnt.append(datehtml).appendTo(_self.oBox);
			}

			oDateCnt.on('click','.sign',function(e){
				if(!$(this).hasClass('gray')){
					_self.selectDate = $(this).data('date');
					$(this).addClass('current').siblings().removeClass('current');
					if(!_self.oBox.find('.show-select').length){
						$('<div class="show-select">您已选择：<span>'+ _self.selectDate + '</span></div>').appendTo(_self.oBox);
					}
					else{
						_self.oBox.find('.show-select').html('您已选择：<span>'+ _self.selectDate + '</span>');
					}
				}
				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		},
		//每月第一天对应的星期
		getFirstDay : function(now){
			var d = new Date(now);
			d.setDate(1);
			return d.getDay();
		},
		////每月最后一天对应的星期
		getLastDay : function(now){
			var d = new Date(now);
			var arrMonth = [31,28,31,30,31,30,31,31,30,31,30,31];//每月最多日
			if(this.now.getFullYear() % 4 === 0){
				arrMonth[1] = 29;
			}
			d.setDate(arrMonth[d.getMonth()]);
			return d.getDay();
		}
	}
	return theCalendar;
});