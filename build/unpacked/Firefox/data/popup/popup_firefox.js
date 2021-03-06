var detail_url_extern = 'https://www.lobbyradar.de/entity/';
var current_Taburl = false;

self.port.on('currentTabInfo',function(tabData){
    current_Taburl = false;
    $('.dynamic').hide();
    if( !tabData || !tabData.value ){
        $('#plugin_disabled').show();
        return;
    };
    var info = tabData.value;
    var tab = tabData.tab;
    current_Taburl = tab.url;

    if( info.stage == 'search' ) {
        $('#plugin_working').show();
    } else if ( info.stage == 'mark' ) {
        $('#plugin_marking').show();
    } else {
        if( info.disabled ) {
            $('#plugin_disabled').show();
            if(info.can_enable) {
                $('#btn_enable_for_site').show();
            }
        } else {
            $('#plugin_disabled').hide();
            if(info.can_disable){
                $('#btn_disable_for_site').show();
            }
           if( info.hits && info.hits.length ) {
                $('#hits').show();
                $('#num_hits').text(info.hits.length);
                $('#searchtime').text((info.searchtime/1000).toPrecision(2));
                $('#hitlist').empty();
                $.each(info.hits,function(id,person){
                    $('#hitlist').append('<li class="lobbyradar_item"><a data-uid="'+person.uid+'" href="#">'+person.name+'</a></li>');
                });
                $('.lobbyradar_item').click(function(){
                    var data = {url: detail_url_extern+$('a',this).attr('data-uid')};
                    self.port.emit('openTab',data);
                });

            } else {
                $('#nohits').show();
            }
        }
    }
});

$(function(){
    $('#btn_settings').click(function(){
        self.port.emit('openPrefs');
    });
    $('#btn_enable_for_site').click(function(){
        self.port.emit('addWhitelist',current_Taburl);
        $('.dynamic').hide();
        $('#reloadhint').show();
    });
    $('#btn_disable_for_site').click(function(){
        self.port.emit('removeWhitelist',current_Taburl);
        $('.dynamic').hide();
        $('#reloadhint').show();
    });
})
