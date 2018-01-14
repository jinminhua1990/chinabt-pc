(function (exports, $) {
    //doT 配置
    doT.templateSettings = {
        evaluate: /\@\@([\s\S]+?)\$\$/g,
        interpolate: /\@\@=([\s\S]+?)\$\$/g,
        encode: /\@\@!([\s\S]+?)\$\$/g,
        use: /\@\@#([\s\S]+?)\$\$/g,
        define: /\@\@##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\$\$/g,
        conditional: /\@\@\?(\?)?\s*([\s\S]*?)\s*\$\$/g,
        iterate: /\@\@~\s*(?:\$\$|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\$\$)/g,
        varname: 'it',
        strip: true,
        append: true,
        selfcontained: false
    };

    var origin = 'http://47.104.151.95';

    var util = {
        get: function (cfg) {
            $.ajax({
                url: origin + '/block/' + cfg.key,
                dataType: 'jsonp',
                xhrFields: {
                    withCredentials: true
                },
                data: cfg.data,
                success: function (res) {
                    cfg.success(res);
                }
            });
        },
        eventDelegator: $({})
    };

    //热点
    (function () {
        var wrap = $('#hot_news');
        var temp = {
            item: '<li class="h-item"><a class="h-link" href="@@=it.eb_url$$" target="_blank">@@=it.title$$</a></li>'
        };
        var page = 1;

        var defListWrap = wrap.find('[data-type="h_list_def"]');
        var moreListWrap = wrap.find('[data-type="h_list_more"]');
        var btnToggleShow = wrap.find('[data-type="btn_toggle"]');

        function init() {
            util.get({
                key: 'tuijian/topnews-tj.html',
                data: {
                    page: page
                },
                success: function (res) {
                    var data = res.data;

                    if (data && data instanceof Array && data.length) {
                        ++page;
                        renderDef(data.slice(0, 4));

                        if (data.length > 4) {
                            renderMore(data.slice(5));
                            bindMore();
                        }
                        else {
                            btnToggleShow.remove();
                            moreListWrap.remove();
                        }
                    }
                    else {
                        wrap.remove();
                        console.log('topNews 为空');
                    }
                }
            });
        }

        function itemRender(list) {
            var _html = [];
            var tempFn = doT.template(temp.item);
            $(list).each(function (_, item) {
                _html.push(tempFn(item));
            });
            _html.join('');
            return _html;
        }

        function renderDef(list) {
            defListWrap.html(itemRender(list));
        }

        function renderMore(list) {
            moreListWrap.html(itemRender(list));
        }

        function bindMore() {
            btnToggleShow.on('click', function () {
                moreListWrap.toggleClass('show');
                btnToggleShow.toggleClass('active');
            });
            moreListWrap.on('click', function () {
                moreListWrap.removeClass('show');
            });
        }

        init();
    })();

    //导航
    (function () {
        var wrap = $('#top_nav_dropdown');
        var dropdownList = wrap.find('[data-type="dropdown_list"]');
        var btnToggleShow = wrap.find('[data-type="btn_toggle"]');

        function init() {
            btnToggleShow.on('click', function () {
                dropdownList.toggleClass('show');
                btnToggleShow.toggleClass('active');
            });
            dropdownList.on('click', function () {
                dropdownList.removeClass('show');
            });
        }

        init();
    })();

    //推广
    (function () {
        var wrap = $('#promotion');
        var temp = {
            item: '<li class="item"><a class="link" href="@@=it.url$$" target="_blank">@@=it.title$$</a></li>'
        };
        var listWrap = wrap.find('[data-type="list"]');


        function init() {
            util.get({
                key: 'tuijian/hdzq.html',
                success: function (res) {
                    var data = res.data;

                    if (data && data instanceof Array && data.length) {
                        render(data);
                    }
                    else {
                        wrap.remove();
                        console.log('tuijian/hdzq.html 为空');
                    }
                }
            });
        }

        function itemRender(list) {
            var _html = [];
            var tempFn = doT.template(temp.item);
            $(list).each(function (_, item) {
                _html.push(tempFn(item));
            });
            _html.join('');
            return _html;
        }

        function render(list) {
            listWrap.html(itemRender(list));
        }

        init();
    })();

    exports.BASE = {
        origin: origin,
        util: util
    };

})(window, jQuery);