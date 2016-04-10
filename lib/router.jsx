import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

FlowRouter.route('/', {
  name: 'main',
  action(params, queryParams) {
    mount(App, {yield: <Main before={queryParams.before} />});
  }
});

FlowRouter.route('/reader', {
  name: 'reader',
  action(params, queryParams) {
    mount(App, {yield: <Reader before={queryParams.before} />});
  }
});

FlowRouter.route('/dashboard', {
  name: 'dashboard',
  action() {
    mount(App, {yield: <Dashboard />});
  }
});

FlowRouter.route('/follow', {
  name: 'follow',
  action(params, queryParams) {
    mount(App, {
      yield: <Follow hostname={queryParams.hostname} userId={queryParams.userId} />
    });
  }
});

FlowRouter.route('/c/:cloneId', {
  name: 'profile',
  action(params, queryParams) {
    mount(Profile, {
      clone: <ProfileCloneWrapper cloneId={params.cloneId} />,
      pieces: <ProfilePiecesWrapper cloneId={params.cloneId} />
    });
  }
});

FlowRouter.route('/reset-password', {
  name: 'reset-password',
  action(params, queryParams) {
    mount(ResetPasswordBox);
  }
});
