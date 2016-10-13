define(['jquery', 'wxapi', 'base', 'juicer', 'pingpp'], function ($, wxapi, base, juicer, pingpp) {

    var funcs = {
        searchFocus: function (e) {
            var $search = this.$el.find('.search');

            if (!$search.hasClass('show')) {
                $search.addClass('show')
            }
        },
        searchBlur: function (e) {
            var $search = this.$el.find('.search');

            if ($search.hasClass('show')) {
                setTimeout(function () {
                    $search.removeClass('show');
                }, 200);
            }
        },
        searchword: function (e) {
            var search = this.$el.find('.searc').val();
            var uid = this.model.get('uid');
            if (search !== '') {
                window.location.hash = '#classlist/' + uid + '/-1/' + encodeURI(search);
            } else {
                base.ui.alert('搜索不能为空');
            }
        },
        hddb: function () {
            $('html,body').animate({scrollTop: '0'}, 200);
        },
        kcb:function(){
          $('.offset_kcb').slideToggle();
            $('.kcb i').toggleClass('current');
            var height=$('.kcb_down ul').height();
            $('.kcb_down li').height(height);
        },
        searchtype:function(e){
            var $this = this.$el.find(e.currentTarget);
            var uid=this.model.get('uid');
            var date=$this.data('date');
            var type=$this.data('type');
                base.tool.cookie.set('date', date);
                base.tool.cookie.set('type', type);
                //location.hash='#classlist/' + uid;

        },
        //gun:function(){
        //    alert(111);
        //    var iTop = $(document).scrollTop();
        //    var scrollTop =$('body').scrollTop();
        //    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        //    $(window).on('scroll', function () {
        //        var top = document.documentElement.scrollTop || document.body.scrollTop;
        //        console.log(top);
        //    });
        //    if(iTop>50){
        //        alert(111);
        //        $('.search_ss').addClass('float');
        //    }
        //    else{
        //        $('.search_ss').removeClass('flot');
        //    }
        //},
        clearSearch: function () {
            var $input = this.$el.find('.search input');
            $input.val('');
            var classtype = this.model.get('classtype');
            var tmp = $('#tmp-type').html();
            tmp = tmp.replace(/\@\-/g, '@').replace(/\$\-/g, '$').replace('e-l-s-e', 'else');

            classtype = classtype.map(function (item, index) {
                delete item['select'];
                delete item['selectid'];
                return item;
            });

            this.$el.find('.type-list').html(juicer(tmp).render({"list": classtype}));
            var _this = this;
            var filter = this.model.get('filter');
            var result = $.extend(true, {}, filter);
            _this.$el.find('.type-list li').each(function () {
                var $this = $(this);
                result[$this.data('key')] = $this.find('.val').data('selectid');
            });
            $.ajax('/Api/Shop/GetShopClass', {data: result}).done(function (res) {
                if (res.status !== 1) {
                    base.ui.alert(res.msg);
                    return false;
                }
                _this.model.set('classlist', res.info);
                _this.model.set('filter', result);
                _this.oldlist = res.info.map(function (item) {
                    return item;
                });
                _this.render();
            });
        },
        searchSubmit: function (e) {
            var $this = this.$el.find(e.currentTarget);
            var val = $this.prevAll('input').eq(0).val();
            var list;
            //再备份一次
            if (!this.oldlist2) {
                this.oldlist2 = this.oldlist;
            }

            //还原
            if (!val && typeof this.query !== 'undefined') {
                this.oldlist = this.oldlist2;
                list = this.oldlist.map(function (item) {
                    return item;
                });
                this.model.set('classlist', list);
                delete this.query;
                this.render();
            }
            else if (!val) {
                base.ui.alert('搜索条件不能为空');
                return false;
            }
            else {
                $.ajax('/Api/Shop/SearchShopClass', {data: {word: val}}).done(function (res) {
                    if (res.status !== 1) {
                        base.ui.alert(res.msg);
                        return false;
                    }
                    this.model.set('classlist', res.info);
                    this.oldlist = res.info;
                    this.query = val;
                    this.render();
                    $('input').eq(0).val(val);
                }.bind(this));

            }
        },
        //排序、筛选
        showSort: function (e) {
            var $this = this.$el.find(e.currentTarget);
            var $pop = this.$el.find('.top-pop');
            var son = {'sort': '.sort-items', 'filter': '.filter-type'}[e.currentTarget.className];

            //清除已展开的选项
            if ($pop.hasClass('show') && !$this.data('show')) {
                this.$el.find('.top .current').removeClass('current').parent().data('show', false);
            }

            //展开或关闭筛选排序
            if ($this.data('show')) {
                $this.data('show', false).find('.iconfont').removeClass('current');
                $pop.removeClass('show').find(son).removeClass('animate');
            }
            else {
                $this.data('show', true).find('.iconfont').addClass('current');
                $pop.addClass('show').find(son).addClass('animate').siblings().removeClass('animate');
            }
        },
        //选择排序
        selectSort: function (e) {
            var $this = this.$el.find(e.currentTarget);
            var list = this.oldlist.map(function (item) {
                return item;
            });
            var filter = this.model.get('filter');

            $this.addClass('active').siblings().removeClass('active');

            switch (parseInt($this.attr('data-sort'))) {
                case 0:
                    list = list.sort(function (a, b) {
                        return a['sellingprice'] - b['sellingprice'];
                    });
                    break;
                case 1:
                    list = list.sort(function (a, b) {
                        return b['sellingprice'] - a['sellingprice'];
                    });
                    break;
                default:
                    console.log(11)
                    break;
            }
            filter.oederby = parseInt($this.attr('data-sort'));
            this.model.set('classlist', list);
            this.render();
        },
        //菜单控制
        menuCtrl: function (e) {
            var $this = this.$el.find(e.currentTarget);
            if (e.currentTarget.classList.contains('cancle')) {
                //隐藏弹出层
                $this.parents('.filter-box').eq(0).removeClass('animate');
                //第一层目录就需要重置筛选按钮样式
                if (e.currentTarget.dataset.level === '1') {
                    $('.top-pop').removeClass('show');
                    $('.filter').data('show', false).find('.current').removeClass('current');
                }
            }
            else if (e.currentTarget.classList.contains('confirm')) {

                //第一层目录确定就提交数据进行筛选
                if (e.currentTarget.dataset.level === '1') {
                    var classtype = this.model.get('classtype');
                    var tmp = $('#tmp-type').html();
                    tmp = tmp.replace(/\@\-/g, '@').replace(/\$\-/g, '$').replace('e-l-s-e', 'else');

                    classtype = classtype.map(function (item, index) {
                        delete item['select'];
                        delete item['selectid'];
                        return item;
                    });

                    this.$el.find('.type-list').html(juicer(tmp).render({"list": classtype}));
                }
                else {
                    $this.parents('.filter-box').eq(0).removeClass('animate');
                }
            }
            e.stopPropagation();
        },
        menuCtrl1: function (e) {
            var $this = this.$el.find(e.currentTarget);
            if (e.currentTarget.classList.contains('cancle')) {
                //隐藏弹出层
                $this.parents('.filter-box').eq(0).removeClass('animate');
                //第一层目录就需要重置筛选按钮样式
                if (e.currentTarget.dataset.level === '1') {
                    $('.top-pop').removeClass('show');
                    $('.filter').data('show', false).find('.current').removeClass('current');
                }
            }
            else if (e.currentTarget.classList.contains('confirm')) {
                //var filter = this.model.get('filter');
                //console.log(filter);
                //var result = $.extend(true, {}, filter);
                //base.tool.cookie.set('onum', onum);
                //var uid = this.model.get('uid');
                //window.location.hash = '#classlist/' + uid + '/-1/' + encodeURI(search);
                //第一层目录确定就提交数据进行筛选
                if (e.currentTarget.dataset.level === '1') {
                    var classtype = this.model.get('classtype');
                    var tmp = $('#tmp-type').html();
                    tmp = tmp.replace(/\@\-/g, '@').replace(/\$\-/g, '$').replace('e-l-s-e', 'else');

                    classtype = classtype.map(function (item, index) {
                        delete item['select'];
                        delete item['selectid'];
                        return item;
                    });

                    this.$el.find('.type-list').html(juicer(tmp).render({"list": classtype}));
                }
                else {
                    $this.parents('.filter-box').eq(0).removeClass('animate');
                }
            }
            e.stopPropagation();
        },
        //展开筛选详情
        showFilter: function (e) {
            var tid = e.currentTarget.dataset.index;
            var data = {
                list: this.model.get('classtype')[tid].list,
                select: this.model.get('classtype')[tid].select
            };

            var tmp = $('#tmp-option').html();
            tmp = tmp.replace(/\@\-/g, '@').replace(/\$\-/g, '$');


            this.$el.find('.filter-option').addClass('animate').data('tid', tid).find('.option-list').html(juicer(tmp).render(data));
        },
        //清除分类数据
        repeatType: function (e) {
            var _this = this;
            var filter = this.model.get('filter');
            var result = $.extend(true, {}, filter);

            _this.$el.find('.type-list li').each(function () {
                var $this = $(this);
                result[$this.data('key')] = $this.find('.val').data('selectid');
            });
            base.tool.cookie.set('result', JSON.stringify(result));
            //条件未曾更改不进行数据请求
            if (JSON.stringify(result) === JSON.stringify(filter)) {
                _this.render();
                return false;
            }

            $.ajax('/Api/Shop/GetShopClass',
                {data: result}
            ).done(function (res) {
                    if (res.status !== 1) {
                        base.ui.alert(res.msg);
                        return false;
                    }
                    _this.model.set('classlist', res.info);
                    _this.model.set('filter', result);
                    _this.oldlist = res.info.map(function (item) {
                        return item;
                    });
                    _this.render();
                });
        },
        repeatType1: function (e) {
            var _this = this;
            var filter = this.model.get('filter');
            var result = $.extend(true, {}, filter);
            _this.$el.find('.type-list li').each(function () {
                var $this = $(this);
                result[$this.data('key')] = $this.find('.val').data('selectid');
            });
            var uid = this.model.get('uid');
            var fuid=this.model.get('fuid')?this.model.get('fuid'):null;
            //$.ajax('/Api/Shop/GetShopClass', {data: result}).done(function(res){
            //    if (res.status !== 1) {
            //        base.ui.alert(res.msg);
            //        return false
            //    }else{
                    if(fuid){
                        base.tool.cookie.set('result', JSON.stringify(result));
                        window.location.hash = '#classlistf/' + uid+'/'+fuid;
                    }else{
                        base.tool.cookie.set('result', JSON.stringify(result));
                        window.location.hash = '#classlist/' + uid;
                    }
            //    }
            //});
        },
        allbobo:function(){
            //var bbyl='bbyl';
            //base.tool.cookie.set('bbyl', bbyl);
        },
        //选择筛选option
        selectFilter: function (e) {
            var $this = this.$el.find(e.currentTarget);
            var $fbox = this.$el.find('.filter-option');
            var tid = $fbox.data('tid');
            var classtype = this.model.get('classtype');
            var tmp = $('#tmp-type').html();
            tmp = tmp.replace(/\@\-/g, '@').replace(/\$\-/g, '$').replace('e-l-s-e', 'else');

            classtype[tid].select = $this.find('.val').text();
            classtype[tid].selectid = $this.data('id');
            $fbox.removeClass('animate');
            this.$el.find('.type-list').html(juicer(tmp).render({"list": classtype}));
            $('html,body').animate({scrollTop: '0'}, 0);
        },

        //喜欢、收藏、分享
        topCtrl: function (e) {
            var $this = this.$el.find(e.currentTarget);
            var detail = this.model.get('detail');
            var uid = this.model.get('uid');
            var id = this.model.get('id');
            var type = 'x';
            var _this = this;

            switch (e.currentTarget.className) {
                case 'one':
                    if (uid=='share') {
                        base.ui.alert('请先登录再进行操作');
                        return false;
                    }
                    if (detail.iflike==1) return false;
                    type = 1;
                    $this.addClass('current');
                    $('#alike').text(parseInt($('#alike').text())+1);
                    break;
                case 'two':
                    if (uid=='share') {
                        base.ui.alert('请先登录再进行操作');
                        return false;
                    }
                    if (detail.ifFav==1) return false;
                    type = 0;
                    $this.addClass('current');
                    break;
                case 'three':
                    //分享的接口在这里
                    BoJSBridge.nativeShare({
                        shareImageUrl:'http://img.hairbobo.com' + detail.image, //图片链接（绝对路径），分享到微信会以微信模板显示
                        shareText:'波波网专业教育推荐课程~',//分享的内容
                        shareTitle:'我觉得' + detail.title + '非常赞，感兴趣的去看看哦~',//分享的标题
                        shareUrl:location.origin + location.pathname + '#detail/' + id + '/share'//分享的链接
                    },function(result){});
                    break;
                default:
                    break;
            }
            if (type === 1 || type === 0) {
                if (uid === 'share') {
                    base.ui.alert('匿名用户无法添加收藏和喜欢');
                    return false;
                }
                $.ajax({
                    url: '/api/shop/AddFAV',
                    data: {shcid: id, uid: uid, type: type}
                }).done(function (res) {
                    if (type === 0) {
                        detail.ifFav = 1;
                    }
                    else if (type === 1) {
                        detail.iflike = 1;
                    }
                    //$this.addClass('current').siblings().removeClass('current');
                });
            }
        },

        //选择购买数量
        selectNumber: function (e) {
            var detail = this.model.get('detail');
            //商品总数不足时不能选择数量
            if (detail.total === 0) return false;

            var $span = this.$el.find('.onum');
            var num = parseInt($span.text());
            switch (e.target.className) {
                case 'minus':
                    if (num > 1) {
                        $span.html(num - 1);
                    }
                    break;
                case 'plus':
                    if (num < detail.total) {
                        $span.html(num + 1);
                    }
                    else {
                        base.ui.alert('购买数量不能超过商品总数');
                    }
                    break;
                default:
                    break;
            }
        },

        //展示开班时间
        showDate: function () {
            var detail = this.model.get('detail');
            if (detail.classdate && detail.classdate.length) {
                $('.date-box').addClass('show-date');
            }
            else {
                base.ui.alert('暂无开课时间');
            }

        },
        //确认预约时间
        confirmDate: function () {
            var id=this.model.get('id');
            var uid=this.model.get('uid');
            var fuid=this.model.get('fuid')?this.model.get('fuid'):null;
            var select = $('.show-select').find('span').html();
            var onum = parseInt(this.$el.find('.onum').text());
            if (select) {
                $('.deposit-date').html(select).show();
                $('.date-box').removeClass('show-date');
                if(fuid){
                    location.hash='#accountsf/'+id+'/'+uid+'/'+fuid;
                }else{
                    location.hash='#accounts/'+id+'/'+uid;
                }
                base.tool.cookie.set('onum', onum);
                base.tool.cookie.set('odate', select);
                //$('.buy-btn').click(function () {
                //}).trigger('click');
            }
            $('.date-box').removeClass('show-date');


        },

        //确认购买
        submitBuy: function (e) {
            if($('.buy-btn').text()=='已售完'){
                return false;
            }
            if (!true) {
                base.ui.alert('请先选择开课时间');
                return false;
            }
            var onum = parseInt(this.$el.find('.onum').text());
            //var date = this.$el.find('.deposit-date').text();
            var select = $('.show-select').find('span').html();
            if (!select) {
                base.ui.alert('请选择开班时间', function () {
                    $('.selectdate').click();
                });
                return false;
            }

            //if (base.device.isWeixin) {
            //    base.ui.alert('暂不支持微信支付，请从浏览器端打开用支付宝支付');
            //    return false;
            //}

            //base.tool.cookie.set('onum', onum);
            //base.tool.cookie.set('odate', date);
        },
        poptell:function(){
            $('.zezao').show();
            $('.poptell').fadeIn();
        },
        phone:function(){
          var val=$('.poptell input').val();
            if (!base.regexp.phone(val)) {
                base.ui.alert('请输入有效的手机号码');
                return false;
            }
            var uid=this.model.get('uid');
            var id=this.model.get('id');
            var clubid=this.model.get('clubid');
            $.ajax('/API/Shop/AddCONSULTATION',{data:{sid:id,omid:clubid,uid:uid,cell:val}}).done(function (res) {
                if (res.status == 1) {
                    $('.zezao').hide();
                    $('.poptell').fadeOut();
                    base.ui.alert('联系方式已提交学院，学院工作人员稍后会致电给您。');
                }
            })
        },
        zezao:function(){
            $('.zezao').hide();
            $('.poptell').fadeOut();
            $('#popxy').fadeOut();
        },
        linktel:function(){
            $.ajaxSetup({
                beforeSend: function () {
                    //base.ui.createWait();
                    //return
                },
                error: function () {
                    //base.ui.alert('系统错误，请稍后重试！');
                    //return
                },
                complete: function () {
                    //base.ui.closeWait();
                    //return
                }
            });
            var shcid=this.model.get('id')||$('.bord').data('id');
            $.ajax({url: '/API/Shop/Addclickcell', data: {shcid:shcid}}).done(function (res) {

            })
        },
        linkqq:function(){
            var clubid=this.model.get('clubid');
            var uid=this.model.get('uid');
            $.ajax('/Api/Shop/GetShopClass', {
                data: {
                    month: -1,
                    city: -1,
                    type: -1,
                    cuid: clubid,
                    oederby: -1,
                    pageindex: 1,
                    pagesize: 100
                }
            }).done(function(list){
                if (list.status !== 1) {
                    base.ui.alert(list.msg);
                    return false
                }else{
                    location.hash='#classlist/'+uid+'/'+clubid;
                }
            })
        },
        attxy:function(){
            $('.zezao').show();
            $('#popxy').fadeIn();
        },
        wximg:function(){
            var $codeimg = this.$el.find('#popxy img');
            var data = {
                current: $codeimg.attr('src'),
                urls: [$codeimg.attr('src')]
            };
            //调用微信图片预览
            wxapi({
                preview: data
            });
        },

        //评论选项
        commsOption: function (e) {
            var name = this.$el.find(e.currentTarget).find('.name em').text();
            var $input = this.$el.find('.reply-text');
            //存储被回复项的id
            console.log(e.currentTarget.dataset.id)
            if (e.currentTarget.dataset.id) {
                this.rid = e.currentTarget.dataset.id;
                this.rname = name;
                console.log(this.rid)
                console.log(this.rname)
                $input.val('回复' + name + ': ');
            }
        },
        commSubmit: function () {
            var id = this.model.get('id');
            var uid = this.model.get('uid');
            var val = this.$el.find('.reply-text').val();
            var rid = this.rid ? this.rid : '';
            var reg = new RegExp("^回复" + this.rname + ":\s*");

            if (this.rname) {
                if (val.indexOf('回复' + this.rname + ': ') !== 0) {
                    rid = '';
                }
                else {
                    alert(33)
                    val = val.replace('回复' + this.rname + ': ', '')
                }
            }

            if (!$.trim(val)) {
                base.ui.alert('请输入评论内容');
                return false;
            }

            $.ajax('/api/shop/AddShopComment', {
                data: {
                    shcid: id,
                    uid: uid,
                    content: val,
                    reid: rid
                }
            }).done(function (res) {
                if (res.status !== 1) {
                    base.ui.alert(res.msg);
                    return false;
                }
                window.location.hash = '#dssppl/' + id + '/3/' + uid;
                window.location.reload();
            });
        },

        //提交订单
        accOrder: function () {
            var uid = this.model.get('uid');
            var openid = this.model.get('openid');
            var detail = this.model.get('detail');
            var formdata = this.$el.find('.account-form').serialize();
            var oid = '';
            //name为空
            if (formdata.indexOf('name=&') !== -1) {
                base.ui.alert('姓名不能为空');
                return false;
            }

            if (formdata.indexOf('tel=&') !== -1) {
                base.ui.alert('手机号不能为空');
                return false;
            }

            if (!(base.regexp.phone(this.$el.find('[name=tel]').val())||base.regexp.phone(this.$el.find('[name=tel]').text())  )) {
                base.ui.alert('请输入有效的手机号码');
                return false;
            }
            $('.pay').slideDown(500);
            $('.acc-box').slideUp(500);
            $('.zezao').show();
            //波波俱乐部课程
            //if (detail.kind === 0) {
            //    $.ajax('/api/shop/AddClubOrder', {data: formdata}).done(function (res) {
            //        if (res.status !== 1) {
            //            base.ui.alert(res.msg);
            //            return false;
            //        }
            //        location.hash = '#odetail/' + res.info;
            //    });
            //    return false;
            //}
            ////商城课程
            //$.ajax('/api/shop/AddOrder', {data: formdata}).then(function (res) {
            //    if (res.status !== 1) {
            //        base.ui.alert(res.msg);
            //        return false;
            //    }
            //    if (res.msg === '1') {
            //        location.hash = '#odetail/' + res.info + '/' + openid;
            //        return false;
            //    }
            //    oid = res.info;
            //    return $.ajax({
            //        url: '/api/WeiXinPay/Pay',
            //        data: {openid: openid, orderid: res.info}
            //    });
            //}).done(function (response) {
            //    if (response === false) return false;
            //
            //    if (response.status !== 1) {
            //        base.ui.alert(response.msg);
            //        return false;
            //    }
            //    //微信端调用微信支付
            //    if (!response.info.payurl) {
            //        //调用微信支付必须在重新生成token之后，以防多公众账号同用时出错
            //        response.info.hash = '#odetail/' + oid + '/' + openid;
            //        wxapi(null, openid, function () {
            //            //调用微信支付
            //            wxapi({
            //                pay: response.info
            //            });
            //        });
            //    }
            //    //非微信端调用支付宝
            //    else {
            //        location.href = response.info.payurl;
            //    }
            //});

            return false;
        },
        paytp: function (e) {
            var uid = this.model.get('uid');
            var openid = this.model.get('openid');
            var detail = this.model.get('detail');
            var formdata = this.$el.find('.account-form').serialize();
            var name=$('#name').val();
            var tel=$('#tel').val();
            var shcid=$('#shcid').val();
            var uidm=$('#uidm').val();
            var distributor=$('#distributor').val()?$('#distributor').val():null;
            var num=$('#num').val();
            var classdate=$('#classdate').val();
            var paytype=1;
            //var paytype=this.model.get('paytype');

            var oid = '';
            var channel;
            var $this = this.$el.find(e.currentTarget);
            if (e.currentTarget.classList.contains('zhifu')) {
                channel = 'alipay_wap';
                //$('.zezao .tzzf').show();
                $this.attr('disabled', true);
            }
            else if (e.currentTarget.classList.contains('weixin')) {
                //$('.zezao .tzzf').show();
                channel = 'wx_pub';
                $this.attr('disabled', true);
            } else if (e.currentTarget.classList.contains('qux')) {
                $('.pay').slideUp(500);
                $('.acc-box').slideDown(500);
                $('.zezao').hide();
                return false;
            }
            //波波俱乐部课程
            if (detail.kind === 0) {
                $.ajax('/api/shop/AddClubOrder', {data: formdata}).done(function (res) {
                    if (res.status !== 1) {
                        base.ui.alert(res.msg);
                        return false;
                    }
                    location.hash = '#odetail/' + res.info;
                });
                return false;
            }
            if (window.navigator.userAgent.indexOf('BoBoiOS') !== -1 || window.navigator.userAgent.indexOf('BoBoAndroid') !== -1) {
                var num1 = window.navigator.userAgent.indexOf('BoBoiOS/');
                var num2 = window.navigator.userAgent.indexOf('BoBoAndroid/');
                var typenum1 = parseFloat(window.navigator.userAgent.slice(num1 + 8));
                var typenum2 = parseFloat(window.navigator.userAgent.slice(num2 + 12));
                if (typenum1 >= 3.6 || typenum2 >= 3.6) {
                    //base.ui.alert('跳转中...');
                    if (e.currentTarget.classList.contains('zhifu')) {
                        channel = 'alipay';
                        $('.zezao .tzzf').show();
                        paytype=3;
                    }
                    else if (e.currentTarget.classList.contains('weixin')) {
                        channel = 'wx';
                        $('.zezao .tzzf').show();
                        paytype=4;
                    }
                    //商城课程
                    $.ajax('/api/shop/AddOrder', {data: {name:name,tel:tel,shcid:shcid,uid:uidm,num:num,classdate:classdate,paytype:paytype}}).then(function (res) {
                        if (res.status !== 1) {
                            base.ui.alert(res.msg);
                            return false;
                        }
                        if (res.msg === '1') {
                            location.hash = '#odetail/' + res.info + '/' + openid;
                            return false;
                        }
                        oid = res.info;
                        return $.ajax({
                            url: '/api/WeiXinPay/PingPay',
                            data: {openid: openid, orderid: res.info, channel: channel}
                        });
                    }).done(function (response) {
                        if (response === false) return false;

                        if (response.status !== 1) {
                            base.ui.alert(response.msg);
                            return false;
                        }
                        var res = JSON.stringify(response.info);
                        BoJSBridge.nativePayment({charge: res}, function (status, msg) {
                            if (msg == 'cancel') {
                                base.ui.alert('取消支付');
                                location.hash = '#odetail/' + oid + '/' + openid;
                                return false;
                            } else if (status == 1) {
                                base.ui.alert('支付成功');
                                location.hash = '#odetail/' + oid + '/' + openid;
                            } else if (msg == 'fail') {
                                base.ui.alert('支付失败');
                                location.hash = '#odetail/' + oid + '/' + openid;
                                return false;
                            }

                        });
                    });
                } else {
                    if (e.currentTarget.classList.contains('weixin')) {
                        base.ui.alert('该浏览器不支持微信支付，请在微信打开');
                        return false;
                    } else if (e.currentTarget.classList.contains('zhifu')) {
                        $('.zezao .tzzf').show().text('波波网APP已经全新升级，获得最佳支付体验请赶快升级APP吧～');
                        //商城课程
                        paytype=3;
                        $.ajax('/api/shop/AddOrder', {data: {name:name,tel:tel,shcid:shcid,uid:uidm,num:num,classdate:classdate,paytype:paytype}}).then(function (res) {
                            if (res.status !== 1) {
                                base.ui.alert(res.msg);
                                return false;
                            }
                            if (res.msg === '1') {
                                location.hash = '#odetail/' + res.info + '/' + openid;
                                return false;
                            }
                            oid = res.info;
                            return $.ajax({
                                url: '/api/WeiXinPay/PingPay',
                                data: {
                                    openid: openid,
                                    orderid: res.info,
                                    channel: 'alipay_wap',
                                    successurl: 'http://shop.hairbobo.com/shop/index.html#odetail/' + oid + '/' + openid,
                                    cancelurl: 'http://shop.hairbobo.com/shop/index.html#odetail/' + oid + '/' + openid
                                }
                            });
                        }).done(function (response) {
                            if (response === false) return false;

                            if (response.status !== 1) {
                                base.ui.alert(response.msg);
                                return false;
                            }
                            //location.hash='#odetail/' + oid + '/' + openid;
                            pingpp.createPayment(response.info, function (result, error) {
                                //if (result == "success") {
                                //    // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的 wap 支付结果都是在 extra 中对应的 URL 跳转。
                                //    base.ui.alert(result);
                                //} else if (result == "fail") {
                                //    // charge 不正确或者微信公众账号支付失败时会在此处返回
                                //    base.ui.alert(result);
                                //} else if (result == "cancel") {
                                //    // 微信公众账号支付取消支付
                                //    base.ui.alert(result);
                                //}
                            });
                        });
                    }
                }

            } else if (base.device.isWeixin) {
                if (e.currentTarget.classList.contains('zhifu')) {
                    base.ui.alert('该浏览器不支付支付宝支付，请在其它浏览器打开');
                    return false;
                } else if (e.currentTarget.classList.contains('weixin')) {
                    $('.zezao .tzzf').show();
                    //商城课程
                    paytype=6;
                    $.ajax('/api/shop/AddOrder', {data: {name:name,tel:tel,shcid:shcid,uid:uidm,num:num,classdate:classdate,paytype:paytype}}).then(function (res) {
                        if (res.status !== 1) {
                            base.ui.alert(res.msg);
                            return false;
                        }
                        if (res.msg === '1') {
                            location.hash = '#odetail/' + res.info + '/' + openid;
                            return false;
                        }
                        oid = res.info;
                        return $.ajax({
                            url: '/api/WeiXinPay/PingPay',
                            data: {openid: openid, orderid: res.info, channel: 'wx_pub'}
                        });
                    }).done(function (response) {
                        if (response === false) return false;

                        if (response.status !== 1) {
                            base.ui.alert(response.msg);
                            return false;
                        }
                        pingpp.createPayment(response.info, function (result, error) {
                            if (result == "success") {
                                // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的 wap 支付结果都是在 extra 中对应的 URL 跳转。
                                base.ui.alert("支付成功");
                                location.hash = '#odetail/' + oid + '/' + openid;
                            } else if (result == "fail") {
                                // charge 不正确或者微信公众账号支付失败时会在此处返回
                                base.ui.alert("支付失败");
                                location.hash = '#odetail/' + oid + '/' + openid;
                            } else if (result == "cancel") {
                                // 微信公众账号支付取消支付
                                base.ui.alert("支付取消");
                                location.hash = '#odetail/' + oid + '/' + openid;
                            }
                        });
                    });
                }
            } else {
                if (e.currentTarget.classList.contains('weixin')) {
                    base.ui.alert('该浏览器不支持微信支付，请在微信打开');
                    return false;
                } else if (e.currentTarget.classList.contains('zhifu')) {
                    $('.zezao .tzzf').show();
                    //商城课程
                    paytype=5;
                    $.ajax('/api/shop/AddOrder', {data: {name:name,tel:tel,shcid:shcid,uid:uidm,num:num,classdate:classdate,paytype:paytype,distributor:distributor}}).then(function (res) {
                        if (res.status !== 1) {
                            base.ui.alert(res.msg);
                            return false;
                        }
                        if (res.msg === '1') {
                            location.hash = '#odetail/' + res.info + '/' + openid;
                            return false;
                        }
                        oid = res.info;
                        return $.ajax({
                            url: '/api/WeiXinPay/PingPay',
                            data: {
                                openid: openid,
                                orderid: res.info,
                                channel: 'alipay_wap',
                                successurl: 'http://shop.hairbobo.com/shop/index.html#odetail/' + oid + '/' + openid,
                                cancelurl: 'http://shop.hairbobo.com/shop/index.html#odetail/' + oid + '/' + openid
                            }
                        });
                    }).done(function (response) {
                        if (response === false) return false;

                        if (response.status !== 1) {
                            base.ui.alert(response.msg);
                            return false;
                        }
                        //location.hash = '#odetail/' + oid + '/' + openid;
                        pingpp.createPayment(response.info, function (result, error) {
                            //if (result == "success") {
                            //    // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的 wap 支付结果都是在 extra 中对应的 URL 跳转。
                            //    base.ui.alert(result);
                            //} else if (result == "fail") {
                            //    // charge 不正确或者微信公众账号支付失败时会在此处返回
                            //    base.ui.alert(result);
                            //} else if (result == "cancel") {
                            //    // 微信公众账号支付取消支付
                            //    base.ui.alert(result);
                            //}
                        });
                    });
                }
            }
        },
        paytp2: function (e) {
            var openid = this.model.get('openid');
            var oid =this.model.get('oid');
            var channel;
            var $this = this.$el.find(e.currentTarget);
            if (e.currentTarget.classList.contains('zhifu')) {
                channel = 'alipay_wap';
                $this.attr('disabled', true);
            }
            else if (e.currentTarget.classList.contains('weixin')) {
                channel = 'wx_pub';
                $this.attr('disabled', true);
            } else if (e.currentTarget.classList.contains('qux')) {
                $('.pay').slideUp(500);
                $('.acc-box').slideDown(500);
                $('.zezao').hide();
                return false;
            }
            if (window.navigator.userAgent.indexOf('BoBoiOS') !== -1 || window.navigator.userAgent.indexOf('BoBoAndroid') !== -1) {
                var num1 = window.navigator.userAgent.indexOf('BoBoiOS/');
                var num2 = window.navigator.userAgent.indexOf('BoBoAndroid/');
                var typenum1 = parseFloat(window.navigator.userAgent.slice(num1 + 8));
                var typenum2 = parseFloat(window.navigator.userAgent.slice(num2 + 12));
                if (typenum1 >= 3.6 || typenum2 >= 3.6) {
                    if (e.currentTarget.classList.contains('zhifu')) {
                        channel = 'alipay';
                        $('.zezao .tzzf').show();
                    }
                    else if (e.currentTarget.classList.contains('weixin')) {
                        channel = 'wx';
                        $('.zezao .tzzf').show();
                    }
                    //商城课程
                    $.ajax({
                        url: '/api/WeiXinPay/PingPay',
                        data: {openid: openid, orderid: oid, channel: channel}
                    }).done(function (response) {
                        if (response === false) return false;

                        if (response.status !== 1) {
                            base.ui.alert(response.msg);
                            return false;
                        }
                        var res = JSON.stringify(response.info);
                        BoJSBridge.nativePayment({charge: res}, function (status, msg) {
                            if (msg == 'cancel') {
                                base.ui.alert('取消支付');
                                location.hash = '#odetail/' + oid + '/' + openid;
                                return false;
                            } else if (status == 1) {
                                base.ui.alert('支付成功');
                                location.hash = '#odetail/' + oid + '/' + openid;
                            } else if (msg == 'fail') {
                                base.ui.alert('支付失败');
                                location.hash = '#odetail/' + oid + '/' + openid;
                                return false;
                            }

                        });
                    });
                } else {
                    if (e.currentTarget.classList.contains('weixin')) {
                        base.ui.alert('该浏览器不支持微信支付，请在微信打开');
                        return false;
                    } else if (e.currentTarget.classList.contains('zhifu')) {
                        $('.zezao .tzzf').show().text('波波网APP已经全新升级，获得最佳支付体验请赶快升级APP吧～');
                        //商城课程
                        $.ajax({
                            url: '/api/WeiXinPay/PingPay',
                            data: {
                                openid: openid,
                                orderid: oid,
                                channel: 'alipay_wap',
                                successurl: 'http://shop.hairbobo.com/shop/index.html#odetail/' + oid + '/' + openid,
                                cancelurl: 'http://shop.hairbobo.com/shop/index.html#odetail/' + oid + '/' + openid
                            }
                        }).done(function (response) {
                            if (response === false) return false;

                            if (response.status !== 1) {
                                base.ui.alert(response.msg);
                                return false;
                            }
                            pingpp.createPayment(response.info, function (result, error) {
                                //if (result == "success") {
                                //    // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的 wap 支付结果都是在 extra 中对应的 URL 跳转。
                                //    base.ui.alert(result);
                                //} else if (result == "fail") {
                                //    // charge 不正确或者微信公众账号支付失败时会在此处返回
                                //    base.ui.alert(result);
                                //} else if (result == "cancel") {
                                //    // 微信公众账号支付取消支付
                                //    base.ui.alert(result);
                                //}
                            });
                        });
                    }
                }

            } else if (base.device.isWeixin) {
                if (e.currentTarget.classList.contains('zhifu')) {
                    base.ui.alert('该浏览器不支付支付宝支付，请在其它浏览器打开');
                    return false;
                } else if (e.currentTarget.classList.contains('weixin')) {
                    $('.zezao .tzzf').show();
                    //商城课程
                    $.ajax({
                        url: '/api/WeiXinPay/PingPay',
                        data: {openid: openid, orderid: oid, channel: 'wx_pub'}
                    }).done(function (response) {
                        if (response === false) return false;

                        if (response.status !== 1) {
                            base.ui.alert(response.msg);
                            return false;
                        }
                        pingpp.createPayment(response.info, function (result, error) {
                            if (result == "success") {
                                // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的 wap 支付结果都是在 extra 中对应的 URL 跳转。
                                base.ui.alert("支付成功");
                                location.hash = '#odetail/' + oid + '/' + openid;
                            } else if (result == "fail") {
                                // charge 不正确或者微信公众账号支付失败时会在此处返回
                                base.ui.alert("支付失败");
                                location.hash = '#odetail/' + oid + '/' + openid;
                            } else if (result == "cancel") {
                                // 微信公众账号支付取消支付
                                base.ui.alert("支付取消");
                                location.hash = '#odetail/' + oid + '/' + openid;
                            }
                        });
                    });
                }
            } else {
                if (e.currentTarget.classList.contains('weixin')) {
                    base.ui.alert('该浏览器不支持微信支付，请在微信打开');
                    return false;
                } else if (e.currentTarget.classList.contains('zhifu')) {
                    $('.zezao .tzzf').show();
                    //商城课程
                    $.ajax({
                        url: '/api/WeiXinPay/PingPay',
                        data: {
                            openid: openid,
                            orderid: oid,
                            channel: 'alipay_wap',
                            successurl: 'http://shop.hairbobo.com/shop/index.html#odetail/' + oid + '/' + openid,
                            cancelurl: 'http://shop.hairbobo.com/shop/index.html#odetail/' + oid + '/' + openid
                        }
                    }).done(function (response) {
                        if (response === false) return false;

                        if (response.status !== 1) {
                            base.ui.alert(response.msg);
                            return false;
                        }
                        //location.hash = '#odetail/' + oid + '/' + openid;
                        pingpp.createPayment(response.info, function (result, error) {
                            //if (result == "success") {
                            //    // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的 wap 支付结果都是在 extra 中对应的 URL 跳转。
                            //    base.ui.alert(result);
                            //} else if (result == "fail") {
                            //    // charge 不正确或者微信公众账号支付失败时会在此处返回
                            //    base.ui.alert(result);
                            //} else if (result == "cancel") {
                            //    // 微信公众账号支付取消支付
                            //    base.ui.alert(result);
                            //}
                        });
                    });
                }
            }
        },
        yes:function(){
            var uid=this.model.get('detail').uid;
            //if(window.navigator.userAgent.indexOf('BoBoiOS') !== -1 || window.navigator.userAgent.indexOf('BoBoAndroid') !== -1){
                $.ajax('/api/shop/GetUserInfo', { data: { uid: uid } }).done(function(res){
                    if (res.status == 1) {
                        $('.tsxx').fadeOut();
                        $('.zez').hide();
                        var logo=res.info.logo;
                        BoJSBridge.nativeShare({
                            shareImageUrl:'http://img.hairbobo.com'+logo, //图片链接（绝对路径），分享到微信会以微信模板显示
                            shareText: '波波网记录我的成长每一步。',//分享的内容
                            shareTitle:'我报名参加了新的培训课程，进修经验值又提升啦~',//分享的标题
                            //shareUrl:location.origin + location.pathname + '#daibai/' + omuid + '/share'//分享的链接
                            shareUrl:'http://my.bobo.so/hair/index.html#detailhair/'+uid  //分享的链接
                        },function(result){});
                    }
                })
            //}
        },
        no:function(){
            $('.tsxx').fadeOut();
            $('.zez').hide();
        },
        //取消订单
        cancelOrder: function () {
            base.ui.confirm('确认取消这个订单么？', function () {
                var oid = this.model.get('oid');
                $.ajax('/api/shop/COrder', {data: {id: oid}}).done(function (res) {
                    if (res.status !== 1) {
                        base.ui.alert(res.msg);
                        return false;
                    }

                    this.model.get('detail').status = 0;
                    this.render();
                }.bind(this));
            }.bind(this));
        },
        //支付订单
        buyOrder: function () {
            var openid = this.model.get('openid');
            var oid = this.model.get('oid');
            var ptype = this.model.get('oid');
            $.ajax({
                url: '/api/WeiXinPay/PingPay',
                data: {openid: openid, orderid: oid, channel: ptype}
            }).done(function (res) {
                if (res.status !== 1) {
                    base.ui.alert(res.msg);
                    return false;
                }
                //BoJSBridge.nativePayment({ charge:"xxx"},function(status,msg){
                //
                //});
                //微信端调用微信支付
                //if (!res.info.payurl) {
                //    //调用微信支付必须在重新生成token之后，以防多公众账号同用时出错
                //    res.info.hash = '#odetail/' + oid + '/' + openid;
                //    wxapi(null, openid, function () {
                //        //调用微信支付
                //        wxapi({
                //            pay: res.info
                //        });
                //    });
                //}
                ////非微信端调用支付宝
                //else {
                //    location.href = res.info.payurl;
                //}
            });
        },

        //未付款、已付款、全部
        filterOrder: function (e) {
            var $this = this.$el.find(e.currentTarget);
            var index = $this.index();
            var list = [];

            if ($this.hasClass('active')) return false;

            switch (index) {
                case 0:
                    list = $.grep(this.olist, function (item) {
                        return item.status === 1;
                    });
                    break;
                case 1:
                    list = $.grep(this.olist, function (item) {
                        return item.status === 2;
                    });
                    break;
                case 2:
                    list = this.olist.map(function (item) {
                        return item;
                    });
                    break;
                default:
                    break;
            }

            $this.addClass('active').siblings().removeClass('active');
            this.model.set('index', index);
            this.model.set('list', list);
        },
        orderlist:function(){
            var buxian='buxian';
            base.tool.cookie.set('buxian',buxian);
        },
        boboEnroll: function (e) {
            if (e.currentTarget.classList.contains('disabled')) {
                base.ui.alert('本次课程已失效');
                return false;
            }
        },
        saveBasic: function () {
            var basicdata = this.$el.find('.basic-form').serialize();
            var basicquery = base.tool.unserialize(basicdata);
            if (!basicquery.name) {
                base.ui.alert('姓名不能为空');
                return false;
            }
            if (!basicquery.age) {
                base.ui.alert('年龄不能为空');
                return false;
            }
            if (!basicquery.sex) {
                base.ui.alert('请选择你的性别');
                return false;
            }
            if (!basicquery.job) {
                base.ui.alert('请选择你现在的职位');
                return false;
            }
            base.tool.cookie.set('evbasic', basicdata);
        },
        selectAnswer: function (e) {
            var $this = this.$el.find(e.currentTarget);
            var uid = this.model.get('uid');
            var idx = this.model.get('idx');
            $this.addClass('active').siblings('li').removeClass('active');
            setTimeout(function () {
                var answer = base.tool.cookie.get('evanswer').split(';');
                index = $this.index();

                answer[idx - 1] = index;
                console.log(answer)
                base.tool.cookie.set('evanswer', answer.join(';'));

                //location.hash = 'evaluating/'+ (parseInt(idx)+1) + '/'+ uid;
            }, 200);
        },
        navbar: function (e) {
            var $this = this.$el.find(e.currentTarget);
            $this.addClass('current').siblings().removeClass('current');
            //$("div[style]").removeAttr("style");
            //$("#content"+$this.index()).attr("style","z-index: 1000;");
            $("#content" + $this.index()).show().siblings().hide();
        },
        accordion: function (e) {
            var $this = this.$el.find(e.currentTarget);
            if ($this.find('div').is(':hidden')) {
                $this.find('b').addClass("hover");
                $this.find('s').addClass("current");
                $this.siblings().find('b').removeClass('hover');
                $this.siblings().find('s').removeClass('current');
                $this.find('div').slideDown(200);
                $this.siblings().find('div').slideUp(200);
            } else {
                $this.find('div').slideUp(200);
                $this.find('b').removeClass('hover');
                $this.find('s').removeClass('current');

            }
        },
        zixun: function () {
            var uid = this.model.get('uid');
            if (uid == "share") {
                alert("请下载波波网手机客户端");
                window.location.href = "http://www.51jianyue.com/help/bobodown/";
                return false;
            }
            var consult = this.$el.find('.daibai .consult');
            consult.slideDown(500).siblings().hide();
        },
        quxiao: function () {
            var consult = this.$el.find('.daibai .consult');
            consult.slideUp(500).siblings().show();
        },
        acl: function (e) {
            var $this = this.$el.find(e.currentTarget);
            var jsonval = $this.data("strvalue");
            //base.tool.cookie.set('jsonval', JSON.stringify(jsonval));
            window.location.hash = "#daibai/" + jsonval.ouid + "/" + this.model.get('uid');
        },
        fabu: function () {
            var consult = this.$el.find('.daibai .consult');
            var content = $('.consult textarea').val();
            var score = 5;
            var omuid = this.model.get('omuid');
            var uid = base.tool.cookie.get('duid');
            var member = this.model.get('member');
            if (content !== '') {
                $.ajax('/Api/Shop/Issuedadvisory', {
                    data: {
                        uid: uid,
                        ouid: omuid,
                        score: score,
                        content: content
                    }
                }).done(function (res) {
                    $('.consult textarea').val('');
                    if (res.status !== 1) {
                        base.ui.alert(res.msg);
                        return false;
                    }
                    base.ui.alert('评论成功');
                    consult.slideUp(500).siblings().show();
                    $.ajax('/Api/Shop/Getuserinteractionlist', {
                        data: {
                            uid: uid,
                            ouid: omuid,
                            pageindex: 0,
                            pagesize: 1
                        }
                    }).done(function (res) {
                        if (res.status !== 1) {
                            base.ui.alert(res.msg);
                            return false;
                        }
                        if (res.info.list.length !== 0) {
                            var str = '<div class="back"><a href="javascript:;"><img src="http://img.hairbobo.com/' + res.info.list[0].logo + '" alt=""/>';
                            str += '<p>' + res.info.list[0].name + '</p></a><div class="rg"><span class="data">' + res.info.list[0].cdate + '</span><p>' + res.info.list[0].content + '</p>';
                            str += '<span class="hf">学院回复：</span><p class="huifu">' + res.info.list[0].brecontent + '</p></div></div>';
                            $(str).insertAfter('.zixun')
                        } else {

                        }

                    });

                });
            } else {
                base.ui.alert('评论不能为空');
            }

        },
        kecheng: function (e) {
            var $this = this.$el.find(e.currentTarget);
            var id = $this.data("id");
            //console.log(id);
            var uid = this.model.get('uid');
            //if (uid == 0) uid = "share";
            window.location.hash = "#detail/" + id + "/" + uid;
        },
        fenxiang:function(){
            var omuid=this.model.get('omuid');
            var name=this.model.get('list').name;
            BoJSBridge.nativeShare({ shareImageUrl:'http://shop.hairbobo.com/shop/images/logo/' + omuid + '.jpg', //图片链接（绝对路径），分享到微信会以微信模板显示
                shareText:name + '的微官网',//分享的内容
                shareTitle:name,//分享的标题
                shareUrl:location.origin + location.pathname + '#daibai/' + omuid + '/share'//分享的链接
            },function(result){});
        }
    };

    return funcs;
});	