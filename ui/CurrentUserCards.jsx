CurrenUserCards = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    // set currentCloneId with first clone's id if it wasn't set before
    Session.setDefault("currentCloneId", Clones.findOne()._id);
    // if currentCloneId was set, then check if it belongs to current user
    if (! Clones.findOne(Session.get("currentCloneId"))) {
      // if not, then set again
      Session.set("currentCloneId", Clones.findOne()._id);
    }
    // subscribe with currentCloneId
    const handlePieces = Meteor.subscribe("pieceSingleClonePosts", Session.get("currentCloneId"));

    return {
      pieces: Pieces.find({}, {sort: {createdAt: -1}}).fetch(),
      piecesIsReady: handlePieces.ready()
    }
  },

  renderCards() {
    if (this.data.piecesIsReady) {
      return this.data.pieces.map((piece) => {
        return <Card key={piece._id} piece={piece} />;
      });
    } else {
      return <Loading text={"Loading your pieces"} />;
    }
  },

  render() {
    return (
      <div className="row">
        {this.renderCards()}
      </div>
    )
  }
});
