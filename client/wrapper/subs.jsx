import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

class SubsComponent extends Component {
  render() {
    if (this.props.subsIsReady) {
      return this.props.children;
    } else {
      return (
        <div className="row">
          <div className="col-xs-12">
            <Loading text="Loading subscription..." />
          </div>
        </div>
      );
    }
  }
}

SubsWrapper = createContainer(() => {
  P.setCurrentCloneId();
  const handleSubs = Meteor.subscribe("currentCloneSubs", Session.get("currentCloneId"));
  return {
    subsIsReady: handleSubs.ready()
  };
}, SubsComponent);

// SubsWrapper = React.createClass({
//   mixins: [ReactMeteorData],
//   getMeteorData() {
//     P.setCurrentCloneId();
//     const handleSubs = Meteor.subscribe("currentCloneSubs", Session.get("currentCloneId"));
//     return {
//       subsIsReady: handleSubs.ready()
//     };
//   },
//   render() {
//     if (this.data.subsIsReady) {
//       return this.props.children;
//     } else {
//       return (
//         <div className="row">
//           <div className="col-xs-12">
//             <Loading text="Loading subscription..." />
//           </div>
//         </div>
//       );
//     }
//   }
// })
