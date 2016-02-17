Main = React.createClass({
  render() {
    return (
      <ClonesWrapper>
        <div>
          <div className="row">
            <Notepad />
            <div className="hr" />
          </div>

          <SubsWrapper>
            <div className="row">
              <MainWithSubs before={this.props.before} />
            </div>
          </SubsWrapper>
        </div>
      </ClonesWrapper>
    );
  }
});

MainWithSubs = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const cloneId = Session.get("currentCloneId");
    const handlePieces = Meteor.subscribe("currentClonePieces", cloneId, this.props.before);
    return {
      piecesIsReady: handlePieces.ready(),
    };
  },
  render() {
    if (this.data.piecesIsReady) {
      return <MainWithPieces />
    } else {
      return <Loading text="Loading pieces..." />
    }
  }
});

MainWithPieces = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const userId = Session.get("currentCloneId");
    return {
      hasPiece: Pieces.findOne({userId}),
      pieces: Pieces.find({userId}, {sort: {createdAt: -1}}).fetch(),
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
          {this.renderReadMoreButton()}
          <div className="hr" />
        </div>
      );
    } else {
      return <Loading text="Welcome to Piece. It's a place to express your ideas and learn from others. You can submit a piece above." />
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
              />
    })
  },
  renderReadMoreButton() {
    if (this.data.pieces.length === P.publishPieceLimit) {
      return <LoadMore handle={this.handleLoadMore} />
    } else {
      return <Loading text="There is no more piece." />
    }
  },
  handleLoadMore(event) {
    event.preventDefault();
    const userId = Session.get("currentCloneId");
    const createdAt = Pieces.findOne({userId}, {sort: {createdAt: 1}}).createdAt;
    const before = createdAt.getTime().toString();
    FlowRouter.go(`/?before=${before}`);
  }
});
