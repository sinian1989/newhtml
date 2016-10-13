/**
 * Created by Administrator on 16-5-11.
 */
define(['jquery'],function(){
    //日历插件
    var theCalendar = {
        /*
         * dom为存储日历的dom节点。
         */
        init : function(dom){
            this.now=new Date();
            //this.now = new Date();
            this.oBox = dom;
            this.oBox.html('');
            this.createMonth();
            this.createWeekAndDate();
            this.selectDate ='';
        },
        //创建月
        createMonth : function(){
            var _self = this;
            var isPrev = false;

            _self.oldDate = _self.now.getDate();
            _self.changeDate = 0;

            _self.year = _self.now.getFullYear();
            _self.month = _self.now.getMonth();//当前月
            _self.date = _self.now.getDate();//当前日

            $('<div class="month"><a class="change-prev disabled" href="javascript:;"></a><span></span><a class="change-next" href="javascript:;"></a></div>').appendTo(_self.oBox);
            _self.oBox.find('.month').find('span').html(this.year + '年～' + (this.month+1) + '月')
                .end().on('click',function(e){
                if(e.clientX < $(e.currentTarget).offset().left + e.currentTarget.clientWidth/2){
                    var n=new Date();
                    if(_self.now<n){
                        //$('.change-prev').addClass('disabled');
                        return false
                    }else{
                        _self.update(-7);
                        if(_self.now<n){
                            $('.change-prev').addClass('disabled');
                        }
                    }
                }
                else{
                    $('.change-prev').removeClass('disabled');
                    _self.update(7);
                }
            });
        },
        update : function(offset){
            var now=this.now.getDate()+offset;
            this.now = new Date(this.now.setDate(now));
            //var now=this.now.getDate()+offset;
            //this.now=
            this.year = this.now.getFullYear();
            this.month = this.now.getMonth()+1;//当前月
            this.date=this.now.getDate();

            this.oBox.find('.month').find('span').html(this.year + '年～' + this.month + '月');
            $('.week-list1').remove();
            this.createWeekAndDate();
            var uid=$('.kcb_down').data('uid');
            //var cw = this.model.get('cw');
            var mdates = this.year + '-' + this.month + '-' + this.date;
            $.ajax('/API/Shop/GetShopClassweek',{type:'post', data:{date:mdates}}).done(function(res){
                $('#mzkc').html('');
                var data=res.info;
                var str='';
                var str1='';
                //var stype=['','剪裁', ' 染色',  '造型 ','烫发', '编盘','接发','管理','营销'];
                var aelems = [];
                for(var i=0;i<data.length;i++){
                    if(data[i].types.length!==0){
                        var data1=data[i].types;
                        str1='';
                        for(var k=0;k<data1.length;k++){
                            //str1+='<a href="#detail/'+data1[k].sid+'/'+uid+'">'+stype[data1[k].type]+'</a>';
                            str1+='<a data-date="'+data[i].date+'" data-type="'+data1[k]+'" href="#classlist/'+uid+'"><img src="images/s'+data1[k]+'.png" alt=""/></a>';
                        }
                    }else{
                        str1='';
                        str1+='<a href="javascript:;">无</a>';
                    }
                   str='<li>'+str1+'</li>';
                    aelems.push(str);
                }
                $('#mzkc').append(aelems.join(''));
                var height=$('.kcb_down ul').height();
                $('.kcb_down li').height(height);
                //$('#mzkc li a').click(function(){
                //
                //})
            })

        },
        createWeekAndDate : function(){
            var num=1;
            var arrMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
            var year=this.now.getFullYear();
            if((year % 4 === 0&&year%100!=0)||(year%400==0)){
                arrMonth[1] = 29;
            }
            var tmonth=this.now.getMonth()+1;
            var tmonth_length=arrMonth[tmonth-1];
            var today=this.now.getDay()+1;
            var tdat=this.now.getDate()+1;
            var arrWeek = ['周日','周一','周二','周三','周四','周五','周六'];
            arrWeek=arrWeek.slice(today).concat(arrWeek.slice(0,today));
            var oWeekUl = $('<ul class="week-list1 clearfix"></ul>');
            for(var i=0; i<arrWeek.length; i++){
                var aHeadLi = $('<li></li>');
                if(arrWeek[i]=='周六'||arrWeek[i]=='周日'){
                    aHeadLi.addClass('red');
                }
                if((tdat+i)<=tmonth_length){
                    aHeadLi.html((tdat+i)+'<br/>'+arrWeek[i]).appendTo(oWeekUl);
                }else{
                    aHeadLi.html((num++)+'<br/>'+arrWeek[i]).appendTo(oWeekUl);
                }

            }
            oWeekUl.appendTo(this.oBox);

        }

    };
    return theCalendar;
});