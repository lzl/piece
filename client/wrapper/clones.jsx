import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

class ClonesComponent extends Component {
  render() {
    if (this.props.clonesIsReady) {
      return this.props.children;
    } else {
      return (
        <div className="row">
          <div className="col-xs-12">
            <Loading text="Loading clones..." />
          </div>
        </div>
      );
    }
  }
}

ClonesWrapper = createContainer(() => {
  const handleClones = Meteor.subscribe("currentUserClones");
  return {
    clonesIsReady: handleClones.ready()
  };
}, ClonesComponent);

// ClonesWrapper = React.createClass({
//   mixins: [ReactMeteorData],
//   getMeteorData() {
//     const handleClones = Meteor.subscribe("currentUserClones");
//     return {
//       clonesIsReady: handleClones.ready()
//     };
//   },
//   render() {
//     if (this.data.clonesIsReady) {
//       return this.props.children;
//     } else {
//       return (
//         <div className="row">
//           <div className="col-xs-12">
//             <Loading text="Loading clones..." />
//           </div>
//         </div>
//       );
//     }
//   }
// })
