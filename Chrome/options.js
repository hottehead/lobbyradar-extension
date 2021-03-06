// based on https://developer.chrome.com/extensions/options

function get_preferences() {
    var preferences = {};
    [].slice.call(document.querySelectorAll('.form-control')).forEach(function(element) {
        switch ( element.nodeName ) {
        case 'INPUT':
            switch ( element.type ) {
                case 'checkbox':
                    if ( element.checked ) {
                        preferences[element.id] =
                            element.hasAttribute('data-on') ? parseInt(element.getAttribute('data-on'),10) : true;
                    } else {
                        preferences[element.id] =
                            element.hasAttribute('data-off') ? parseInt(element.getAttribute('data-off'),10) : false;
                    }
                    break;
                case 'radio' : if ( element.checked ) preferences[element.name] = element.value; break;
                case 'number': preferences[element.id] = parseInt(element.value,10); break;
                case 'text'  : preferences[element.id] = element.value; break;
            }
            break;
        case 'SELECT': preferences[element.id] = element.value; break;
        case 'TEXTAREA': preferences[element.id] = element.value.split("\n").join(","); break;
        }
    });
    return preferences;
}

document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(get_preferences(), function(preferences) {
        [].slice.call(document.querySelectorAll('.form-control')).forEach(function(element) {
            switch ( element.nodeName ) {
            case 'INPUT':
                switch ( element.type ) {
                case 'checkbox':
                    element.checked =
                        preferences[element.id] == ( element.hasAttribute('data-on') ? element.getAttribute('data-on') : true );
                    break;
                case 'radio' : element.checked = preferences[element.name] == element.value; break;
                case 'number': element.value = preferences[element.id]; break;
                case 'text'  : element.value = preferences[element.id]; break;
                }
                break;
            case 'SELECT': element.value = preferences[element.id]; break;
            case 'TEXTAREA': element.value = preferences[element.id].split(',').join("\n"); break;
            }
        });
    });
});

function storePreferences() {
    chrome.storage.local.set(get_preferences(), function() {
        chrome.runtime.sendMessage({requestType:'optionsChanged'});
    });
}
document.addEventListener('click', storePreferences);
document.addEventListener('input', storePreferences);

$(function(){
    moment.locale('de');
    chrome.storage.local.get('last_update',function(last_update){
        var string_last_update = "noch nie.";
        if(last_update.last_update){
            string_last_update = moment(last_update.last_update).calendar();
        }
        $('#updateinterval_help').append('<br/>Letzte Aktualisierung: '+string_last_update);
    });
});
