import React, { Component } from 'react';

class BeforeBarComponent extends Component {
  render() {
    const before = Number(this.props.before);
    return (
      <ul className="list-group">
        <li className="list-group-item">Before {P.publishedAt(Number(before))}</li>
      </ul>
    );
  }
}

BeforeBar = BeforeBarComponent;
