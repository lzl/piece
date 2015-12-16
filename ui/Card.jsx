Card = React.createClass({
  propTypes: {
    piece: React.PropTypes.object.isRequired
  },

  mixins: [ReactMeteorData],

  getMeteorData() {
    var createdAt = this.createdFromNow(this.props.piece.createdAt);
    if (this.props.piece.origin) {
      var originCreatedAt = this.createdFromNow(this.props.piece.origin.createdAt);
    }
    return {
      createdAt,
      originCreatedAt
    }
  },

  createdFromNow(timestamp) {
    if (timestamp === undefined) {
      return 'unknown';
    }
    const time = timestamp.getTime();
    const between = (TimeSync.serverTime() - time) / 1000;
    if (between < 60) {
      return ~~(between) + 's';
    } else if (between < 3600) {
      return ~~(between / 60) + 'm';
    } else if (between < 86400) {
      return ~~(between / 3600) + 'h';
    } else {
      return ~~(between / 86400) + 'd';
    }
  },

  pieceRemove() {
    Meteor.call('pieceRemoveByClone', this.props.piece._id);
  },

  renderButton() {
    if (Meteor.userId()) {
      return (
        <div>
          <button type="button" className="btn btn-secondary" disabled>Detail</button>
          {' '}
          <button type="button" className="btn btn-danger-outline" onClick={this.pieceRemove}>Delete</button>
        </div>
      );
    }
  },

  renderPlaintext() {
    return (
      <div>
        <p className="card-text">
          {this.props.piece.owner}
          {' '}
          <small className="text-muted">· {this.data.createdAt}</small>
        </p>
        <p className="card-text">
          {this.props.piece.content}
        </p>
        <p className="card-text"></p>
      </div>
    );
  },

  renderComment() {
    return (
      <p className="card-text">
        {this.props.piece.comment}
      </p>
    );
  },

  renderSharismPiece() {
    return (
      <div>
        <p className="card-text">
          {this.props.piece.owner}
          {' '}
          <small className="text-muted">shared · {this.data.createdAt}</small>
        </p>

        {this.props.piece.comment ? this.renderComment() : ''}

        <div className="card card-block">
          <p className="card-text">
            {this.props.piece.origin.owner}
            {' '}
            <small className="text-muted">· {this.data.originCreatedAt}</small>
          </p>
          <p className="card-text">
            {this.props.piece.origin.content}
          </p>
        </div>
      </div>
    )
  },

  renderContent() {
    switch (this.props.piece.type) {
      case 'plaintext':
        return this.renderPlaintext();
        break;
      case 'sharism-piece':
        return this.renderSharismPiece();
        break;
      default:
        return this.renderPlaintext();
    }
  },

  render() {
    return (
      <div className="card card-block">
        {this.renderContent()}
        {this.renderButton()}
      </div>
    );
  }
});
