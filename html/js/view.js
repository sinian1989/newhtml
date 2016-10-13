define(['Backbone', 'jquery', 'juicer', 'base'], function (Backbone, $, juicer, base) {

	/**
	 * options.name 视图名称
	 * options.data model数据
	 * options.events 事件列表
	 * options.element 显示view的dom
	 * options.parent 父层视图
	 */
	var viewCreate = function(name, data, events, element, parent){
		var dfd = $.Deferred();

		require(['lib/require.text!../template/'+ name +'.html'], function (doc){

			data = typeof data !== 'object' ? {} : data;
			events = typeof events !== 'object' ? {} : events;
			if(typeof element === 'undefined'){
				element = '#mainview';
			}
			else if(typeof element === 'object'){
				parent = element;
				element = '#mainview';
			}

			//if(data.title){
			//	document.title = data.title;
			//}

			var MainView = Backbone.View.extend({
				template: juicer(doc),
				events: events,
				initialize: function() {
					this.$el.off();
					this.listenTo(this.model, "change", this.render);
				},
				render: function() {
					var _this = this;
					var model = _this.model.toJSON();

					if(model.title && model.title !== document.title){
						document.title = model.title;
						//hack在微信等webview中无法修改document.title的情况
						if(base.device.isWeixin && base.device.isIOS){
							(function(){
								var $iframe = $('<iframe src="images/pixel.gif" style="visibility:hidden; opacity:0; position:absolute; z-index:-1;"></iframe>');
								$iframe.on('load',function() {
									setTimeout(function() {
										$iframe.off('load').remove();
									}, 0);
								}).appendTo($('body'));
							})();
						}
					}

					_this.$el.html(_this.template.render(_this.model.toJSON()));

					return _this;
				},
				el: element
			});

			var model = new Backbone.Model(data);
			var nowview = new MainView({model: model});
			nowview.render();

			//指定父级view
			if(parent){
				nowview.parentview = parent;
			}

			//将当前view返回出去
			dfd.resolve(nowview);
		});
		return dfd.promise();
	};

	return viewCreate;
});