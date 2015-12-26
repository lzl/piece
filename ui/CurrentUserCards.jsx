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
    const handlePieces = Meteor.subscribe("pieceSingleClonePostsNew", Session.get("currentCloneId"));

    return {
      pieces: Pieces.find({}, {sort: {createdAt: -1}}).fetch(),
      piecesIsReady: handlePieces.ready(),
      handlePieces: handlePieces
    }
  },

  renderCardsOrLoading() {
    if (this.data.piecesIsReady) {
      return (
        <div>
          {this.renderCards()}
          {this.renderReadMoreButton()}
          <div className="hr"></div>
        </div>
      );
    } else {
      return <Loading text={"Loading your pieces"} />;
    }
  },

  renderCards() {
    return this.data.pieces.map((piece) => {
      return <Card key={piece._id} piece={piece} />;
    });
  },

  renderReadMoreButton() {
    const limit = this.data.handlePieces.data('limit') || 20;
    let disabled = '';
    if (limit > Pieces.find().count()) {
      disabled = 'disabled';
    }
    return <button type="button" className="btn btn-primary-outline btn-block" onClick={this.loadMore} disabled={disabled} >Read More</button>
  },

  loadMore(event) {
    event.preventDefault();
    if (this.data.handlePieces.data('limit') === undefined) {
      this.data.handlePieces.setData('limit', 40);
    } else {
      this.data.handlePieces.setData('limit', this.data.handlePieces.data('limit') + 20);
    }
  },

  render() {
    return (
      <div className="row">
        {this.renderCardsOrLoading()}
      </div>
    )
  }
});
