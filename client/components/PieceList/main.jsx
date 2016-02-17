PieceList = React.createClass({
  componentDidMount() {
    $('.js-content').linkify(P.linkifyOptions);
  },

  render() {
    return (
      <ul className="list-group">
        {this.renderList()}
      </ul>
    );
  },

  renderList() {
    return this.props.pieces.map((piece) => {
      return <ListType key={piece._id} piece={piece} />
    });
  }
})

const ListType = (props) => {
  const types = {
    'plaintext': <PlaintextList {...props} />,
    'sharism-piece': <SharismPieceList {...props} />
  };

  if (props.piece.type && types.hasOwnProperty(props.piece.type)) {
    return types[props.piece.type];
  } else {
    throw new Meteor.Error("UI", "Wrong or not found type at ListType component.");
  }
};
ListType.displayName = 'ListType';

const PlaintextList = (props) =>
  <li className="list-group-item">
    <small title={P.publishedAt(props.piece.createdAt)} className="text-muted pull-xs-right">{P.fromNow(props.piece.createdAt)}</small>
    <span className="word-wrap js-content">{props.piece.content}</span>
  </li>
PlaintextList.displayName = 'PlaintextList';

const SharismPieceList = (props) =>
  <li className="list-group-item">
    <small title={P.publishedAt(props.piece.createdAt)} className="text-muted pull-xs-right">{P.fromNow(props.piece.createdAt)}</small>
    {props.piece.content ? <span className="word-wrap js-content">{props.piece.content} » </span> : <span>» </span>}
    <span className="text-muted word-wrap js-content">
      <a href={P.makeAddress({hostname: props.piece.origin.hostname, userId: props.piece.origin.userId})}>{props.piece.origin.username}</a>: {props.piece.origin.content}
    </span>
  </li>
SharismPieceList.displayName = 'SharismPieceList';
