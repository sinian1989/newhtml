define([], function() {

	var base = {};
	base.ui = {
		createWait: function(){
			var oModal = document.createElement('div');
			oModal.className = 'base-ui-wait';
			document.body.appendChild(oModal);
		},
		closeWait: function(){
			var oModal = document.querySelector('.base-ui-wait');
			oModal.parentNode.removeChild(oModal);
		},
		alert: function(msg,cbok){
			if(!msg) return false;
			var oText = null,oBtnOk = null;
			var oModal = document.createElement('div');
			oModal.className = 'base-ui-alert';
			oModal.innerHTML = '<div class="modal">'
				+'<div class="modal-inner">'
				+ msg
				+'</div>'
				+'<div class="modal-btns">'
				+'<a href="javascript:;" class="modal-btn confirm-ok">确认</a>'	
				+'</div>'
				+'</div>'
			document.body.appendChild(oModal);

			//确认操作
			var confirmModal = function(){
				oModal.parentNode.removeChild(oModal);
				if(typeof cbok === 'function') cbok();
			};

			oModal.classList.add('modal-in');
			oText = oModal.querySelector('.modal-inner');
			oBtnOk = oModal.querySelector('.confirm-ok');
			
			oBtnOk.addEventListener('click',confirmModal,false);
		},
		confirm: function(msg,cbok,cbcancle){
			if(!msg) return false;
			var oModal = document.querySelector('.base-ui-confirm');
			var oText = null,oBtnOk = null,oBtnCancel = null,iRemove = true;
			if(!oModal){
				oModal = document.createElement('div');
				oModal.className = 'base-ui-confirm';
				oModal.innerHTML = '<div class="modal">'
					+'<div class="modal-inner">'
					+ msg
					+'</div>'
					+'<div class="modal-btns">'
					+'<a href="javascript:;" class="modal-btn confirm-cancel">取消</a>'
					+'<a href="javascript:;" class="modal-btn confirm-ok">确认</a>'	
					+'</div>'
					+'</div>'
				document.body.appendChild(oModal);
			}
			else{
				iRemove = false;
			}
			oModal.classList.add('modal-in');
			oText = oModal.querySelector('.modal-inner');
			oBtnOk = oModal.querySelector('.confirm-ok');
			oBtnCancel = oModal.querySelector('.confirm-cancel');

			//关闭modal
			var closeModal = function(){
				if(iRemove){
					oModal.parentNode.removeChild(oModal);
				}
				else{
					oModal.classList.remove('modal-in');
					oBtnCancel.removeEventListener('click',cancelModal,false);
					oBtnOk.removeEventListener('click',okModal,false);
				}
			};
			//取消的回调函数
			var cancelModal = closeModal;
			if(typeof cbcancle === 'function'){
				cancelModal = function(){
					cbcancle();
					closeModal();
				};
			}
			//确认的回调函数
			var okModal = function(){
				closeModal();
				if(typeof cbok === 'function'){
					cbok();
				}
			};

			//绑定事件
			oBtnCancel.addEventListener('click',cancelModal,false);
			oBtnOk.addEventListener('click',okModal,false);
		}
	};

	base.tool = {
		randomArr : function (arr, num) {
			//新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
			var temp_array = new Array();
			for (var index in arr) {
			    temp_array.push(arr[index]);
			}
			//取出的数值项,保存在此数组
			var return_array = new Array();
			for (var i = 0; i<num; i++) {
			    //判断如果数组还有可以取出的元素,以防下标越界
			    if (temp_array.length>0) {
			        //在数组中产生一个随机索引
			        var arrIndex = Math.floor(Math.random()*temp_array.length);
			        //将此随机索引的对应的数组元素值复制出来
			        return_array[i] = temp_array[arrIndex];
			        //然后删掉此索引的数组元素,这时候temp_array变为新的数组
			        temp_array.splice(arrIndex, 1);
			    } else {
			        //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
			        break;
			    }
			}
			return return_array;
		},
		cookie: (function(){
			return {
				set: function(name, value, day){
						//当day存在的时候不走localStroage
						if(!day && base.device.hasLocalStorage){
							localStorage[name] = value;
							return false;
						}
						var date=new Date();
						//默认不过期
						day = day || 10000;
						date.setDate(date.getDate()+day);
						document.cookie=name+'='+value+';expires='+date;
					},
				get: function(name,expires){
						//expires为true时只走cookie
						if(!expires && base.device.hasLocalStorage){
							return localStorage[name] || '';
						}
						//'username=abc; password=123456; aaa=123; bbb=4r4er'
						var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
						if(arr=document.cookie.match(reg)){
							return unescape(arr[2]);
						}
						else{
							return '';
						}
					},
				remove: function(name,expires){
						//expires为true时只走cookie
						if(!expires && base.device.hasLocalStorage){
							localStorage.removeItem(name);
							return false;
						}
						this.setCookie(name, '1', -1);
					}
			}
		})(),
		unserialize: function(str){
			var reg = /([^=&\s]+)[=\s]*([^=&\s]*)/g;
			var obj = {};
			while(reg.exec(str)){
				obj[RegExp.$1] = RegExp.$2;
			}
			return obj;
		}
	};

	base.device = {
		hasLocalStorage : typeof localStorage != 'undefined' && !!localStorage && typeof localStorage.getItem === 'function',
		isWeixin: window.navigator.userAgent.search(/MicroMessenger/i) !== -1,
		isIOS: /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
	};

	base.regexp = {
		phone : function(phone){
			return phone.search(/^(13|15|17|18|19)\d{9}$/g) !== -1;
		}
	}

	return base;
});	