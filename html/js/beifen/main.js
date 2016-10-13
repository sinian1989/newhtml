$(function(){

	//加载日期
	$.ajax({url: '/Order/GetWorkTime', dataType: 'json'}).done(function(data){
		if(data.DateValues && data.DateValues.length){
			var sWeek = '';
			for (var i = 0; i < 6; i++) {
				sWeek += '<a href="javascript:;" data-day="'+ data.DateValues[i].Date +'" data-start="'+ data.DateValues[i].StartTime +'" data-end="'+ data.DateValues[i].EndTime +'">'
						+'<span>'+ data.DateValues[i].Y +'</span>'+ data.DateValues[i].Z
						+'</a>'
			};
			$('.rev-week').html(sWeek).find('a').eq(0).click();
		}
	});

	//选择预约日期
	$('.rev-week').on('click','a',function(){
		$(this).addClass('active').siblings().removeClass('active');
		/*--计算当天可以选择的时间--*/
		var myDate = new Date();
		var dtime = $(this).data("day");
		var stime = $(this).data("start").split(':');
		var etime = $(this).data("end").split(':');
		var a = parseInt(stime[0]);
		var b = parseInt(etime[0]);
		var str1 = 0;//
		var str2 = 0; //
		if (b < a) {
			$('.select-time').html("");
			return;
		}
		else if ((a == b) || (parseInt(etime[1]) < parseInt(stime[1]))) {
			$('.select-time').html("");
			return;
		}
		else {
			if (30 <= parseInt(stime[1]) && parseInt(stime[1]) < 60) {
				str1 = 1;
			}
			if (3 <= parseInt(etime[1]) && parseInt(etime[1]) < 60) {
				str2 = 1;
			}
			var strhtml = "<option value=\"\">请选择时间</option>";
			var beg = a + str1;
			var ends = ((b - a) * 2) + str2;
			for (var i = 0 ; i <= ends ; i++) {
				if (str1 == 0) {
					strhtml += "<option value=\"" + a + ":00\">" + a + ":00</option>";
					str1 = 1;
				}
				else {
					strhtml += "<option value=\"" + a + ":30\">" + a + ":30</option>";
					a++;
					str1 = 0;
				}
			}
			$('.input-time').html('').removeClass('hasimg');
			$('.select-time').html(strhtml);
			$('.select-time').show();
		}
		/*--时间计算结束--*/
	});
	//选择预约时间
	if($('.input-time').val() != ''){
		$('.input-time').removeClass('hasimg');
	}
	$('.select-time').on('change',function(){
		$('.input-time').html($(this).val()).removeClass('hasimg');
	});
	//输入地址
	var oTimePlace = null;
	$('.input-place').on('input',function(){
		var _self = $(this);
		clearTimeout(oTimePlace);
		oTimePlace = setTimeout(function(){
			//请求相关地址
			$.ajax({
				url: 'http://api.map.baidu.com/place/v2/suggestion?query='+ _self.val() +'&region=上海&output=json&ak=LOoFXO0NxsgLd6BgTjGxb2ZD&callback=?',
				dataType: 'jsonp',
				success: function(data){
					if(data.status == 0){
						var placehtml = '';
						var i = 0,max=data.result.length>10 ? 10: data.result.length;
						for (; i < max; i++) {
							placehtml += '<li><span class="place">'+ data.result[i]['name'] +'</span><span class="city">'+ data.result[i]['city'] + data.result[i]['district'] +'</span></li>'
						};
						$('.getplace').html(placehtml);
					}
					else{
						$('.getplace').html('');
					}
				}
			});
		},200);
	});
	$('.getplace').on('click','li',function(){
		$('.input-place').val($(this).find('.place').html());
		$('.getplace').html('');
	});

	//输入预约手机号
	$('.input-phone').on('input',function(){
		$(this).val($(this).val().replace(/\D/g,''));
	});
	//立即预约
	var issubmit = false;
	$('.rev-now-btn').on('click',function(){
		var revData = {};
		var link = '';

		if(issubmit) return false;
		issubmit = true;

		revData.you = '353';
        revData.id = '36';
        revData.pri = '0.00';

		revData.date = $('.input-time').html();
		if(revData.date == ''){
			alert('请选择预约时间');
			issubmit = false;
			return false;
		}

		revData.phone = $('.input-phone').val();
		if(revData.phone == '' || revData.phone.search(/^(13|15|17|18|19)\d{9}$/g) == -1){
			alert('请输入正确地手机号码');
			issubmit = false;
			return false;
		}
		else{
			var bPhone = true;
			$.ajax({
				async: false,
				url: '/Order/CHKCall/'+revData.phone,
				dataType: 'text'
			}).then(function(msg){
				if(msg != 0){
					bPhone = false;
				}
			},function(){
				bPhone = false;
			});
		}
		if(!bPhone){
			alert('当前手机号码已被注册无法享受优惠')
			issubmit = false;
			return false;
		}

		//地址处理
		revData.ph = $('.input-place').val();
		if(revData.ph == ''){
			alert('请选输入服务详细地址');
			issubmit = false;
			return false;
		}
		else{
			//把地址转换成经纬度
			$.ajax({
				url: 'http://api.map.baidu.com/geocoder/v2/?ak=LOoFXO0NxsgLd6BgTjGxb2ZD&callback=renderOption&output=json&address='+ revData.ph +'&city=上海市',
				dataType: 'jsonp'
			}).then(function(res){

				if(res.status == 0){
					revData.lng = res.result.location.lng;
					revData.lat = res.result.location.lat;
					//查询地址是否在服务范围
					return $.ajax({ url: '/Order/CHKlng/'+Encrypt(encodeURIComponent(revData.lng))+'/'+Encrypt(encodeURIComponent(revData.lat)), dataType: 'text'});
				}
				return false;
			},function(){
				return false;
			}).then(function(data){
				if(data){
					if(data>1){
						//时间加上日期
						revData.date = $('.rev-week .active').data('day') + ' ' + revData.date;
						$.param(revData);
						$.ajax({
							url: '/Order/AddOrderHuo',
							type: 'post',
							data: revData,
							dataType: 'text'
						}).then(function(msg){
							if (msg != null && msg != "") {
								if (msg.length > 0) {
									var msg1 = msg.split('|')[0];
									if (escape(msg1).indexOf("%u") < 0) {
										window.location.href = "/Order/Detail?id=" + msg1;
									}
									else {
										alert("预约失败");
									}
								}
							}
							else {
								alert("预约失败");
							}
							issubmit = false;
						},function(){
							alert('预约失败');
							issubmit = false;
						});
					}
					else{
						alert('该区域不支持上门服务');
						issubmit = false;
					}
				}
				else{
					alert('区域判断失败');
					issubmit = false;
				}
			});
		}
	});
});

function Encrypt(word) {
    var test = new AES.Crypto('ihlih*0037JOHT*)(PIJY*(()JI^)IO%');
    return test.encrypt(word);
}

function Eecrypt(word) {
    var test = new AES.Crypto('ihlih*0037JOHT*)(PIJY*(()JI^)IO%');
    return test.decrypt(word);
}
