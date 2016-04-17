import React, { Component } from 'react';
import moment from 'moment';

class BeforeBarComponent extends Component {
  render() {
    const before = Number(this.props.before);

    const currentRouteName = FlowRouter.getRouteName();
    const routeNames = {
      'main': '/',
      'reader': '/reader'
    };
    const url = routeNames[currentRouteName] || '/';

    return (
      <ul className="list-group br-inline">
        <li className="list-group-item">
          <span>View from {moment(before).format('LL')}</span>
          <a href={url} className="pull-xs-right">Back to now</a>
        </li>
      </ul>
    );
  }
}

BeforeBar = BeforeBarComponent;
