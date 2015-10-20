App = React.createClass({
  getPieces() {
    return [
      { _id: 1, content: "This is piece 1" },
      { _id: 2, content: "This is piece 2" },
      { _id: 3, content: "This is piece 3" },
    ];
  },

  renderCards() {
    return this.getPieces().map((piece) => {
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
