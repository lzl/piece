Reader = React.createClass({
  render() {
    return (
      <ClonesWrapper>
        <SubsWrapper>
          <ReaderWithSubs {...this.props} />
        </SubsWrapper>
      </ClonesWrapper>
    );
  }
})

// ReaderWithRawSubs = React.createClass({
//   mixins: [ReactMeteorData],
//   getMeteorData() {
//     const cloneId = Session.get("currentCloneId");
//     const rawSubs = Subs.find({ownerId: cloneId}, {fields: {hostname: 1, userId: 1}}).fetch();
//     let subs = [];
//     if (rawSubs) {
//       _.each(rawSubs, (sub) => {
//         subs.push({hostname: sub.hostname, ownerId: sub.userId});
//       })
//     }
//     return {
//       subs: subs,
//     };
//   },
//   render() {
//     return (
//       <div>
//         <div className="row hidden-xs-down">
//           <PreviewBox />
//           <div className="hr" />
//         </div>
//         {this.renderSubs()}
//       </div>
//     );
//   },
//   renderSubs() {
//     if (this.data.subs.length) {
//       return <ReaderWithSubs subs={this.data.subs} {...this.props} />
//     } else {
//       return (
//         <div className="row">
//           <Loading text="You have no following." />
//         </div>
//       );
//     }
//   }
// })

ReaderWithSubs = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const cloneId = Session.get("currentCloneId");
    return {
      subs: Subs.find({ownerId: cloneId}).count(),
    };
  },
  render() {
    return (
      <div>
        <div className="row hidden-xs-down">
          <PreviewBox />
          <div className="hr" />
        </div>
        {this.renderSubs()}
      </div>
    );
  },
  renderSubs() {
    if (this.data.subs) {
      return <ReaderHandlePieces {...this.props} />
    } else {
      return (
        <div className="row">
          <Loading text="You have no following." />
        </div>
      );
    }
  }
})

ReaderHandlePieces = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const cloneId = Session.get("currentCloneId");
    const handlePieces = Meteor.subscribe("multiClonePieces", cloneId, this.props.before);
    return {
      piecesIsReady: handlePieces.ready(),
    };
  },
  render() {
    return this.renderPieceCards()
  },
  renderPieceCards() {
    if (this.data.piecesIsReady) {
      return <ReaderWithPieces />
    } else {
      return (
        <div className="row">
          <Loading text="Loading pieces..." />
        </div>
      );
    }
  }
})

ReaderWithPieces = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      pieces: Pieces.find({}, {sort: {createdAt: -1}}).fetch(),
      clones: Clones.find({}, {sort: {createdAt: 1}}).fetch(),
      currentClone: Clones.findOne({_id: Session.get("currentCloneId")}),
      otherClones: Clones.find({_id: {$ne: Session.get("currentCloneId")}}).fetch(),
    };
  },
  render() {
    if (this.data.pieces.length > 0) {
      return (
        <div className="row">
          {this.renderPieceCards()}
          {this.renderLoadMoreButton()}
          <div className="hr" />
        </div>
      );
    } else {
      return (
        <div className="row">
          <Loading text="There is no more piece." />
        </div>
      );
    }
  },
  renderPieceCards() {
    return this.data.pieces.map((piece) => {
      return <PieceCard
              key={piece._id}
              piece={piece}
              clones={this.data.clones}
              currentClone={this.data.currentClone}
              otherClones={this.data.otherClones}
              />;
    })
  },
  renderLoadMoreButton() {
    if (this.data.pieces.length === 20) {
      return <LoadMore handle={this.handleLoadMore} />
    } else {
      return <Loading text="There is no more piece." />
    }
  },
  handleLoadMore(event) {
    event.preventDefault();
    const createdAt = Pieces.findOne({}, {sort: {createdAt: 1}}).createdAt;
    const before = createdAt.getTime().toString();
    FlowRouter.go(`/reader?before=${before}`);
  }
})
