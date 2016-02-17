Reader = React.createClass({
  render() {
    return (
      <ClonesWrapper>
        <SubsWrapper>
          <ReaderWithSubs before={this.props.before} />
        </SubsWrapper>
      </ClonesWrapper>
    );
  }
});

ReaderWithSubs = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const ownerId = Session.get("currentCloneId");
    return {
      hasSub: Subs.findOne({ownerId}),
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
    if (this.data.hasSub) {
      return <ReaderHandlePieces before={this.props.before} />
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
});

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
    if (this.data.pieces.length === P.publishPieceLimit) {
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
});
