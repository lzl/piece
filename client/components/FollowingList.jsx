import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

class FollowingListComponent extends Component {
  render() {
    return (
      <ul id="following" className={P.isActiveListGroup('following')}>
        {this.props.addresses.map((address) => <FollowingItem key={address._id} address={address} />)}
      </ul>
    );
  }
}

FollowingList = createContainer(() => {
  return {
    addresses: Addresses.find({}, {sort: {updatedAt: -1}}).fetch(),
  }
}, FollowingListComponent);

// FollowingList = React.createClass({
//   mixins: [ReactMeteorData],
//   getMeteorData() {
//     return {
//       addresses: Addresses.find({}, {sort: {updatedAt: -1}}).fetch(),
//     }
//   },
//
//   render() {
//     return (
//       <ul id="following" className={P.isActiveListGroup('following')}>
//         {this.data.addresses.map((address) => <FollowingItem key={address._id} address={address} />)}
//       </ul>
//     );
//   }
// });

const FollowingItem = ({address}) =>
  <li className="list-group-item">
    <ItemButton username={address.username} hostname={address.hostname} userId={address.userId} />
    <span title={address.userId}>{address.username ? address.username : '...'}</span>
    <small className="text-muted">
      {address.updatedAt ? <span title={P.publishedAt(address.updatedAt)}> · {P.updateRate(address.updatedAt)}</span> : ''}
      {P.showHostname(address.hostname) ? <span> · {address.hostname}</span> : ''}
    </small>
  </li>
FollowingItem.displayName = 'FollowingItem';

const ItemButton = React.createClass({
  render() {
    return (
      <div className="btn-group btn-group-sm pull-xs-right btn-following-item" role="group" aria-label="Item button">
        <button type="button" className="btn btn-secondary" onClick={this.handlePreview}>Preview</button>
        <button type="button" className="btn btn-danger" onClick={this.handleUnfollow}>Unfollow</button>
      </div>
    );
  },
  handlePreview(event) {
    event.preventDefault();
    const hostname = this.props.hostname;
    const userId = this.props.userId;
    FlowRouter.go(`/follow?hostname=${hostname}&userId=${userId}`);
  },
  handleUnfollow(event) {
    event.preventDefault();
    if (confirm(`Do you really want to unfollow ${this.props.username}?`)) {
      const hostname = this.props.hostname;
      const userId = this.props.userId;
      const cloneId = Session.get("currentCloneId");
      Meteor.call('removeSubByClone', hostname, userId, cloneId, (error, result) => {
        if (error) {
          alert(error.reason);
        }
      });
    }
  }
});
