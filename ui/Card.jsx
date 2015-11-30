Card = React.createClass({
  propTypes: {
    piece: React.PropTypes.object.isRequired
  },

  pieceRemove() {
    Meteor.call('pieceRemoveByClone', this.props.piece._id);
  },

  renderButton() {
    if (Meteor.userId()) {
      return (
        <div>
          <button className="btn btn-primary-outline card-link" disabled>Detail</button>
          <button className="btn btn-danger-outline card-link" onClick={this.pieceRemove}>Delete</button>
        </div>
      );
    }
  },

  render() {
    return (
      <div className="card card-block">
        <p className="card-text">
          <strong>{this.props.piece.owner}</strong>
          {' '}
          <small className="text-muted">({this.props.piece.ownerId})</small>
        </p>
        <p className="card-text">
          {this.props.piece.content}
        </p>
        <p className="card-text">
          <small className="text-muted">{moment(this.props.piece.createdAt).calendar()} / Piece ID: {this.props.piece._id}</small>
        </p>
        {this.renderButton()}
      </div>
    );
  }
});
