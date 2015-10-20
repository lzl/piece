Card = React.createClass({
  propTypes: {
    piece: React.PropTypes.object.isRequired
  },

  pieceRemove() {
    Meteor.call('pieceRemove', this.props.piece._id);
  },

  renderButton() {
    if (this.props.piece.ownerId === Meteor.userId()) {
      return (
        <div>
          <button className="btn btn-primary-outline card-link">Detail</button>
          <button className="btn btn-danger-outline card-link" onClick={this.pieceRemove}>Delete</button>
        </div>
      );
    }
  },

  render() {
    return (
      <div className="card card-block">
        <h4 className="card-title">{this.props.piece._id}</h4>
        <p className="card-text">{this.props.piece.content}</p>
        <p className="card-text">
          <small className="text-muted">{this.props.piece.owner}</small>
        </p>
        {this.renderButton()}
      </div>
    );
  }
})
