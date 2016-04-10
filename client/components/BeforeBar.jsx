import React, { Component } from 'react';
import moment from 'moment';

class BeforeBarComponent extends Component {
  render() {
    const before = Number(this.props.before);
    return (
      <ul className="list-group">
        <li className="list-group-item">
          <span>View from {moment(before).format('LL')}</span>
          <a href="/" className="pull-xs-right">Go to now</a>
        </li>
      </ul>
    );
  }
}

BeforeBar = BeforeBarComponent;
