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

  componentDidMount() {
    const options = {
      format: (value, type) => {
        if (type === 'url' && value.length > 50) {
          value = value.slice(0, 50) + '…';
        }
        return value;
      },
      linkAttributes: {
        rel: 'nofollow'
      },
      linkClass: null
    };
    $('p.js-content').linkify(options);
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

  publishedAt(timestamp) {
    return moment(timestamp).format('LLL');
  },

  pieceRemove(event) {
    event.preventDefault();
    if (confirm("Do you really want to delete this piece?")) {
      Meteor.call('pieceRemoveByClone', this.props.piece._id);
    }
  },

  pieceDetail(event) {
    event.preventDefault();
    $(`#detail-${this.props.piece._id}`).modal('show');
  },

  renderButton() {
    if (Meteor.userId()) {
      return (
        <div>
          <button type="button" className="btn btn-secondary" onClick={this.pieceDetail}>Detail</button>
          {' '}
          <button type="button" className="btn btn-danger-outline" onClick={this.pieceRemove}>Delete</button>

          {this.readerPieceDetail()}
        </div>
      );
    }
  },

  readerPieceDetail() {
    return (
      <div className="modal fade" id={`detail-${this.props.piece._id}`} tabIndex="-1" role="dialog" aria-labelledby="readerPieceDetail" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title" id="readerPieceDetail">The detail of this piece.</h4>
            </div>
            <div className="modal-body">
              <p className="card-text">Username: {this.props.piece.owner}</p>
              <p className="card-text">
                <span>URL: <code>https://{this.props.piece.hostname}</code></span>
                <br />
                <span>User ID: <code>{this.props.piece.ownerId}</code></span>
              </p>
              <p className="card-text">
                <span>Piece ID: <code>{this.props.piece._id}</code></span>
                <br />
                <span>Published at {this.publishedAt(this.props.piece.createdAt)}</span>
              </p>

              {this.readerPieceOriginDetail()}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  },

  readerPieceOriginDetail() {
    if (this.props.piece.origin) {
      return (
        <div className="card card-block">
          <p className="card-text">Username: {this.props.piece.origin.owner}</p>
          <p className="card-text">
            <span>URL: <code>https://{this.props.piece.origin.hostname}</code></span>
            <br />
            <span>User ID: <code>{this.props.piece.origin.ownerId}</code></span>
          </p>
          <p className="card-text">
            <span>Piece ID: <code>{this.props.piece.origin._id}</code></span>
            <br />
            <span>Published at {this.publishedAt(this.props.piece.origin.createdAt)}</span>
          </p>
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
        <p className="card-text word-wrap js-content">
          {this.props.piece.content}
        </p>
        <p className="card-text"></p>
      </div>
    );
  },

  renderComment() {
    return (
      <p className="card-text word-wrap js-content">
        {this.props.piece.content}
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

        {this.props.piece.content ? this.renderComment() : ''}

        <div className="card card-block">
          <p className="card-text">
            {this.props.piece.origin.owner}
            {' '}
            <small className="text-muted">· {this.data.originCreatedAt}</small>
          </p>
          <p className="card-text word-wrap js-content">
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
