var NewRoute = Ember.Route.extend({
  model: function(params) {
    if ($.isEmptyObject(params.queryParams)) {
        return [];
    } else {
        var key_word = [];
        $.each(params.queryParams, function (j, letter) {
                if (letter === ' ') { letter = '+'; }
                key_word.push(letter);
        });
        var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=4ef2fe2affcdd6e13218f5ddd0e2500d&tags=' +  key_word.join('') +'&safe_search=1&per_page=20&format=json&jsoncallback=?';
        return Ember.$.getJSON(url).then(function(data) {
            var result = [], src;
            $.each(data.photos.photo, function(i,item){
                src = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_m.jpg";
                result.push(src);
            });
            return result;
        });
    }
  }
});

export default NewRoute;
