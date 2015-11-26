AllUserCards = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    const handlePieces = Meteor.subscribe("pieceAllUserPosts");

    return {
      pieces: Pieces.find({}, {sort: {createdAt: -1}}).fetch()
    }
  },

  renderCards() {
    return this.data.pieces.map((piece) => {
      return <Card key={piece._id} piece={piece} />;
    });
  },

  render() {
    return (
      <div className="row">
        {this.renderCards()}
      </div>
    )
  }
});
