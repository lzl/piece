Profile = ({clone, pieces}) =>
  <div className="container narrow">
    <div className="hr" />
    <div className="row">{clone}</div>
    <div className="row">{pieces}</div>
  </div>
Profile.displayName = "Profile";

ProfileCloneWrapper = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const handleProfile = Meteor.subscribe("singleCloneProfile", this.props.cloneId);
    return {
      profileIsReady: handleProfile.ready()
    };
  },
  render() {
    if (this.data.profileIsReady) {
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
});

ProfileClone = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      profile: Clones.findOne({_id: this.props.cloneId}),
    };
  },
  render () {
    if (this.data.profile) {
      const {_id, name, updatedAt} = this.data.profile;
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
});

ProfilePiecesWrapper = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const handlePieces = Meteor.subscribe("singleClonePieces", this.props.cloneId);
    return {
      piecesIsReady: handlePieces.ready()
    };
  },
  render() {
    if (this.data.piecesIsReady) {
      return <ProfilePieces cloneId={this.props.cloneId} />;
    } else {
      return <Loading text="Loading pieces..." />;
    }
  }
});

ProfilePieces = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      pieces: Pieces.find({userId: this.props.cloneId}, {sort: {createdAt: -1}}).fetch(),
    };
  },
  render () {
    if (this.data.pieces.length) {
      return (
        <PieceList pieces={this.data.pieces} />
      );
    } else {
      return <Loading text="No piece found." />;
    }
  }
});
