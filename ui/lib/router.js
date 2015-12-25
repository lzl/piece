FlowRouter.route('/', {
  name: 'piece',
  action: function() {
    ReactLayout.render(App);
  }
});

FlowRouter.route('/dashboard', {
  name: 'dashboard',
  action: function() {
    ReactLayout.render(App);
  }
});
