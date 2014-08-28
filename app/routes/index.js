export default Ember.Route.extend({
  model: function(params) {
    return ['red', 'yellow', 'blue'];
  }
});
