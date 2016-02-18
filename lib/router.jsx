FlowRouter.route('/', {
  name: 'main',
  action(params, queryParams) {
    ReactLayout.render(App, {yield: <Main before={queryParams.before} />});
  }
});

FlowRouter.route('/reader', {
  name: 'reader',
  action(params, queryParams) {
    ReactLayout.render(App, {yield: <Reader before={queryParams.before} />});
  }
});

FlowRouter.route('/dashboard', {
  name: 'dashboard',
  action() {
    ReactLayout.render(App, {yield: <Dashboard />});
  }
});

FlowRouter.route('/follow', {
  name: 'follow',
  action(params, queryParams) {
    ReactLayout.render(App, {
      yield: <Follow hostname={queryParams.hostname} userId={queryParams.userId} />
    });
  }
});

FlowRouter.route('/c/:cloneId', {
  name: 'profile',
  action(params, queryParams) {
    ReactLayout.render(Profile, {
      clone: <ProfileCloneWrapper cloneId={params.cloneId} />,
      pieces: <ProfilePiecesWrapper cloneId={params.cloneId} />
    });
  }
});

FlowRouter.route('/reset-password', {
  name: 'reset-password',
  action(params, queryParams) {
    ReactLayout.render(ResetPasswordBox);
  }
});
