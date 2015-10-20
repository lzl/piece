App = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      pieces: Pieces.find({}).fetch()
    }
  },

  renderCards() {
    return this.data.pieces.map((piece) => {
      return <Card key={piece._id} piece={piece} />;
    });
  },

  render() {
    return (
      <div className="container">
        {this.renderCards()}
      </div>
    );
  }
});
