var IndexController = Ember.ArrayController.extend({
    queryParams: ['query'],
    query: null,
    queryField: Ember.computed.oneWay('query'),
    actions: {
        search: function () {
            if (!this.get('queryField') && $('form .alert').length === 0) {
                $('form').append('<div class="alert alert-danger" role="alert"><span class="alert-link">You must have the search key word !!</span></div>');
            } else {
                var self = this,
                    request,
                    secret = 'f4006632147d0922',
                    api_key = '854f6c3ae2c026056f93eb20036ce07c',
                    api_sig = $.md5('f4006632147d0922api_key854f6c3ae2c026056f93eb20036ce07cformatjsonmethodflickr.auth.getFrob'),
                    perms = 'read',
                    basic_url = 'https://api.flickr.com/services/rest/?';
                if (this.get('auth_me')) {
                    request = $.ajax({
                        url: basic_url + 'api_key=' + api_key + '&format=json&method=flickr.auth.getFrob&api_sig=' + api_sig,
                        dataType: 'json'
                    });

                    request.complete(function (xhr) {
                        var res = xhr.responseText, time, auth_url, obj, frob;
                        res = res.substring(res.indexOf('"') - 1, res.length - 1);
                        res = JSON.parse(res);

                        if (res.stat === 'ok') {
                            frob = res.frob._content;
                            api_sig = $.md5(secret + 'api_key' + api_key + 'formatjsonfrob' + frob + 'perms' + perms);
                            auth_url = 'http://flickr.com/services/auth/?api_key=' + api_key + '&perms=' + perms + '&api_sig=' + api_sig + '&frob=' + frob + '&format=json';
                            obj = window.open(auth_url, 'popupWindow', 'width=600,height=600,scrollbars=yes');

                            time = setInterval(function () {
                                try {
                                    if (obj.closed) { obj = null; }
                                } catch (e) {
                                    clearInterval(time);
                                    api_sig = $.md5(secret + 'api_key' + api_key + 'formatjsonfrob' + frob + 'methodflickr.auth.getToken');
                                    request = $.ajax({
                                        url: basic_url + 'method=flickr.auth.getToken&api_key=' + api_key + '&api_sig=' + api_sig + '&format=json&frob=' + frob
                                    });
                                    request.complete(function (xhr) {
                                        res = xhr.responseText;
                                        res = res.substring(res.indexOf('"') - 1, res.length - 1);
                                        res = JSON.parse(res);
                                        if (res.stat === 'ok') {
                                            self.transitionToRoute('new', {queryParams: { query : self.get('queryField')} });
                                        } else {
                                            Ember.Logger.log(res.message);
                                            if ($('form .alert').length > 0) { $('.alert').remove(); }
                                            $('form').append('<div class="alert alert-danger" role="alert"><span class="alert-link">Oops! Something went wrong: ' + res.message + '</span></div>');
                                            return [];
                                            //self.transitionToRoute('new', {queryParams: { query : self.get('queryField')} });
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
export default IndexController;
