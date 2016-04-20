import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

Profile = ({clone, pieces}) =>
  <div className="container narrow">
    <div className="hr" />
    <div className="row">
      <div className="col-xs-12">
        {clone}
      </div>
    </div>
    <div className="row">
      <div className="col-xs-12">
        {pieces}
      </div>
    </div>
  </div>
Profile.displayName = "Profile";

class ProfileCloneWrapperComponent extends Component {
  render() {
    if (this.props.profileIsReady) {
      return <ProfileClone cloneId={this.props.cloneId} />
    } else {
      return (
        <div>
          <Loading text="Loading profile..." />
          <div className="br" />
        </div>
      );
    }
  }
}

ProfileCloneWrapper = createContainer(({cloneId}) => {
  const handleProfile = Meteor.subscribe("singleCloneProfile", cloneId);
  return {
    profileIsReady: handleProfile.ready()
  };
}, ProfileCloneWrapperComponent);

// ProfileCloneWrapper = React.createClass({
//   mixins: [ReactMeteorData],
//   getMeteorData() {
//     const handleProfile = Meteor.subscribe("singleCloneProfile", this.props.cloneId);
//     return {
//       profileIsReady: handleProfile.ready()
//     };
//   },
//   render() {
//     if (this.data.profileIsReady) {
//       return <ProfileClone cloneId={this.props.cloneId} />
//     } else {
//       return (
//         <div>
//           <Loading text="Loading profile..." />
//           <div className="br" />
//         </div>
//       );
//     }
//   }
// });

class ProfileCloneComponent extends Component {
  render() {
    if (this.props.profile) {
      const {_id, name, updatedAt} = this.props.profile;
      const hostname = P.getHostname();
      const address = P.makeAddress({hostname, userId: _id});
      return (
        <div className="card">
          <div className="card-block">
            {name ? <span title={address}>{name}</span> : ''}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Loading text="No profile found." />
          <div className="br" />
        </div>
      );
    }
  }
}

ProfileClone = createContainer(({cloneId}) => {
  return {
    profile: Clones.findOne({_id: cloneId}),
  };
}, ProfileCloneComponent);

// ProfileClone = React.createClass({
//   mixins: [ReactMeteorData],
//   getMeteorData() {
//     return {
//       profile: Clones.findOne({_id: this.props.cloneId}),
//     };
//   },
//   render () {
//     if (this.data.profile) {
//       const {_id, name, updatedAt} = this.data.profile;
//       const hostname = P.getHostname();
//       const address = P.makeAddress({hostname, userId: _id});
//       return (
//         <div className="card">
//           <div className="card-block">
//             {name ? <span title={address}>{name}</span> : ''}
//           </div>
//         </div>
//       );
//     } else {
//       return (
//         <div>
//           <Loading text="No profile found." />
//           <div className="br" />
//         </div>
//       );
//     }
//   }
// });

class ProfilePiecesWrapperComponent extends Component {
  render() {
    if (this.props.piecesIsReady) {
      return <ProfilePieces cloneId={this.props.cloneId} />;
    } else {
      return <Loading text="Loading pieces..." />;
    }
  }
}

ProfilePiecesWrapper = createContainer(({cloneId}) => {
  const handlePieces = Meteor.subscribe("singleClonePieces", cloneId);
  return {
    piecesIsReady: handlePieces.ready()
  };
}, ProfilePiecesWrapperComponent);

// ProfilePiecesWrapper = React.createClass({
//   mixins: [ReactMeteorData],
//   getMeteorData() {
//     const handlePieces = Meteor.subscribe("singleClonePieces", this.props.cloneId);
//     return {
//       piecesIsReady: handlePieces.ready()
//     };
//   },
//   render() {
//     if (this.data.piecesIsReady) {
//       return <ProfilePieces cloneId={this.props.cloneId} />;
//     } else {
//       return <Loading text="Loading pieces..." />;
//     }
//   }
// });

class ProfilePiecesComponent extends Component {
  render() {
    if (this.props.pieces.length) {
      return (
        <PieceList pieces={this.props.pieces} />
      );
    } else {
      return <Loading text="No piece found." />;
    }
  }
}

ProfilePieces = createContainer(({cloneId}) => {
  return {
    pieces: Pieces.find({userId: cloneId}, {sort: {createdAt: -1}}).fetch(),
  };
}, ProfilePiecesComponent);

// ProfilePieces = React.createClass({
//   mixins: [ReactMeteorData],
//   getMeteorData() {
//     return {
//       pieces: Pieces.find({userId: this.props.cloneId}, {sort: {createdAt: -1}}).fetch(),
//     };
//   },
//   render () {
//     if (this.data.pieces.length) {
//       return (
//         <PieceList pieces={this.data.pieces} />
//       );
//     } else {
//       return <Loading text="No piece found." />;
//     }
//   }
// });
