export default Ember.ArrayController.extend({
  queryParams: ['query'],
  query: null,
  
  queryField: Ember.computed.oneWay('query'),
  actions: {
    search: function() {
        if (!this.get('queryField') && $('form .error').length === 0) {
            $('form').append("<span class='error'>You must have the search key word !!</span>");
        } else {
            //this.set('query', this.get('queryField'));
            var self = this;
            if (this.get('auth_me')) {
                var request,
                    secret = 'f4006632147d0922',
                    api_key = '854f6c3ae2c026056f93eb20036ce07c',
                    api_sig = $.md5('f4006632147d0922api_key854f6c3ae2c026056f93eb20036ce07cformatjsonmethodflickr.auth.getFrob'),
                    perms = 'read',
                    basic_url = 'https://api.flickr.com/services/rest/?';

                request = $.ajax({
                    url: basic_url + 'api_key=' + api_key + '&format=json&method=flickr.auth.getFrob&api_sig=' + api_sig,
                    dataType: "json"
                });

                request.complete(function( jqXHR, textStatus ) {
                    var res = jqXHR.responseText;
                        res = res.substring(res.indexOf('"') - 1, res.length - 1);
                        res = JSON.parse(res);
                    
                    if (res.stat === "ok") {
                        var api_sig = $.md5(secret + 'api_key' + api_key + 'formatjsonfrob' + res.frob._content + 'perms' + perms),
                            auth_url = 'http://flickr.com/services/auth/?api_key=' + api_key + '&perms=' + perms + '&api_sig=' + api_sig + '&frob=' + res.frob._content +'&format=json',
                            obj = window.open(auth_url, "popupWindow", "width=600,height=600,scrollbars=yes");

                        var time = setInterval(function () {
                            try {
                                if(obj.closed) obj = null;
                            } catch (e) {
                                clearInterval(time);
                                api_sig = $.md5(secret + 'api_key' + api_key +'formatjsonfrob' + res.frob._content +'methodflickr.auth.getToken'),
                                request = $.ajax({
                                    url: basic_url + 'method=flickr.auth.getToken&api_key=' + api_key + '&api_sig=' + api_sig + '&format=json&frob=' + res.frob._content
                                });
                                request.complete(function( jqXHR, textStatus ) {
                                    var res = jqXHR.responseText;
                                        res = res.substring(res.indexOf('"') - 1, res.length - 1);
                                        res = JSON.parse(res);
                                    if (res.stat === "ok") {
                                        self.transitionToRoute('new', {queryParams: { query : self.get('queryField')} });
                                    } else {
                                        Ember.Logger.log(res.message);
                                        self.transitionToRoute('new', {queryParams: { query : self.get('queryField')} });
                                    }
                                });

                            }
                        }, 1000);
                    } else {
                        Ember.Logger.log(res.message);
                        return [];
                    }
                });

            } else {
                self.transitionToRoute('new', {queryParams: { query : this.get('queryField'), authorize: this.get('auth_me') } });
            }
        }
    }
  }
});
