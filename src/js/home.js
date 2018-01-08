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
(function ($, exports) {
    var ORIGIN = 'http://47.104.151.95';
    var base = (function () {
        return {
            get: function (cfg) {
                $.ajax({
                    url: ORIGIN + '/block/' + cfg.key,
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
    })();

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
            base.get({
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
        var temp = {
            listItem: '<li class="d-item"><a class="d-link" href="#part_@@=it.name$$">@@=it.title$$</a></li>'
        };

        var dropdownList = wrap.find('[data-type="dropdown_list"]');
        var btnToggleShow = wrap.find('[data-type="btn_toggle"]');

        function rendeList(data) {
            var _html = [];
            var tempFn = doT.template(temp.listItem);
            $(data).each(function (_, item) {
                _html.push(tempFn(item));
            });
            dropdownList.html(_html.join(''));
        }

        function init() {
            base.eventDelegator.on('onchanneldataready', function (e) {
                rendeList(Array.prototype.slice.call(arguments, 1));
            });
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
            item: '<li class="item"><a class="link" href="@@=it.title$$" target="_blank">@@=it.title$$</a></li>'
        };
        var listWrap = wrap.find('[data-type="list"]');


        function init() {
            base.get({
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

    //类别
    (function () {
        var wrap = $('#main');
        var temp = {
            //横切基础模板
            base: '' +
            '    <div class="m-part" id="part_@@=it.name$$">\n' +
            '        <div class="m-head">\n' +
            '            <h2 class="m-title">\n' +
            '                <a class="m-link @@=it.name$$-icon">@@=it.title$$</a>\n' +
            '            </h2>\n' +
            '        </div>\n' +
            '        <div class="m-body">\n' +
            '            <ul class="c-list" data-type="list_wrap"></ul>\n' +
            '        </div>\n' +
            '    </div>',
            //卡片模板
            item: '' +
            '    <li class="c-item">\n' +
            '        <a class="c-link" href="@@=it.eb_url$$" target="_blank">\n' +
            '            <img class="c-pic" src="@@=it.thumb$$">\n' +
            '            <strong class="c-title">@@=it.title$$</strong>\n' +
            '            <p class="c-desc">@@=it.description$$</p>\n' +
            '        </a>\n' +
            '    </li>\n'
        };

        function init() {
            base.get({
                key: 'content/index/channelall',
                data: {
                    id: 10
                },
                success: function (data) {
                    if (data && data instanceof Array && data.length) {
                        render(data);
                        base.eventDelegator.trigger('onchanneldataready', data);
                    }
                    else {
                        window.confirm('网络好像不给力呢，刷新一下？') && location.reload(true);
                    }
                }
            });
        }

        function render(list) {
            $(list).each(function (_, partData) {
                partData.name = partData.name.replace(/\s+/g, '');
                var partHTML = doT.template(temp.base)(partData);
                var itemListData = partData.data;
                //先把横切塞进去，再拼具体的数据
                var listWrap = $(partHTML).appendTo(wrap).find('[data-type="list_wrap"]');
                var listHTML = [];

                //如果具体数据存在，则渲染
                if (itemListData && itemListData instanceof Array && itemListData.length) {
                    $(itemListData).each(function (__, itemData) {
                        listHTML.push(doT.template(temp.item)(itemData));
                    });
                    listWrap.html(listHTML.join(''));

                }
                else {
                    listWrap.parent().html('<div class="no-content">— 敬请期待 —</div>');
                }
            });
        }

        init();
    })();


})(jQuery, window);