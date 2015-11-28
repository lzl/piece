AllUserCards = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    const handlePieces = Meteor.subscribe("pieceAllUserPosts");

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
      return <Loading text={"Loading public pieces"} />;
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
