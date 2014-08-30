var NewRoute = Ember.Route.extend({
  model: function(params) {
    if ($.isEmptyObject(params.queryParams)) {
        return [];
    } else {
        var base_url = 'https://api.flickr.com/services/rest/?',
            secret = 'f4006632147d0922',
            api_key = '854f6c3ae2c026056f93eb20036ce07c',
            perms = 'read',
            query = params.queryParams.query,
            url = base_url + 'method=flickr.photos.search&api_key=' + api_key + '&tags=' +  query.replace(' ', '+')  +'&safe_search=1&per_page=40&format=json&jsoncallback=?';

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
