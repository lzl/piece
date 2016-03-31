Reader = React.createClass({
  render() {
    return (
      <ClonesWrapper>
        <div>
          <div className="row">
            <div className="col-xs-12">
              <PreviewBox />
              <div className="hr" />
            </div>
          </div>

          <SubsWrapper>
            <div className="row">
              <div className="col-xs-12">
                <ReaderHasSub before={this.props.before} />
              </div>
            </div>
          </SubsWrapper>
        </div>
      </ClonesWrapper>
    );
  }
});

ReaderHasSub = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const ownerId = Session.get("currentCloneId");
    return {
      hasSub: Subs.findOne({ownerId}),
    };
  },
  render() {
    if (this.data.hasSub) {
      return <ReaderWithSubs before={this.props.before} />
    } else {
      return <Loading text="You have no following." />
    }
  }
});

ReaderWithSubs = React.createClass({
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
      return <Loading text="Loading pieces..." />
    }
  }
});

ReaderWithPieces = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      hasPiece: Pieces.findOne(),
      pieces: Pieces.find({}, {sort: {createdAt: -1}}).fetch(),
      clones: Clones.find({}, {sort: {createdAt: 1}}).fetch(),
      currentClone: Clones.findOne({_id: Session.get("currentCloneId")}),
      otherClones: Clones.find({_id: {$ne: Session.get("currentCloneId")}}).fetch(),
    };
  },
  render() {
    if (this.data.hasPiece) {
      return (
        <div>
          {this.renderPieceCards()}
          {this.renderLoadMoreButton()}
          <div className="hr" />
        </div>
      );
    } else {
      return <Loading text="There is no more piece." />
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
