define(['jquery', 'base', 'view', 'funcs', 'wxapi', 'calendar', 'qas', 'juicer', 'ckb'], function ($, base, view, funcs, wxapi, calendar, qas, juicer, ckb) {
    //设置一下全局的ajax
    $.ajaxSetup({
        type: 'post'
    });
    //var index_pageindex=1;
    //var index_de=true;
    var routes = {

        //404
        notFound: function () {
            base.ui.alert('页面不存在，请检查你输入的地址是否正确！');
        },

        router: function (name) {
            var _this = this;
            //分派路由
            return function () {
                _this.global(name);
                _this[name].apply(null, arguments);
            }
        },

        //全局路由
        global: function (name) {
            if (name !== 'detail' && name !== 'daibai' && name !== 'index' && name !== 'search' && base.device.isWeixin) {
                //隐藏微信菜单
                wxapi({
                    hidemenu: true
                });
            } else {
                //去掉没用的参数
                if (location.search.indexOf('from=') !== -1) {
                    location.replace(location.origin + location.pathname + location.hash);
                }
            }
            //统计
            if (name !== 'index') {
                //设置一下全局的ajax
                $.ajaxSetup({
                    type: 'post',
                    beforeSend: function () {
                        //base.ui.createWait();
                        $('.base-ui-wait1').show();
                    },
                    error: function () {
                        base.ui.alert('系统错误，请稍后重试！');
                    },
                    complete: function () {
                        //base.ui.closeWait();
                        $('.base-ui-wait1').hide();
                    }
                });
            }
        },

        index: function (uid) {
            //去掉没用的参数
            if (location.search.indexOf('from=') !== -1) {
                location.replace(location.origin + location.pathname + location.hash);
            }
            var events = {
                'click .search_ss b': funcs.searchword,
                'click .filter': funcs.showSort,
                'click .menu a': funcs.menuCtrl1,
                'click .type-list li': funcs.showFilter,
                'click .option-list li': funcs.selectFilter,
                'click .repeat-type': funcs.repeatType1,
                'click .hddb': funcs.hddb,
                'click .kcb': funcs.kcb,
                'click #mzkc li a': funcs.searchtype
                //'click .allbobo': funcs.allbobo
                //'click .month':ckb.update
                //'scroll window':funcs.gun
            };
            var user1=base.tool.cookie.get('user')?base.tool.cookie.get('user'):null;
            var type1=base.tool.cookie.get('type2')?base.tool.cookie.get('type2'):null;
            //var info1=base.tool.cookie.get('info')?base.tool.cookie.get('info'):null;
            var school1=base.tool.cookie.get('school')?base.tool.cookie.get('school'):null;
            var classweek1=base.tool.cookie.get('classweek')?base.tool.cookie.get('classweek'):null;
            var shijian1=base.tool.cookie.get('shijian')?base.tool.cookie.get('shijian'):null;
            var now=new Date().getTime();
            //console.log(parseInt(shijian1))
            //console.log(now)
            //console.log(now<parseInt(shijian1))
            //if(user1&&type1&&info1&&classweek1&&(now<parseInt(shijian1))){
            if(user1&&type1&&classweek1&&school1&&(now<parseInt(shijian1))){
                console.log(111)
                user1=JSON.parse(user1);
                type1=JSON.parse(type1);
                //info1=JSON.parse(info1);
                classweek1=JSON.parse(classweek1);
                school1=JSON.parse(school1);
                var banners=base.tool.cookie.get('banners')?base.tool.cookie.get('banners'):null;
                var goods1=base.tool.cookie.get('goods1')?base.tool.cookie.get('goods1'):null;
                var goods2=base.tool.cookie.get('goods2')?base.tool.cookie.get('goods2'):null;
                var goods4=base.tool.cookie.get('goods4')?base.tool.cookie.get('goods4'):null;
                base.tool.cookie.set('duid', user1.info.uid);
                //var data = {uid: uid, user: user.info, banners: banners.info, goods: goods.info};
                var data = {uid: uid, user: user1.info};
                //data.type=['','剪裁', ' 染色',  '造型 ','烫发', '编盘','接发','管理','营销'];
                data.banners=JSON.parse(banners);
                data.goods1=JSON.parse(goods1);
                data.goods2=JSON.parse(goods2);
                data.goods4=JSON.parse(goods4);
                data.lasttype = [];
                data.cw = classweek1.info;
                //var num = Math.floor(Math.random() * info1.info.length);
                //data.buy = info1.info.slice(num).concat(info1.info.slice(0, num));
                data.classtype = type1.info;
                data.classtype.unshift({
                    "key": "month",
                    "name": "月份",
                    "list": [
                        {
                            "id": "-1", "val": "全部"
                        },
                        {
                            "id": "1", "val": "1月"
                        },
                        {
                            "id": "2", "val": "2月"
                        },
                        {
                            "id": "3", "val": "3月"
                        },
                        {
                            "id": "4", "val": "4月"
                        },
                        {
                            "id": "5", "val": "5月"
                        },
                        {
                            "id": "6", "val": "6月"
                        },
                        {
                            "id": "7", "val": "7月"
                        },
                        {
                            "id": "8", "val": "8月"
                        },
                        {
                            "id": "9", "val": "9月"
                        },
                        {
                            "id": "10", "val": "10月"
                        },
                        {
                            "id": "11", "val": "11月"
                        },
                        {
                            "id": "12", "val": "12月"
                        }
                    ]
                });
                data.filter = {
                    pageindex: 1,
                    pagesize: 100,
                    oederby: -1
                };
                data.title = '波波网专业教育';
                data.list = school1.info.list;
                data.biglist = [];
                data.smmlist = [];
                data.smlist = [];
                data.zuixiao = [];
                for (var i = 0; i < data.list.length; i++) {
                    if (data.list[i].recommend == 2) {
                        data.biglist.push(data.list[i]);
                    } else if (data.list[i].recommend == 1) {
                        data.smlist.push(data.list[i]);
                    } else {
                        data.zuixiao.push(data.list[i]);
                        if (!data.zuixiao.length) {
                            data.zuixiao = null;
                        }
                    }
                }
                var slist=data.smlist;
                data.len=slist.length%2==0?slist.length/2:slist.length/2+1;
                for (var k = 0; k < data.len; k++) {
                    if(slist.length>=2){
                        data.biglist.push(slist.splice(0, 2));
                    }else{
                        data.biglist.push(slist.splice(0));
                    }
                }
                //data.num = Math.floor(Math.random() * (data.biglist.length+1));
                data.num = Math.floor(Math.random() * data.biglist.length);
                //if(data.num>data.biglist.length){
                //    data.showpic=null;
                //}else{
                    data.showpic=data.biglist[data.num];
                //}
                view('index', data, events).done(function (nowview) {
                    $('.base-ui-wait1').hide();
                    ckb.init($('.kcb_pop'));
                    base.tool.cookie.remove('result');
                    base.tool.cookie.remove('date');
                    base.tool.cookie.remove('type');
                    //require(['Swiper'], function (Swiper) {
                    //    new Swiper('.swiper-container', {
                    //        autoplay: 1500,
                    //        autoplayDisableOnInteraction: false,
                    //        direction: 'vertical',
                    //        loop: true
                    //    });
                    //});
                    $(window).unbind("scroll").on('scroll', function () {
                        var iTop = $(document).scrollTop();
                        if (iTop > 200) {
                            $('.wd_hd').fadeIn();
                        }
                        else {
                            $('.wd_hd').fadeOut();
                        }
                        //if ($(document).height() >= 3500) {
                        //    query();
                        //}
                    });
                });
            }else{
                console.log(222)
                var mdate = new Date();
                var mdates = mdate.getFullYear() + '-' + (mdate.getMonth() + 1) + '-' + mdate.getDate();
                var expires=new Date(new Date().getTime()+1000*60*5).getTime();
                //console.log(expires)
                base.tool.cookie.set('shijian',expires);
                $.when(
                    uid === 'share' ? [{
                        "info": {"nickname": "未登录用户", "logo": "images/anonymous.png", "attach": true},
                        "status": 1
                    }] : $.ajax('/api/shop/GetUserInfo', {data: {uid: uid}}),
                    //$.ajax('/api/shop/GetBanner2'),
                    //$.ajax('/api/shop/GetShopDefult', {data: {uid: uid}}),
                    $.ajax('/Api/Shop/GetShoptype'),
                    //$.ajax('/API/Shop/GetHomeInfo'),//会员关注课程接口
                    $.ajax('/API/Shop/GetShopClassweek', {data: {date: mdates}}),
                    $.ajax('/Api/Shop/GetClublistinfo', {data: {uid: uid}})
                //).done(function (user, type, info, classweek) {
                ).done(function (user, type, classweek,school) {
                        user = user[0];
                        //banners = banners[0];
                        //goods = goods[0];
                        type = type[0];
                        //info = info[0];
                        classweek = classweek[0];
                        school = school[0];
                        base.tool.cookie.set('user',JSON.stringify(user));
                        base.tool.cookie.set('type2',JSON.stringify(type));
                        //base.tool.cookie.set('info',JSON.stringify(info));
                        base.tool.cookie.set('classweek',JSON.stringify(classweek));
                        base.tool.cookie.set('school',JSON.stringify(school));
                        if (user.status !== 1) {
                            base.ui.alert(user.msg);
                            return false;
                        }
                        base.tool.cookie.set('duid', user.info.uid);
                        //var data = {uid: uid, user: user.info, banners: banners.info, goods: goods.info};
                        var data = {uid: uid, user: user.info};
                        //data.type=['','剪裁', ' 染色',  '造型 ','烫发', '编盘','接发','管理','营销'];
                        data.lasttype = [];
                        data.cw = classweek.info;
                        //var num = Math.floor(Math.random() * info.info.length);
                        //data.buy = info.info.slice(num).concat(info.info.slice(0, num));
                        data.classtype = type.info;
                        data.classtype.unshift({
                            "key": "month",
                            "name": "月份",
                            "list": [
                                {
                                    "id": "-1", "val": "全部"
                                },
                                {
                                    "id": "1", "val": "1月"
                                },
                                {
                                    "id": "2", "val": "2月"
                                },
                                {
                                    "id": "3", "val": "3月"
                                },
                                {
                                    "id": "4", "val": "4月"
                                },
                                {
                                    "id": "5", "val": "5月"
                                },
                                {
                                    "id": "6", "val": "6月"
                                },
                                {
                                    "id": "7", "val": "7月"
                                },
                                {
                                    "id": "8", "val": "8月"
                                },
                                {
                                    "id": "9", "val": "9月"
                                },
                                {
                                    "id": "10", "val": "10月"
                                },
                                {
                                    "id": "11", "val": "11月"
                                },
                                {
                                    "id": "12", "val": "12月"
                                }
                            ]
                        });
                        data.filter = {
                            pageindex: 1,
                            pagesize: 100,
                            oederby: -1
                        };
                        data.title = '波波网专业教育';
                        data.list = school.info.list;
                        data.biglist = [];
                        data.smmlist = [];
                        data.smlist = [];
                        data.zuixiao = [];
                        for (var i = 0; i < data.list.length; i++) {
                            if (data.list[i].recommend == 2) {
                                data.biglist.push(data.list[i]);
                            } else if (data.list[i].recommend == 1) {
                                data.smlist.push(data.list[i]);
                            } else {
                                data.zuixiao.push(data.list[i]);
                                if (!data.zuixiao.length) {
                                    data.zuixiao = null;
                                }
                            }
                        }
                        var slist=data.smlist;
                        data.len=slist.length%2==0?slist.length/2:slist.length/2+1;
                        for (var k = 0; k < data.len; k++) {
                            if(slist.length>=2){
                                data.biglist.push(slist.splice(0, 2));
                            }else{
                                data.biglist.push(slist.splice(0));
                            }
                        }
                        //data.num = Math.floor(Math.random() * (data.biglist.length+1));
                        data.num = Math.floor(Math.random() * data.biglist.length);
                        //if(data.num>data.biglist.length){
                        //    data.showpic=null;
                        //}else{
                            data.showpic=data.biglist[data.num];
                        //}
                        view('index', data, events).done(function (nowview) {
                            $('.base-ui-wait1').hide();
                            ckb.init($('.kcb_pop'));
                            //$('html,body').animate({scrollTop: '0'}, 0);
                            base.tool.cookie.remove('result');
                            base.tool.cookie.remove('date');
                            base.tool.cookie.remove('type');
                            //base.tool.cookie.remove('bbyl');
                            //require(['Swiper'], function (Swiper) {
                            //    new Swiper('.swiper-container', {
                            //        autoplay: 1500,
                            //        autoplayDisableOnInteraction: false,
                            //        direction: 'vertical',
                            //        loop: true
                            //    });
                            //});
                            $.ajax('/api/shop/GetBanner2').done(function (banners) {
                                var data = {uid: uid};
                                var events = {};
                                data.banners = banners.info;
                                base.tool.cookie.set('banners',JSON.stringify(banners.info));
                                view('hometbtj', data, events, '.tbtj', nowview);
                            });
                            $.ajax('/api/shop/GetCNXH', {data: {uid: uid}}).done(function (goods1) {
                                var data = {uid: uid};
                                var events = {};
                                data.goods1 = goods1.info;
                                base.tool.cookie.set('goods1',JSON.stringify(goods1.info));
                                view('homecnxh', data, events, '.homecnxh', nowview);
                            });
                            $.ajax('/api/shop/GetRQKC', {data: {uid: uid}}).done(function (goods2) {
                                var data = {uid: uid};
                                var events = {};
                                data.goods2 = goods2.info;
                                base.tool.cookie.set('goods2',JSON.stringify(goods2.info));
                                view('homerqkc', data, events, '.rqkc', nowview);
                            });
                            //$.ajax('/api/shop/GetTHKC', {data: {uid: uid}}).done(function (goods3) {
                            //    var data = {uid: uid};
                            //    var events = {};
                            //    data.goods3 = goods3.info;
                            //    view('homethkc', data, events, '.homethkc', nowview);
                            //});
                            $.ajax('/Api/Shop/GetShopHomeClassInfo').done(function (goods4) {
                                var data = {uid: uid};
                                var events = {};
                                data.goods4 = goods4.info;
                                base.tool.cookie.set('goods4',JSON.stringify(goods4.info));
                                view('homexxkc', data, events, '.xxkc', nowview);
                            });
                            //require(['lazyload'], function () {
                            //    $("img.lazyload").lazyload({
                            //        //placeholder : "../images/loadpic.png",
                            //        effect: 'fadeIn'
                            //    });
                            //});
                            //console.log($(document).height());
                            //console.log($(window).height());
                            //console.log($(document).scrollTop());
                            // page_index=1;
                            //var index_pageindex=1;
                            var index_pageindex = 1;
                            //var index_de=true;
                            var ajaxState = true;
                            //if(index_de)
                            //{
                            var query = _(function () {
                                if (!ajaxState) return false;
                                if ($(document).height() - $(window).height() - $(document).scrollTop() <= 300) {
                                    $('.sljz').text('加载中...');
                                    index_pageindex++;
                                    $.ajax('/Api/Shop/GetShopClass', {
                                        data: {
                                            month: -1,
                                            city: -1,
                                            type: -1,
                                            cuid: -1,
                                            oederby: -1,
                                            pageindex: index_pageindex,
                                            pagesize: 10
                                        }
                                    }).done(function (res) {
                                        if (res.status == 1) {
                                            data.list = res.info;
                                            //ajaxState=data.list.length < 10 ? false : true;
                                            //$('.sljz').text('加载中...');
                                            var aelems = [];
                                            setTimeout(
                                                function () {
                                                    var str = '';
                                                    var imgli = '';
                                                    var textli = '';
                                                    var sj = '';
                                                    //var frag = document.createDocumentFragment();
                                                    for (var i = 0, len = data.list.length; i < len; i++) {
                                                        if (data.list[i].gift !== '' && data.list[i].gift !== null) {
                                                            imgli = '<span class="xyyl">学院有礼</span>';
                                                        }
                                                        if (data.list[i].bobogift !== '' && data.list[i].bobogift !== null) {
                                                            textli = '<span class="bbyl">波波有礼</span>';
                                                        }
                                                        if (data.list[i].vipsellingprice == 0 || data.list[i].vipsellingprice == null) {
                                                            sj = '';
                                                        } else {
                                                            sj = '/' + data.list[i].vipsellingprice + '天';
                                                        }
                                                        str = '<a class="row" href="#detail/' + data.list[i].id + '/' + data.uid + '"><div class="col-25"><div class="img">'
                                                        + '<img src="http://img.hairbobo.com/' + data.list[i].image + '"></div></div><div class="col-75 text">'
                                                        + '<div class="tit">' + data.list[i].title.slice(0, 15) + '</div><div class="cnt">' + data.list[i].moneyinfo + '</div>'
                                                        + '<div class="boot">' + textli + imgli + '<span class="price">' + data.list[i].frontmoney + '元' + sj + '</span><span class="city">' + data.list[i].didname + '</span></div></div></a>';
                                                        imgli = '';
                                                        textli = '';
                                                        sj = '';

                                                        aelems.push(str)
                                                    }
                                                    $("#list").append(aelems.join(''));
                                                    //$('img').lazyload();
                                                    $('.sljz').text('上拉显示更多');
                                                }, 500);
                                        } else {
                                            $('.sljz').text('没有更多了...');
                                            ajaxState = false;
                                            return false;
                                        }
                                    });
                                }
                            }).throttle(500);
                            $(window).unbind("scroll").on('scroll', function () {
                                var iTop = $(document).scrollTop();
                                if (iTop > 200) {
                                    $('.wd_hd').fadeIn();
                                }
                                else {
                                    $('.wd_hd').fadeOut();
                                }
                                //if ($(document).height() >= 3500) {
                                //    query();
                                //}
                            });
                        });
                    });
            }
            base.device.isWeixin && wxapi({
                showmenu: true,
                share: {
                    imgUrl: 'http://shop.hairbobo.com/shop/images/logo.png',
                    link: location.origin + location.pathname + '#index/share',
                    desc: '波波网专业教育栏目~',
                    title: '波波网联合数十家优质合作学院提供的最优惠课程',
                    callback: function (reswx) {
                        //统计分享
                    }
                }
            });
        },

        classlist: function (uid, dbid, word) {
            var data = {uid: uid, dbid: dbid};

            var events = {
                'focus .search input': funcs.searchFocus,
                'blur .search input': funcs.searchBlur,
                'click .clear-input': funcs.clearSearch,
                'click .search-btn': funcs.searchSubmit,
                'click .sort': funcs.showSort,
                'click .sort-items a': funcs.selectSort,
                'click .filter': funcs.showSort,
                'click .menu a': funcs.menuCtrl,
                'click .type-list li': funcs.showFilter,
                'click .repeat-type': funcs.repeatType,
                'click .option-list li': funcs.selectFilter
            };
            var ajax;
            var cid = -1;
            if (dbid)cid = dbid;
            var result1 = base.tool.cookie.get('result') ? base.tool.cookie.get('result') : null;
            var date = base.tool.cookie.get('date') ? base.tool.cookie.get('date') : null;
            var type = base.tool.cookie.get('type') ? base.tool.cookie.get('type') : null;
            var bbyl = base.tool.cookie.get('bbyl') ? base.tool.cookie.get('bbyl') : null;
            if (result1) {
                result1 = JSON.parse(result1);
                ajax = $.ajax('/Api/Shop/GetShopClass', {
                    data: result1
                })
            } else if (date && type) {
                ajax = $.ajax('/Api/Shop/GetShopClass',
                    {
                        data: {
                            month: -1,
                            city: -1,
                            type: type,
                            cuid: -1,
                            oederby: -1,
                            pageindex: 1,
                            pagesize: 100,
                            date: date
                        }
                    }
                )
            } else {
                ajax = $.ajax('/Api/Shop/GetShopClass', {
                    data: {
                        month: -1,
                        city: -1,
                        type: -1,
                        cuid: cid,
                        oederby: -1,
                        pageindex: 1,
                        pagesize: 500
                    }
                })
            }
            $.when(
                ajax,
                $.ajax('/Api/Shop/GetShoptype')
            ).done(function (list, type) {
                    list = list[0];
                    type = type[0];
                    if (list.status !== 1) {
                        base.ui.alert(list.msg);
                        return false;
                    }
                    if (type.status !== 1) {
                        base.ui.alert(type.msg);
                        return false;
                    }
                    if (word && word == 'bbyl') {
                        data.classlist = $.grep(list.info, function (item) {
                            return item.bobogift !== null;
                        });
                    }
                    else {
                        data.classlist = list.info;
                    }
                    data.classtype = type.info;
                    data.classtype.unshift({
                        "key": "month",
                        "name": "月份",
                        "list": [
                            {
                                "id": "-1", "val": "全部"
                            },
                            {
                                "id": "1", "val": "1月"
                            },
                            {
                                "id": "2", "val": "2月"
                            },
                            {
                                "id": "3", "val": "3月"
                            },
                            {
                                "id": "4", "val": "4月"
                            },
                            {
                                "id": "5", "val": "5月"
                            },
                            {
                                "id": "6", "val": "6月"
                            },
                            {
                                "id": "7", "val": "7月"
                            },
                            {
                                "id": "8", "val": "8月"
                            },
                            {
                                "id": "9", "val": "9月"
                            },
                            {
                                "id": "10", "val": "10月"
                            },
                            {
                                "id": "11", "val": "11月"
                            },
                            {
                                "id": "12", "val": "12月"
                            }
                        ]
                    });
                    data.filter = {
                        pageindex: 1,
                        pagesize: 100,
                        oederby: -1
                    };

                    view('classlist', data, events).done(function (nowview) {
                        $('.base-ui-wait1').hide();
                        nowview.oldlist = data.classlist ? data.classlist.map(function (item) {
                            return item;
                        }) : null;
                        if (word && word !== 'bbyl') {
                            $('input').eq(0).val(word);
                            $('.search-btn').click(function () {
                            }).trigger('click');
                        }
                        //var result1=base.tool.cookie.get('result')?base.tool.cookie.get('result'):null;
                        //var date=base.tool.cookie.get('date')?base.tool.cookie.get('date'):null;
                        //var type=base.tool.cookie.get('type')?base.tool.cookie.get('type'):null;
                        //if(result1){
                        //    result1 = JSON.parse(result1);
                        //    $.ajax('/Api/Shop/GetShopClass',
                        //        {data: result1}
                        //    ).done(function (res) {
                        //        if (res.status !== 1) {
                        //            base.ui.alert(res.msg);
                        //            return false;
                        //        }
                        //        nowview.model.set('classlist', res.info);
                        //        //var filter = nowview.model.get('filter');
                        //        nowview.model.set('filter', result1);
                        //        nowview.oldlist = res.info.map(function (item) {
                        //            return item;
                        //        });
                        //        nowview.render();
                        //    });
                        //    //base.tool.cookie.remove('result');
                        //}else if(date&&type){
                        //    $.ajax('/Api/Shop/GetShopClass',
                        //        {data: {
                        //            month: -1,
                        //            city: -1,
                        //            type: type,
                        //            cuid: -1,
                        //            oederby: -1,
                        //            pageindex: 1,
                        //            pagesize: 100,
                        //            date:date
                        //        }}
                        //    ).done(function (res) {
                        //            if (res.status !== 1) {
                        //                base.ui.alert(res.msg);
                        //                return false;
                        //            }
                        //            nowview.model.set('classlist', res.info);
                        //            nowview.oldlist = res.info.map(function (item) {
                        //                return item;
                        //            });
                        //            nowview.render();
                        //        });
                        //}
                    });
                });
        },
        //detailold: function (id, uid, openid) {
        //
        //    /*//微信授权
        //     if(!openid && base.device.isWeixin){
        //     location.href= location.origin + '/home/GetOpenID/?htmlurl=detail/'+id+'/'+uid;
        //     }
        //     */
        //
        //    //去掉没用的参数
        //    if (location.search.indexOf('from=') !== -1) {
        //        location.replace(location.origin + location.pathname + location.hash);
        //    }
        //
        //    var data = {id: id, uid: uid, link: window.location.href, openid: openid};
        //    var events = {
        //        'click .detail-top a': funcs.topCtrl,
        //        'click .number': funcs.selectNumber,
        //        'click .select-date': funcs.showDate,
        //        'click .confrim-date': funcs.confirmDate,
        //        'click .buy-btn': funcs.submitBuy,
        //        'click .link-tel': funcs.linktel
        //
        //    };
        //
        //    $.ajax('/api/shop/GetShopClassdetital', {data: {id: id, uid: uid}}).done(function (res) {
        //        if (res.status !== 1) {
        //            base.ui.alert(res.msg, function () {
        //                window.history.back();
        //            });
        //            return false;
        //        }
        //        var datearr = res.info.classdate;
        //        var datasub = res.info.tdate;
        //        data.detail = res.info;
        //        data.link=location.origin + location.pathname + '#detail/' + id + '/share';
        //        view('detailold', data, events).done(function () {
        //            require(['Swiper'], function (Swiper) {
        //                new Swiper('.swiper-container', {
        //                    pagination: '.swiper-pagination',
        //                    paginationClickable: true
        //                });
        //            });
        //            //初始化日历
        //            calendar.init($('#date'), datearr, datasub);
        //        });
        //
        //        //微信分享
        //        base.device.isWeixin && wxapi({
        //            showmenu: true,
        //            share: {
        //                imgUrl: 'http://img.hairbobo.com' + res.info.image,
        //                link: location.origin + location.pathname + '#detail/' + id + '/share',
        //                desc: '我觉得' + res.info.title + '非常赞，感兴趣的去看看哦~',
        //                title: '我觉得' + res.info.title + '非常赞，感兴趣的去看看哦~',
        //                callback: function (reswx) {
        //                    //统计分享
        //                }
        //            }
        //        });
        //    });
        //
        //},
        detail: function (id, uid, openid) {
            //微信授权
            // if(!openid && base.device.isWeixin){
            // location.href= location.origin + '/home/GetOpenID/?htmlurl=detail/'+id+'/'+uid;
            // }
            //console.log(location.origin);
            //console.log(location.pathname);
            //console.log(location.hash);
            //console.log(location.search);
            if (location.search.indexOf('from=') !== -1) {
                location.replace(location.origin + location.pathname + location.hash);
            }
            var data = {id: id, uid: uid, openid: openid};
            //var data = {id: id, uid: uid, link: 'http://shop.hairbobo.com/shop/index.html#detail/'+id+'/share', openid: openid};
            var events = {
                'click .detail-top a': funcs.topCtrl,
                'click .selectdate': funcs.showDate,
                'click .confrim-date': funcs.confirmDate,
                'click .gmsl': funcs.selectNumber,
                'click .buy-btn': funcs.submitBuy,
                'click .link-tel': funcs.poptell,
                'click .zezao': funcs.zezao,
                'click .phone': funcs.phone,
                'click .call': funcs.linktel,
                'click .link-qq': funcs.linkqq,
                'click .attention': funcs.attxy,
                //'click #popxy img': funcs.wximg
            };
            $.ajax('/api/shop/GetShopClassdetital', {data: {id: id, uid: uid}}).done(function (res) {
                if (res.status !== 1) {
                    base.ui.alert(res.msg, function () {
                        window.history.back();
                    });
                    return false;
                }
                var datearr = res.info.classdate;
                var datasub = res.info.tdate;
                data.nearest = datearr[0];
                data.detail = res.info;
                var list0 = ['', '剪裁', '染色', '造型', '烫发', '编盘', '接发', '管理', '营销'];
                var list1 = [' ', '无要求', '小工/助理', '中工/技师', '发型师', '发型总监', '教育导师', '店长/管理层'];
                var list2 = [' ', '无要求', '零基础', '2年以下', '2~4年', '5~7年', '8~10年', '10年以上'];
                var list3 = [' ', '无要求', '沙宣剪裁课程', '汤尼盖剪裁课程', '学过方圆三角'];
                data.people = res.info.people;
                var type = res.info.type;
                if (data.people.indexOf(';') !== -1) {
                    var peplist = data.people.split(';');
                    if(peplist[2]=='5'){
                        data.peo = '#课程类别：' + list0[type] + '<br/>#职称：' + list1[peplist[0]] + '<br/>#经验：' + list2[peplist[1]] + '<br/>#要求基础课程：' + peplist[3];
                    }else{
                        data.peo = '#课程类别：' + list0[type] + '<br/>#职称：' + list1[peplist[0]] + '<br/>#经验：' + list2[peplist[1]] + '<br/>#要求基础课程：' + list3[peplist[2]];
                    }
                } else {
                    data.peo = data.people;
                }
                data.clubid = res.info.uid;
                data.link = location.origin + location.pathname + '#detail/' + id + '/share';
                view('detail', data, events).done(function () {
                    $('.base-ui-wait1').hide();
                    $('.dt_width').width($('.rgt_div').width() + 75);
                    if (window.navigator.userAgent.indexOf('BoBoiOS') !== -1 || window.navigator.userAgent.indexOf('BoBoAndroid') !== -1) {
                        $('.detail-lg').hide();
                        $('.banners').css('margin-top', '0');
                    } else {
                        // $('.detail-top').hide();
                        $('.attention').show();
                    }
                    //if(window.navigator.userAgent.search(/MicroMessenger/i) !== -1){
                    //    $('.attention').show();
                    //}
                    require(['Swiper'], function (Swiper) {
                        new Swiper('.swiper-container', {
                            pagination: '.swiper-pagination',
                            autoplay: 3000,
                            autoplayDisableOnInteraction: false,
                            paginationClickable: true
                        });
                    });
                    //初始化日历
                    calendar.init($('#date'), datearr, datasub);
                });
                //微信分享
                base.device.isWeixin && wxapi({
                    showmenu: true,
                    share: {
                        imgUrl: 'http://img.hairbobo.com' + res.info.image,
                        link: location.origin + location.pathname + '#detail/' + id + '/share',
                        desc: '波波网专业教育推荐课程~',
                        title: '我觉得' + res.info.title + '非常赞，感兴趣的去看看哦~',
                        callback: function (reswx) {
                            //统计分享
                        }
                    }
                });
            })

        },
        dssppl: function (id, index, uid) {
            var data = {id: id, uid: uid, index: index};
            var events = {
                'click .review-list a': funcs.commsOption,
                'click .reply-submit': funcs.commSubmit
            };

            if (index != 1 && index != 2 && index != 3) {
                base.ui.alert('页面不存在，请检查你输入的地址是否正确！');
                return false;
            }

            $.when(
                $.ajax('/api/shop/GetShopClassdetital', {data: {id: id}}),
                $.ajax('/api/shop/GetShopComment', {data: {id: id}})
            ).done(function (detail, comms) {
                    detail = detail[0];
                    comms = comms[0];
                    if (detail.status !== 1) {
                        base.ui.alert(detail.msg);
                        return false;
                    }
                    if (comms.status !== 1) {
                        base.ui.alert(comms.msg);
                        return false;
                    }
                    data.detail = detail.info;
                    data.cont = data.detail.content.replace(/width="[\d]+"|height="[\d]+"/ig, '');
                    data.tuto = data.detail.tutorinfo.replace(/width="[\d]+"|height="[\d]+"/ig, '');
                    data.comms = comms.info;
                    view('dssppl', data, events).done(function (nowview) {
                        $('.base-ui-wait1').hide();
                        require(['Swiper'], function (Swiper) {
                            var $tab = nowview.$el.find('.dssppl-type a');
                            var oTabSwiper = new Swiper('.swiper-container', {
                                paginationClickable: true,
                                initialSlide: parseInt(index) - 1,
                                scrollbar: '.swiper-scrollbar',
                                scrollbarHide: false,
                                onSlideChangeStart: function (swiper) {
                                    $tab.eq(swiper.activeIndex).addClass('active').siblings().removeClass('active');
                                }
                            });
                            $tab.on('click', function () {
                                oTabSwiper.slideTo($(this).index());
                            });
                        });
                    });
                });
        },
        accounts: function (id, uid, openid) {

            //alert(base.device.isWeixin);
            //微信授权
            if (!openid && base.device.isWeixin) {
                location.href = location.origin + '/test/GetOpenID/?htmlurl=accounts/' + id + '/' + uid;
            }

            //商品数量
            var onum = parseInt(base.tool.cookie.get('onum'));
            var odate = base.tool.cookie.get('odate');
            var data = {id: id, uid: uid, num: onum, date: odate, openid: openid};
            var events = {
                'click .acc-btn': funcs.accOrder,
                'click .pay button': funcs.paytp
            };
            $.when(
                $.ajax('/api/shop/GetShopClassdetital', {data: {id: id}}),
                $.ajax('/api/shop/GetOrderAddress', {data: {uid: uid}})
            ).done(function (detail, address) {
                    detail = detail[0];
                    address = address[0];
                    if (detail.status !== 1) {
                        base.ui.alert(detail.msg);
                        return false;
                    }

                    data.paytype = base.device.isWeixin ? 2 : 1;
                    data.detail = detail.info;
                    data.address = address.status !== 1 ? {} : address.info;
                    view('accounts', data, events).done(function () {
                        $('.base-ui-wait1').hide();
                        base.tool.cookie.remove('buxian');
                        document.body.addEventListener('touchstart', function () {
                        });
                    });
                });
        },
        odetail: function (oid, openid) {
            if (!openid && base.device.isWeixin) {
                location.href = location.origin + '/test/GetOpenID/?htmlurl=odetail/' + oid;
            }

            var data = {oid: oid, openid: openid};
            var events = {
                'click .cancel-btn': funcs.cancelOrder,
                'click .buy-btn': funcs.accOrder,
                'click .pay button': funcs.paytp2,
                'click .yes': funcs.yes,
                'click .no': funcs.no
            };
            $.ajax('/api/shop/GetOrderinfo', {data: {id: oid}}).done(function (res) {
                if (res.status !== 1) {
                    base.ui.alert(res.msg);
                    return false;
                }
                data.detail = res.info;
                var hide = base.tool.cookie.get('buxian') ? base.tool.cookie.get('buxian') : null;
                if ((window.navigator.userAgent.indexOf('BoBoiOS') !== -1 || window.navigator.userAgent.indexOf('BoBoAndroid') !== -1) && !hide) {
                    //if(!hide){
                    data.isbobo = true;
                } else {
                    data.isbobo = false;
                }
                view('odetail', data, events).done(function () {
                    $('.base-ui-wait1').hide();
                    //base.tool.cookie.remove('hide');
                    document.body.addEventListener('touchstart', function () {
                    });
                });
            });
        },

        olist: function (uid) {
            var data = {uid: uid};
            var events = {
                'click .order-type a': funcs.filterOrder,
                'click .order-list a': funcs.orderlist
            };
            $.ajax('/api/shop/GetOrder', {data: {uid: uid}}).done(function (res) {
                if (res.status !== 1) {
                    base.ui.alert(res.msg);
                    return false;
                }
                data.list = res.info;
                view('olist', data, events).done(function (nowview) {
                    $('.base-ui-wait1').hide();
                    nowview.olist = res.info;
                });
            });
        },

        boboclass: function (uid) {

            //$.when(
            //    $.ajax('/Api/Shop/GetClub',{data: {id: uid}}),
            //    $.ajax('/Api/Shop/GetClubList',{data: {uid: uid}})
            //).done(function(res,res1){
            //        if(res.status !== 1){
            //            base.ui.alert(res.msg);
            //            return false;
            //        }
            //        if(res1.status !== 1){
            //            base.ui.alert(res.msg);
            //            return false;
            //        }
            //        var data = { uid: uid};
            //        var events = {
            //            'click .enroll-btn': funcs.boboEnroll
            //        };
            //        data.month = res.info.month;
            //        data.list = res.info.list;
            //        data.piclist=res1.info;
            //        view('boboclass', data, events);
            //    });
            var data = {uid: uid};
            $.ajax('/Api/Shop/GetClub').done(function (res) {
                if (res.status !== 1) {
                    base.ui.alert(res.msg);
                    return false;
                }
                var events = {
                    'click .enroll-btn': funcs.boboEnroll
                };
                data.month = res.info.month;
                data.list = res.info.list;
                view('boboclass', data, events).done(function () {
                    $('.base-ui-wait1').hide();
                });
            });
            $.ajax('/Api/Shop/GetClubList').done(function (res) {
                if (res.status !== 1) {
                    base.ui.alert(res.msg);
                    return false;
                }
                //var data = { uid: uid};
                var events = {
                    //'click .cityid': funcs.boboEnroll
                };
                data.piclist = res.info;
                view('boboclass', data, events).done(function () {
                    $('.base-ui-wait1').hide();
                });
            });
        },

        evaluating: function (index, uid) {

            index = parseInt(index);
            if (isNaN(index) || (index !== 0 && index !== qas.length && !qas[index])) {
                base.ui.alert('页面不存在，请检查你输入的地址是否正确！');
                return false;
            }

            var data = {idx: index, uid: uid};
            var events = {
                'click .save-basic': funcs.saveBasic,
                'click .list li': funcs.selectAnswer
            };
            var basicdata = base.tool.cookie.get('evbasic');
            basicdata = base.tool.unserialize(basicdata);

            if (index === 0) {
                if (basicdata && basicdata.name)
                    basicdata.name = decodeURIComponent(basicdata.name.replace(/\+/g, " "));
                data.basic = basicdata;
                data.jobs = ['助理', '技师', '发型师', '总监', '老板'];
                view('evaluating', data, events).done(function () {
                    $('.base-ui-wait1').hide();
                });
            }
            else if (index === qas.length) {

                $.ajax('/api/shop/GetTest', {
                    data: {
                        uid: uid,
                        age: basicdata.age,
                        sex: basicdata.sex,
                        name: basicdata.name,
                        position: basicdata.job,
                        answer: base.tool.cookie.get('evanswer')
                    }
                }).done(function (res) {
                    if (res.status !== 1) {
                        base.ui.alert(res.msg);
                        return false;
                    }
                    data.level = res.info;
                    data.len = qas.length;
                    view('evaluating', data, {}).done(function () {
                        $('.base-ui-wait1').hide();
                    });
                });
            }
            else {
                data.qa = qas[index - 1];
                data.active = base.tool.cookie.get('evanswer').split(';')[index - 1];
                view('evaluating', data, events).done(function () {
                    $('.base-ui-wait1').hide();
                });
            }
        },
        cityclass: function (uid, clubid) {
            var data = {uid: uid, clubid: clubid};
            var events = {};
            $.ajax('/Api/Shop/GetClubInnfoByid', {data: {uid: clubid}}).done(function (res) {
                if (res.status !== 1) {
                    base.ui.alert(res.msg);
                    return false;
                }

                data.list = res.info;
                data.addr = data.list.address;
                data.call = data.list.call;
                data.imglist = {};
                data.loc = [0, 0];
                if (data.list.images != null) {
                    data.imglist = data.list.images.split(';');
                }
                if (data.list.location != null) {
                    data.loc = data.list.location.split(",");
                }
                data.lon = data.loc[0];
                data.lat = data.loc[1];
                data.name = data.list.name;
            });
            $.ajax('/Api/Shop/GetClubHair', {data: {uid: clubid}}).done(function (res) {
                if (res.status === 1) {
                    data.teacherlist = res.info;
                }
            });
            $.ajax('/Api/Shop/GetClubClassByid', {data: {uid: clubid}}).done(function (res) {
                if (res.status === 1) {
                    events = {
                        'click .enroll-btn': funcs.boboEnroll
                    };
                    data.month = res.info.month;
                    data.list = res.info.list;
                }
                view('cityclass', data, events).done(function () {
                    $('.base-ui-wait1').hide();
                    require(['Swiper'], function (Swiper) {
                        new Swiper('.swiper-container', {
                            pagination: '.dian',
                            autoplay: 3000,
                            autoplayDisableOnInteraction: false,
                            paginationClickable: true
                        });
                    });
                    require(['Swiper'], function (Swiper) {
                        new Swiper('.swiper-container1', {
                            paginationClickable: true
                        });
                    });
                });
            });
        },
        hairschool: function (uid) {
            if (!uid) uid = "share";
            var data = {uid: uid};
            var events = {
                'click .ddjl': funcs.linktel
            };
            $.ajax('/Api/Shop/GetClublistinfo', {data: {uid: uid}}).done(function (res) {
                if (res.status !== 1) {
                    base.ui.alert(res.msg);
                    return false;
                }
                data.list = res.info.list;
                data.title = '合作学院';
                data.biglist = [];
                data.smmlist = [];
                data.smlist = [];
                data.zuixiao = [];

                for (var i = 0; i < data.list.length; i++) {
                    //console.log( JSON.stringify(data.list[i]));
                    data.list[i].stringvalue = JSON.stringify(data.list[i]);
                    if (data.list[i].recommend == 2) {
                        data.biglist.push(data.list[i]);
                    } else if (data.list[i].recommend == 1) {
                        data.smlist.push(data.list[i]);
                    } else {
                        data.zuixiao.push(data.list[i]);
                        if (!data.zuixiao.length) {
                            data.zuixiao = null;
                        }
                    }
                }
                //data.xmx = data.smlist.splice(data.smmlist.length - 2, 1);
                //data.zsmx = data.smlist.splice(data.smmlist.length - 1, 1);
                //data.xmxx = data.xmx[0];
                //data.zsmxx = data.zsmx[0];
                view('hairschool', data, events).done(function () {
                    $('.base-ui-wait1').hide();
                });
            });
        },
        daibai: function (omuid, uid) {
            //去掉没用的参数
            if (location.search.indexOf('from=') !== -1) {
                location.replace(location.origin + location.pathname + location.hash);
            }
            console.log(location.search)
            if (!uid) uid = "share";
            var data = {uid: uid, omuid: omuid};
            var events = {
                //'click .zixun': funcs.zixun,
                //'click .clos': funcs.clos,
                //'click .quxiao': funcs.quxiao,
                //'click .fabu': funcs.fabu,
                //'click .class_pic': funcs.kecheng,
                'click .fenxiang': funcs.fenxiang,
                //'click .lxxy': funcs.linktel
                //'click .tiao': funcs.kecheng
            };
            //var jsonval = base.tool.cookie.get('jsonval');
            //if(jsonval){
            //    data.list = eval('(' + jsonval + ')');
            //}else{
            $.ajax('/Api/Shop/GetClublistinfo', {data: {uid: uid, ouid: omuid}}).then(function (res) {
                //console.log(res);
                if (res.status !== 1) {
                    base.ui.alert(res.msg);
                    return false;
                }
                data.list = res.info;
                data.photo = res.info.photo ? res.info.photo : null;
                data.call = data.list.phone;
                data.title = data.list.name;
                view('daibai', data, events).done(function (nowview) {
                    $('.base-ui-wait1').hide();
                    require(['Swiper'], function (Swiper) {
                        new Swiper('.swiper-container', {
                            pagination: '.dian',
                            autoplay: 3000,
                            autoplayDisableOnInteraction: false,
                            paginationClickable: true
                        });
                    });
                    if (base.device.isWeixin) {
                        $('.fenxiang').hide();
                        //微信分享
                        wxapi({
                            showmenu: true,
                            share: {
                                imgUrl: 'http://shop.hairbobo.com/shop/images/logo/' + omuid + '.jpg',
                                link: location.origin + location.pathname + '#daibai/' + omuid + '/share',
                                desc: data.list.name + '的微官网',
                                title: data.list.name,
                                callback: function (reswx) {
                                    //统计分享
                                }
                            }
                        });
                    }
                });
            });
        },
        dbxyjs: function (omuid, uid) {
            var data = {uid: uid, omuid: omuid};
            var events = {
                'click .btm_ct li': funcs.accordion
            };
            $.ajax('/Api/Shop/GetClublistinfo', {data: {uid: uid, ouid: omuid}}).done(function (res) {
                if (res.status !== 1) {
                    base.ui.alert(res.msg);
                    return false;
                }
                data.list = res.info;
                data.title = data.list.name;
                data.imglist = [];
                if (data.list.images) {
                    data.imglist = data.list.images.split(';');
                } else {
                    if (data.list.image1) data.imglist.push(data.list.image1);
                    if (data.list.image2) data.imglist.push(data.list.image2);
                    if (data.list.image3) data.imglist.push(data.list.image3);
                    if (data.list.image4) data.imglist.push(data.list.image4);
                    if (data.list.image5) data.imglist.push(data.list.image5);
                    if (data.list.image6) data.imglist.push(data.list.image6);
                }
                data.addr = data.list.address;
                data.call = data.list.phone;
                data.spread = data.list.spread;
                data.loc = [];
                if (data.list.map != '') {
                    data.loc = data.list.map.split(',');
                }
                data.lat = data.loc[1];
                data.lon = data.loc[0];
                data.name = data.list.name;
                view('dbxyjs', data, events).done(function (nowview) {
                    $('.base-ui-wait1').hide();
                    require(['Swiper'], function (Swiper) {
                        new Swiper('.swiper-container', {
                            pagination: '.dian',
                            autoplay: 3000,
                            autoplayDisableOnInteraction: false,
                            paginationClickable: true
                        });
                    });
                })
            });
        },
        dbdstd: function (omuid, uid) {
            var data = {uid: uid, omuid: omuid};
            var events = {};
            $.ajax('/Api/Shop/Getteamlist', {data: {ouid: omuid, uid: uid}}).done(function (res) {
                if (res.status !== 1) {
                    base.ui.alert(res.msg);
                    return false;
                }
                if (res.info.list.length !== 0) {
                    data.zongtch = res.info.list;
                    data.tchone = res.info.list[0];
                    data.moretch = res.info.list.slice(1);
                } else {
                    data.zongtch = null;
                    data.tchone = null;
                    data.moretch = null;
                }
                view('dbdstd', data, events).done(function (nowview) {
                    $('.base-ui-wait1').hide();
                })
            })
        },
        dbzxtg: function (omuid, uid) {
            var data = {uid: uid, omuid: omuid};
            var events = {};
            $.ajax('/Api/Shop/GetClublistinfo', {data: {uid: uid, ouid: omuid}}).done(function (res) {
                if (res.status !== 1) {
                    base.ui.alert(res.msg);
                    return false;
                }
                data.list = res.info;
                data.photo = res.info.photo ? res.info.photo : null;
                data.call = data.list.phone;
                data.spread = data.list.spread;

                view('dbzxtg', data, events).done(function (nowview) {
                    $('.base-ui-wait1').hide();
                })
            });
        },
        dbzxkc: function (omuid, uid) {
            var data = {uid: uid, omuid: omuid};
            var events = {
                'click .bord': funcs.linktel
            };
            $.ajax('/Api/Shop/GetteamClassByid', {data: {uid: omuid}}).done(function (res) {
                if (res.status !== 1) {
                    base.ui.alert(res.msg);
                    return false;
                }
                if (res.info.list.length != 0) {
                    data.classlist = res.info.list;
                } else {
                    data.classlist = null;
                }
                view('dbzxkc', data, events).done(function (nowview) {
                    $('.base-ui-wait1').hide();
                    $(window).unbind("scroll");
                })
            })
        },
        dbxyhd: function (omuid, uid) {
            var data = {uid: uid, omuid: omuid};
            var events = {};
            $.ajax('/Api/Shop/Getuserinteractionlist', {
                data: {
                    uid: uid,
                    ouid: omuid,
                    pageindex: 1,
                    pagesize: 20
                }
            }).done(function (res) {
                if (res.status !== 1) {
                    base.ui.alert(res.msg);
                    return false;
                }
                if (res.info.list.length !== 0) {
                    data.member = res.info.list;
                } else {
                    data.member = null;
                }
                view('dbxyhd', data, events).done(function (nowview) {
                    $('.base-ui-wait1').hide();
                    if ($('.member').height() < 4800) {
                        $('.sljz').hide();
                    }
                    var index_pageindex = 1;
                    var ajaxState = true;
                    var query = _(function () {
                        if (!ajaxState) return false;
                        if ($(document).height() - $(window).height() - $(document).scrollTop() <= 300) {
                            $('.sljz').text('加载中...');
                            index_pageindex++;
                            $.ajax('/Api/Shop/Getuserinteractionlist', {
                                data: {
                                    uid: uid,
                                    ouid: omuid,
                                    pageindex: index_pageindex,
                                    pagesize: 20
                                }
                            }).done(function (res) {
                                if (res.info.list.length) {
                                    var list = res.info.list;
                                    var aelems = [];
                                    setTimeout(
                                        function () {
                                            var str = '';
                                            for (var i = 0, len = list.length; i < len; i++) {
                                                str = '<div class="back"><div class="top"><a href="http://my.bobo.so/hair/index.html#detailhair/' + list[i].uid + '">'
                                                + '<img src="http://img.hairbobo.com/' + list[i].logo + '" alt=""/></a><span>' + list[i].name + '</span><span class="data">' + list[i].cdate + '</span>'
                                                + '</div><div class="mid">' + list[i].content + '</div><div class="btm"><span class="hf">学院回复：</span>'
                                                + '<p class="huifu">' + list[i].brecontent + '</p></div></div>';
                                                aelems.push(str)
                                            }
                                            $(".member").append(aelems.join(''));
                                            $('.sljz').text('上拉显示更多');
                                        }, 500);
                                } else {
                                    $('.sljz').text('没有更多了...');
                                    ajaxState = false;
                                    return false;
                                }
                            });
                        }
                    }).throttle(500);
                    $(window).unbind("scroll").on('scroll', function () {
                        if ($(document).height() >= 4800) {
                            query();
                        }
                    });
                })
            })
        },
        search: function (uid, fuid) {
            //去掉没用的参数
            if (location.search.indexOf('from=') !== -1) {
                location.replace(location.origin + location.pathname + location.hash);
            }
            var mdate = new Date();
            var mdates = mdate.getFullYear() + '-' + (mdate.getMonth() + 1) + '-' + mdate.getDate();
            var data = {uid: uid, fuid: fuid};
            var events = {
                'click #mzkc li a': funcs.searchtype,
                'click .menu a': funcs.menuCtrl1,
                'click .type-list li': funcs.showFilter,
                'click .option-list li': funcs.selectFilter,
                'click .repeat-type': funcs.repeatType1,
                'click .ddjl': funcs.linktel
            };
            $.when(
                $.ajax('/Api/Shop/GetShoptype'),
                $.ajax('/API/Shop/GetShopClassweek', {data: {date: mdates}}),
                $.ajax('/Api/Shop/GetClublistinfo', {data: {uid: uid}})
            ).done(function (type, classweek, listinfo) {
                    type = type[0];
                    classweek = classweek[0];
                    listinfo = listinfo[0];
                    data.cw = classweek.info;
                    data.classtype = type.info;
                    data.classtype.unshift({
                        "key": "month",
                        "name": "月份",
                        "list": [
                            {
                                "id": "-1", "val": "全部"
                            },
                            {
                                "id": "1", "val": "1月"
                            },
                            {
                                "id": "2", "val": "2月"
                            },
                            {
                                "id": "3", "val": "3月"
                            },
                            {
                                "id": "4", "val": "4月"
                            },
                            {
                                "id": "5", "val": "5月"
                            },
                            {
                                "id": "6", "val": "6月"
                            },
                            {
                                "id": "7", "val": "7月"
                            },
                            {
                                "id": "8", "val": "8月"
                            },
                            {
                                "id": "9", "val": "9月"
                            },
                            {
                                "id": "10", "val": "10月"
                            },
                            {
                                "id": "11", "val": "11月"
                            },
                            {
                                "id": "12", "val": "12月"
                            }
                        ]
                    });
                    data.filter = {
                        pageindex: 1,
                        pagesize: 100,
                        oederby: -1
                    };
                    data.list = listinfo.info.list;
                    data.title = '波波网超级课程表';
                    data.biglist = [];
                    data.smmlist = [];
                    data.smlist = [];
                    data.zuixiao = [];

                    for (var i = 0; i < data.list.length; i++) {
                        //console.log( JSON.stringify(data.list[i]));
                        data.list[i].stringvalue = JSON.stringify(data.list[i]);
                        if (data.list[i].recommend == 2) {
                            data.biglist.push(data.list[i]);
                        } else if (data.list[i].recommend == 1) {
                            data.smlist.push(data.list[i]);
                        } else {
                            data.zuixiao.push(data.list[i]);
                            if (!data.zuixiao.length) {
                                data.zuixiao = null;
                            }
                        }
                    }
                    view('search', data, events).done(function (nowview) {
                        $('.base-ui-wait1').hide();
                        ckb.init($('.kcb_pop'));
                        var height = $('.kcb_down ul').height();
                        $('.kcb_down li').height(height);
                        base.tool.cookie.remove('result');
                        base.tool.cookie.remove('date');
                        base.tool.cookie.remove('type');
                        require(['Swiper'], function (Swiper) {
                            var mySwiper = new Swiper('.swiper-container', {
                                paginationClickable: true,
                                autoHeight: true,
                                scrollbarHide: true,
                                onSlideChangeStart: function () {
                                    $(".navbar .current").removeClass('current');
                                    $(".navbar li").eq(mySwiper.activeIndex).addClass('current');
                                }
                            });
                            $('.navbar li').click(function (e) {
                                var self = this;
                                $(self).attr('class', 'current').siblings().removeClass('current');
                                //mySwiper.slideTo(this.dataset.index, 500, false);//切换到第一个slide，速度为1秒
                                mySwiper.slideTo($(self).index(), 500, false);//切换到第一个slide，速度为1秒
                            })
                        });
                        if (fuid) {
                            base.device.isWeixin && wxapi({
                                showmenu: true,
                                share: {
                                    imgUrl: 'http://shop.hairbobo.com/shop/images/kcb.jpg',
                                    link: location.origin + location.pathname + '#search/share/' + fuid,
                                    desc: '中国优质美发学院最新最全课程表，全网超低价格，随时查看报名！',
                                    title: '波波网超级课程表',
                                    callback: function (reswx) {
                                        //统计分享
                                    }
                                }
                            });
                        } else {
                            base.device.isWeixin && wxapi({
                                showmenu: true,
                                share: {
                                    imgUrl: 'http://shop.hairbobo.com/shop/images/kcb.jpg',
                                    link: location.origin + location.pathname + '#search/share',
                                    desc: '中国优质美发学院最新最全课程表，全网超低价格，随时查看报名！',
                                    title: '波波网超级课程表',
                                    callback: function (reswx) {
                                        //统计分享
                                    }
                                }
                            });
                        }
                    })
                });
        },
        classlistf: function (uid, fuid) {
            var data = {uid: uid, fuid: fuid};
            var events = {};
            var ajax;
            var result1 = base.tool.cookie.get('result') ? base.tool.cookie.get('result') : null;
            var date = base.tool.cookie.get('date') ? base.tool.cookie.get('date') : null;
            var type = base.tool.cookie.get('type') ? base.tool.cookie.get('type') : null;
            if (result1) {
                result1 = JSON.parse(result1);
                ajax = $.ajax('/Api/Shop/GetShopClass', {
                    data: result1
                })
            } else if (date && type) {
                ajax = $.ajax('/Api/Shop/GetShopClass',
                    {
                        data: {
                            month: -1,
                            city: -1,
                            type: type,
                            cuid: -1,
                            oederby: -1,
                            pageindex: 1,
                            pagesize: 100,
                            date: date
                        }
                    }
                )
            } else {
                ajax = $.ajax('/Api/Shop/GetShopClass', {
                    data: {
                        month: -1,
                        city: -1,
                        type: -1,
                        cuid: -1,
                        oederby: -1,
                        pageindex: 1,
                        pagesize: 100
                    }
                })
            }
            $.when(
                ajax
            ).done(function (list) {
                    if (list.status !== 1) {
                        base.ui.alert(list.msg);
                        return false;
                    }
                    data.classlist = list.info;
                    view('classlistf', data, events).done(function (nowview) {
                        $('.base-ui-wait1').hide();
                    });
                });
        },
        classlisttop: function (uid, fuid) {
            var data = {uid: uid, fuid: fuid};
            var events = {};
            $.ajax('/api/shop/GetSaleTop10').done(function (list) {
                if (list.status !== 1) {
                    base.ui.alert(list.msg);
                    return false;
                }
                data.classlist = list.info;
                view('classlisttop', data, events).done(function (nowview) {
                    $('.base-ui-wait1').hide();
                });
            });
        },
        detailf: function (id, uid, fuid) {
            if (location.search.indexOf('from=') !== -1) {
                location.replace(location.origin + location.pathname + location.hash);
            }
            var data = {id: id, uid: uid, fuid: fuid};
            var events = {
                'click .detail-top a': funcs.topCtrl,
                'click .selectdate': funcs.showDate,
                'click .confrim-date': funcs.confirmDate,
                'click .gmsl': funcs.selectNumber,
                'click .buy-btn': funcs.submitBuy,
                'click .link-tel': funcs.linktel,
                'click .link-qq': funcs.linkqq
            };
            $.ajax('/api/shop/GetShopClassdetital', {data: {id: id, uid: uid}}).done(function (res) {
                if (res.status !== 1) {
                    base.ui.alert(res.msg, function () {
                        window.history.back();
                    });
                    return false;
                }
                var datearr = res.info.classdate;
                var datasub = res.info.tdate;
                data.detail = res.info;
                var list1 = [' ', '无要求', '小工/助理', '中工/技师', '发型师', '发型总监', '教育导师', '店长/管理层'];
                var list2 = [' ', '无要求', '零基础', '2年以下', '2~4年', '5~7年', '8~10年', '10年以上'];
                var list3 = [' ', '无要求', '沙宣剪裁课程', '汤尼盖剪裁课程', '学过方圆三角'];
                data.people = res.info.people;
                if (data.people.indexOf(';') !== -1) {
                    var peplist = data.people.split(';');
                    data.peo = '#职称：' + list1[peplist[0]] + '；#经验：' + list2[peplist[1]] + '；<br/>#要求基础课程：' + list3[peplist[2]] + '；';
                } else {
                    data.peo = data.people;
                }
                data.clubid = res.info.uid;
                data.link = location.origin + location.pathname + '#detail/' + id + '/share';
                view('detailf', data, events).done(function () {
                    $('.base-ui-wait1').hide();
                    $('.dt_width').width($('.rgt_div').width() + 75);
                    require(['Swiper'], function (Swiper) {
                        new Swiper('.swiper-container', {
                            pagination: '.swiper-pagination',
                            autoplay: 3000,
                            autoplayDisableOnInteraction: false,
                            paginationClickable: true
                        });
                    });
                    //初始化日历
                    calendar.init($('#date'), datearr, datasub);
                });
                //微信分享
                base.device.isWeixin && wxapi({
                    showmenu: true,
                    share: {
                        imgUrl: 'http://img.hairbobo.com' + res.info.image,
                        link: location.origin + location.pathname + '#detailf/' + id + '/share/' + fuid,
                        desc: '国内优质美发学院的最优惠课程，只在波波网！~',
                        title: '我觉得' + res.info.title + '非常赞，感兴趣的去看看哦~',
                        callback: function (reswx) {
                            //统计分享
                        }
                    }
                });
            })

        },
        accountsf: function (id, uid, fuid, openid) {

            //微信授权
            if (!openid && base.device.isWeixin) {
                location.href = location.origin + '/test/GetOpenID/?htmlurl=accountsf/' + id + '/' + uid + '/' + fuid;
            }


            //商品数量
            var onum = parseInt(base.tool.cookie.get('onum'));
            var odate = base.tool.cookie.get('odate');
            var data = {id: id, uid: uid, num: onum, date: odate, openid: openid, fuid: fuid};
            var events = {
                'click .acc-btn': funcs.accOrder,
                'click .pay button': funcs.paytp
            };
            $.when(
                $.ajax('/api/shop/GetShopClassdetital', {data: {id: id}}),
                $.ajax('/api/shop/GetOrderAddress', {data: {uid: uid}})
            ).done(function (detail, address) {
                    detail = detail[0];
                    address = address[0];
                    if (detail.status !== 1) {
                        base.ui.alert(detail.msg);
                        return false;
                    }

                    data.paytype = base.device.isWeixin ? 2 : 1;
                    data.detail = detail.info;
                    data.address = address.status !== 1 ? {} : address.info;
                    view('accountsf', data, events).done(function () {
                        $('.base-ui-wait1').hide();
                        document.body.addEventListener('touchstart', function () {
                        });
                    });
                });
        }
    };
    return routes;
});