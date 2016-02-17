// PieceCard = React.createClass({
//   componentDidMount() {
//     $('p.js-content').linkify(P.linkifyOptions);
//   },
//
//   componentWillUnmount() {
//     const modalId = this.props.piece._id;
//     $(`#detail-${modalId}`).modal('hide');
//   },
//
//   render() {
//     return <CardType {...this.props}>
//       <DetailButton handleDetail={this.handleDetail} />
//       {' '}
//       <ShareButton handleShare={this.handleShare} />
//       {' '}
//       {this.props.piece.ownerId === Session.get("currentCloneId") ? <DeleteButton handleDelete={this.handleDelete} /> : ''}
//
//       <DetailModal {...this.props} />
//       <ShareModal {...this.props} />
//     </CardType>
//   },
//
//   handleDetail(event) {
//     event.preventDefault();
//     $(`#detail-${this.props.piece._id}`).modal('show');
//   },
//
//   handleShare(event) {
//     event.preventDefault();
//     const modalId = this.props.piece._id;
//     $(`#share-${modalId}`).modal('show');
//     $(`#share-${modalId}`).on('shown.bs.modal', () => {
//       $('[name=comment]').focus();
//       // ReactDOM.findDOMNode(this.refs.comment).focus();
//     });
//   },
//
//   handleDelete(event) {
//     event.preventDefault();
//     if (confirm("Do you really want to delete this piece?")) {
//       Meteor.call('removePieceByClone', this.props.piece._id);
//     }
//   }
// })
//
// const CardType = (props) => {
//   const types = {
//     'plaintext': <PlaintextCard {...props} />,
//     'sharism-piece': <SharismPieceCard {...props} />
//   };
//
//   if (props.piece.type && types.hasOwnProperty(props.piece.type)) {
//     return types[props.piece.type];
//   } else {
//     throw new Meteor.Error("UI", "Wrong or not found type at CardType component.");
//   }
// };
// CardType.displayName = 'CardType';
//
// const PlaintextCard = (props) =>
//   <div className="card card-block">
//     <p className="card-text">
//       {props.piece.owner}
//       {' '}
//       <small className="text-muted">· {P.fromNow(props.piece.createdAt)}</small>
//     </p>
//     <p className="card-text word-wrap js-content">
//       {props.piece.content}
//     </p>
//
//     {props.children}
//   </div>
// PlaintextCard.displayName = 'PlaintextCard';
//
// const SharedPlaintextCard = (props) =>
//   <div className="card card-block">
//     <p className="card-text">
//       {props.piece.origin.owner}
//       {' '}
//       <small className="text-muted">· {P.fromNow(props.piece.origin.createdAt)}</small>
//     </p>
//     <p className="card-text word-wrap js-content">
//       {props.piece.origin.content}
//     </p>
//
//     {props.children}
//   </div>
// SharedPlaintextCard.displayName = 'SharedPlaintextCard';
//
// const SharismPieceCard = (props) =>
//   <div className="card card-block">
//     <p className="card-text">
//       {props.piece.owner}
//       {' '}
//       <small className="text-muted">shared · {P.fromNow(props.piece.createdAt)}</small>
//     </p>
//
//     {props.piece.content ? <p className="card-text word-wrap js-content">
//       {props.piece.content}
//     </p> : ''}
//
//     <div className="card card-block">
//       <p className="card-text">
//         {props.piece.origin.owner}
//         {' '}
//         <small className="text-muted">· {P.fromNow(props.piece.origin.createdAt)}</small>
//       </p>
//       <p className="card-text word-wrap js-content">
//         {props.piece.origin.content}
//       </p>
//     </div>
//
//     {props.children}
//   </div>
// SharismPieceCard.displayName = 'SharismPieceCard';
//
// const DetailButton = ({handleDetail}) =>
//   <button type="button" className="btn btn-secondary" onClick={handleDetail}>Detail</button>
// DetailButton.displayName = 'DetailButton';
//
// const DetailModal = React.createClass({
//   render() {
//     return (
//       <div className="modal fade" id={`detail-${this.props.piece._id}`} tabIndex="-1" role="dialog" aria-labelledby="readerPieceDetail" aria-hidden="true">
//         <div className="modal-dialog" role="document">
//           <div className="modal-content">
//             <div className="modal-header">
//               <button type="button" className="close" data-dismiss="modal" aria-label="Close">
//                 <span aria-hidden="true">&times;</span>
//               </button>
//               <h4 className="modal-title" id="readerPieceDetail">The detail of this piece.</h4>
//             </div>
//             <div className="modal-body">
//               <p className="card-text word-wrap">
//                 <span>Username: {this.props.piece.owner}</span>
//                 <br />
//                 <span>Address: <code>https://{this.props.piece.hostname}/c/{this.props.piece.ownerId}</code></span>
//               </p>
//               <p className="card-text">
//                 <span>Piece ID: <code>{this.props.piece._id}</code></span>
//                 <br />
//                 <span>Published at {P.publishedAt(this.props.piece.createdAt)}</span>
//               </p>
//               <p className="card-text">
//                 <PreviewButton hostname={this.props.piece.hostname} userId={this.props.piece.ownerId} />
//                 {' '}
//                 <FollowButton hostname={this.props.piece.hostname} userId={this.props.piece.ownerId} />
//               </p>
//
//               {this.renderOrigin()}
//             </div>
//             <div className="modal-footer">
//               <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   },
//
//   renderOrigin() {
//     if (this.props.piece.origin) {
//       return (
//         <div className="card card-block">
//           <p className="card-text word-wrap">
//             <span>Username: {this.props.piece.origin.owner}</span>
//             <br />
//             <span>Address: <code>https://{this.props.piece.origin.hostname}/c/{this.props.piece.origin.ownerId}</code></span>
//           </p>
//           <p className="card-text">
//             <span>Piece ID: <code>{this.props.piece.origin._id}</code></span>
//             <br />
//             <span>Published at {P.publishedAt(this.props.piece.origin.createdAt)}</span>
//           </p>
//           <p className="card-text">
//             <PreviewButton hostname={this.props.piece.origin.hostname} userId={this.props.piece.origin.ownerId} />
//             {' '}
//             <FollowButton hostname={this.props.piece.origin.hostname} userId={this.props.piece.origin.ownerId} />
//           </p>
//         </div>
//       );
//     }
//   }
// })
//
// const ShareButton = ({handleShare}) =>
//   <button type="button" className="btn btn-secondary" onClick={handleShare}>Share</button>
// ShareButton.displayName = 'ShareButton';
//
// const ShareModal = React.createClass({
//   mixins: [ReactMeteorData],
//   getMeteorData() {
//     return {
//       selectClone: Clones.findOne({_id: this.state.selectCloneId})
//     };
//   },
//   getInitialState() {
//     return {
//       selectCloneId: Session.get("currentCloneId"),
//       comment: ''
//     };
//   },
//
//   render() {
//     return <div className="modal fade" id={`share-${this.props.piece._id}`} tabIndex="-1" role="dialog" aria-labelledby="readerPieceShare" aria-hidden="true">
//       <div className="modal-dialog" role="document">
//         <div className="modal-content">
//           <div className="modal-header">
//             <button type="button" className="close" data-dismiss="modal" aria-label="Close">
//               <span aria-hidden="true">&times;</span>
//             </button>
//             <h4 className="modal-title" id="readerPieceShare">Share this to your followers?</h4>
//           </div>
//           <div className="modal-body">
//             <div className="input-group">
//               <span className="input-group-addon" id="input-share-comment">Comment</span>
//               <input type="text" className="form-control" ref="comment" name="comment" placeholder="Optional" aria-describedby="input-share-comment" onKeyUp={this.handleComment} />
//             </div>
//
//             <br />
//
//             <p className="card-text">
//               {this.data.selectClone.name}
//               {' '}
//               <small className="text-muted">shared</small>
//             </p>
//             <p className="card-text">
//               {this.state.comment}
//             </p>
//
//             {this.props.piece.type === "plaintext" ? <PlaintextCard {...this.props} /> : ''}
//             {this.props.piece.type === "sharism-piece" ? <SharedPlaintextCard {...this.props} /> : ''}
//           </div>
//           <div className="modal-footer">
//             <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
//             {' '}
//             {this.props.clones.length > 1 ? <select className="c-select" ref="selectClone" defaultValue={this.props.currentClone._id} onChange={this.handleSelect}>
//               {this.props.clones.map((clone) => {
//                 return <option key={clone._id} value={clone._id}>{clone.name}</option>
//               })}
//             </select> : ''}
//             {' '}
//             <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Share</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   },
//
//   handleComment(event) {
//     event.preventDefault();
//     this.setState({comment: this.refs.comment.value});
//   },
//   handleSelect(event) {
//     event.preventDefault()
//     this.setState({selectCloneId: this.refs.selectClone.value});
//   },
//   handleSubmit(event) {
//     event.preventDefault()
//     const types = {
//       'plaintext': this.props.piece,
//       'sharism-piece': this.props.piece.origin
//     }
//     const piece = types[this.props.piece.type];
//     const comment = this.refs.comment.value;
//     const cloneId = this.state.selectCloneId;
//     const modalId = this.props.piece._id;
//     Meteor.call('sharePieceByClone', piece, comment, cloneId, () => {
//       $(`#share-${modalId}`).modal('hide');
//     });
//   }
// })
//
// const DeleteButton = ({handleDelete}) =>
//   <button type="button" className="btn btn-danger-outline" onClick={handleDelete}>Delete</button>
// DeleteButton.displayName = 'DeleteButton';
