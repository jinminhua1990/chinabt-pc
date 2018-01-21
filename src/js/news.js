(function (exports, $, base) {
    var origin = base.origin;
    var util = base.util;

    //新闻feed流
    (function () {
        var $wrap = $('#feed');
        var temp = {
            //卡片模板
            item: '' +
            '<li class="feed-card" data-type="feed_card" data-index="@@=it.id$$">\n' +
            '   <a class="img" href="@@=it.url$$"><img src="@@=it.thumb$$" alt="@@=it.title$$"></a>\n' +
            '   <div class="txt">\n' +
            '       <h3 class="title"><a href="@@=it.url$$" target="_blank">@@=it.title$$</a></h3>\n' +
            '       <p class="desc">@@=it.description$$</p>\n' +
            '       <div class="info">\n' +
            // '           <span class="author">@@=it.source$$</span>\n' +
            '           <span class="time">@@=it.formattedTime$$</span>\n' +
            '       </div>\n' +
            '   </div>\n' +
            '</li>'
        };
        var state = {
            page: 1,
            isLoading: false,
            dataSource: []
        };
        var $loader = $wrap.find('[data-type="feed_loader"]');
        var $listWrap = $wrap.find('[data-type="feed_list"]');


        function updateLoader() {
            if (state.isLoading) {
                $loader.text('加载中...').addClass('loading');
            }
            else {
                $loader.text('加载更多').removeClass('loading');
            }
        }

        function updateListUI() {
            var _html = [];
            var tempFn = doT.template(temp.item);
            state.dataSource.forEach(function (itemData, index) {
                var _renderData = $.extend({},itemData);
                _renderData.formattedTime = util.howLongAgo(itemData.update_time, 24);

                _html.push(tempFn(_renderData));
            });
            $listWrap.append(_html.join(''));
        }

        function loadList() {
            if (state.isLoading) {
                return;
            }
            state.isLoading = true;
            $loader && updateLoader();

            util.get({
                key: 'news/zxsylb.html',
                data: {
                    page: state.page
                },
                success: function (d) {
                    var data = d.data;

                    if (data instanceof Array && data.length) {
                        state.dataSource = data;
                        updateListUI();
                    }

                    state.isLoading = false;

                    if(state.page === 1){
                        state.lastPage = d.last_page;
                        state.total = d.total;
                        bindLoader();
                    }

                    if(state.page === state.lastPage){
                        destroyLoader();
                    }
                    else{
                        updateLoader();
                    }
                }
            });
        }

        function bindLoader() {
            $loader.on('click', function (e) {
                state.page += 1;
                loadList();
            });
        }

        function destroyLoader() {
            $loader.off('click');
            $loader.text('没有更多了');
            $loader.addClass('disabled');
            $loader = null;
        }

        loadList();
    })();

})(window, jQuery, window.BASE);