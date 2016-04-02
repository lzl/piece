import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

class AddressesComponent extends Component {
  render() {
    if (this.props.addressesIsReady) {
      return this.props.children;
    } else {
      return (
        <div className="row">
          <div className="col-xs-12">
            <Loading text="Loading addresses..." />
          </div>
        </div>
      );
    }
  }
}

AddressesWrapper = createContainer(() => {
  const subs = Subs.find({}, {fields: {userId: 1}}).fetch();
  const ids = _.pluck(subs, 'userId');
  const handleAddresses = Meteor.subscribe("multiAddressesByIds", ids);
  return {
    addressesIsReady: handleAddresses.ready(),
  };
}, AddressesComponent);

// AddressesWrapper = React.createClass({
//   mixins: [ReactMeteorData],
//   getMeteorData() {
//     const subs = Subs.find({}, {fields: {userId: 1}}).fetch();
//     const ids = _.pluck(subs, 'userId');
//     const handleAddresses = Meteor.subscribe("multiAddressesByIds", ids);
//     return {
//       addressesIsReady: handleAddresses.ready(),
//     };
//   },
//   render() {
//     if (this.data.addressesIsReady) {
//       return this.props.children;
//     } else {
//       return (
//         <div className="row">
//           <div className="col-xs-12">
//             <Loading text="Loading addresses..." />
//           </div>
//         </div>
//       );
//     }
//   }
// })
