import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

class AppComponent extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <Navigation status={this.props.status} isUser={this.props.isUser} />
          </div>
        </div>
        {this.props.isUser ? this.props.yield : <Demo loggingIn={this.props.loggingIn} />}
      </div>
    );
  }
}

App = createContainer(() => {
  return {
    status: Meteor.status().status,
    loggingIn: Meteor.loggingIn(),
    isUser: !!Meteor.user(),
  };
}, AppComponent);

// App = React.createClass({
//   mixins: [ReactMeteorData],
//   getMeteorData() {
//     return {
//       status: Meteor.status().status,
//       loggingIn: Meteor.loggingIn(),
//       isUser: !!Meteor.user(),
//     };
//   },
//   render () {
//     return (
//       <div className="container">
//         <div className="row">
//           <div className="col-xs-12">
//             <Navigation status={this.data.status} isUser={this.data.isUser} />
//           </div>
//         </div>
//         {this.data.isUser ? this.props.yield : <Demo loggingIn={this.data.loggingIn} />}
//       </div>
//     );
//   }
// });
