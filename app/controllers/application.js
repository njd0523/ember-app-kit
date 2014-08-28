export default Ember.Controller.extend({
  queryParams: ['query'],
  query: null,
  
  queryField: Ember.computed.oneWay('query'),
  actions: {
    search: function() {
        if (!this.get('queryField') && $('form .error').length === 0) {
            $('form').append("<span class='error'>You must have the search key word !!</span>");
        } else {
            //this.set('query', this.get('queryField'));
            this.transitionToRoute('new', {queryParams: this.get('queryField')});
        }
    }
  }
});
