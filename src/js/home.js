(function(exports, $, base){
  var origin = base.origin;
  var util = base.util;
  
  //类别
  (function(){
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
      '        <a class="c-link" href="@@=it.eb_url$$" target="_blank" ' +
      'onclick="window._czc && _czc.push([\'_trackPageview\',\'/\',\'http://@@=it.partTitle$$_@@=it.title$$\'])">\n' +
      '            <img     class="c-pic" src="@@=it.thumb$$">\n' +
      '            <strong class="c-title">@@=it.title$$</strong>\n' +
      '            <p class="c-desc">@@=it.description$$</p>\n' +
      '        </a>\n' +
      '    </li>\n',
    };
    
    function init(){
      util.get({
                 key: 'content/index/channelall',
                 data: {
                   id: 10,
                 },
                 success: function(data){
                   if(data && data instanceof Array && data.length){
                     render(data);
                     util.eventDelegator.trigger('onchanneldataready', data);
                   }
                   else{
                     window.confirm('网络好像不给力呢，刷新一下？') && location.reload(true);
                   }
                 },
               });
    }
    
    function render(list){
      $(list).each(function(_, partData){
        partData.name = partData.name.replace(/\s+/g, '');
        var partHTML = doT.template(temp.base)(partData);
        var itemListData = partData.data;
        //先把横切塞进去，再拼具体的数据
        var listWrap = $(partHTML).appendTo(wrap).find('[data-type="list_wrap"]');
        var listHTML = [];
        var partTitle = partData.title;
        
        //如果具体数据存在，则渲染
        if(itemListData && itemListData instanceof Array && itemListData.length){
          $(itemListData).each(function(__, itemData){
            //横切题目也加进来，用来拼接统计地址的
            itemData.partTitle = partTitle;
            listHTML.push(doT.template(temp.item)(itemData));
          });
          listWrap.html(listHTML.join(''));
          
        }
        else{
          listWrap.parent().html('<div class="no-content">— 敬请期待 —</div>');
        }
      });
    }
    
    init();
  })();
  
  
})(window, jQuery, window.BASE);