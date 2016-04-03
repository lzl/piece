import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

class MainComponent extends Component {
  render() {
    return (
      <ClonesWrapper>
        <div>
          <div className="row">
            <div className="col-xs-12">
              <AddressBox address={this.props.address} />
              <div className="br" />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12">
              <Notepad />
              <div className="hr" />
            </div>
          </div>

          <SubsWrapper>
            <div className="row">
              <div className="col-xs-12">
                <FilterBar />
                <MainWithSubs before={this.props.before} />
              </div>
            </div>
          </SubsWrapper>
        </div>
      </ClonesWrapper>
    );
  }
}

Main = createContainer(() => {
  return {
    address: P.currentCloneAddress(),
  };
}, MainComponent);

// Main = React.createClass({
//   mixins: [ReactMeteorData],
//   getMeteorData() {
//     return {
//       address: P.currentCloneAddress(),
//     };
//   },
//   render() {
//     return (
//       <ClonesWrapper>
//         <div>
//           <div className="row">
//             <div className="col-xs-12">
//               <AddressBox address={this.data.address} />
//               <div className="br" />
//             </div>
//           </div>
//
//           <div className="row">
//             <div className="col-xs-12">
//               <Notepad />
//               <div className="hr" />
//             </div>
//           </div>
//
//           <SubsWrapper>
//             <div className="row">
//               <div className="col-xs-12">
//                 <FilterBar />
//                 <MainWithSubs before={this.props.before} />
//               </div>
//             </div>
//           </SubsWrapper>
//         </div>
//       </ClonesWrapper>
//     );
//   }
// });

class MainWithSubsComponent extends Component {
  render() {
    if (this.props.piecesIsReady) {
      return <MainWithPieces before={this.props.before} />
    } else {
      return <Loading text="Loading pieces..." />
    }
  }
}

MainWithSubs = createContainer(({before}) => {
  const cloneId = Session.get("currentCloneId");
  const handlePieces = Meteor.subscribe("currentClonePieces", cloneId, before);
  return {
    piecesIsReady: handlePieces.ready(),
  };
}, MainWithSubsComponent);

// MainWithSubs = React.createClass({
//   mixins: [ReactMeteorData],
//   getMeteorData() {
//     const cloneId = Session.get("currentCloneId");
//     const handlePieces = Meteor.subscribe("currentClonePieces", cloneId, this.props.before);
//     return {
//       piecesIsReady: handlePieces.ready(),
//     };
//   },
//   render() {
//     if (this.data.piecesIsReady) {
//       return <MainWithPieces before={this.props.before} />
//     } else {
//       return <Loading text="Loading pieces..." />
//     }
//   }
// });

class MainWithPiecesComponent extends Component {
  render() {
    if (this.props.hasPiece) {
      return (
        <div>
          {this.renderPieceCards()}
          {this.renderReadMoreButton()}
          <div className="hr" />
        </div>
      );
    } else if (!this.props.hasPiece && this.props.before) {
      return <Loading text="There is no piece." />
    } else {
      return <Loading text="Welcome to Piece. It's a place to express your ideas while learning from others. At above, you can write a piece, or find your address to copy and share." />
    }
  }

  renderPieceCards() {
    return this.props.pieces.map((piece) => {
      return <PieceCard
              key={piece._id}
              piece={piece}
              clones={this.props.clones}
              currentClone={this.props.currentClone}
              otherClones={this.props.otherClones}
              />
    })
  }

  renderReadMoreButton() {
    if (this.props.pieces.length === P.publishPieceLimit) {
      return <LoadMore handle={this.handleLoadMore.bind(this)} />
    } else {
      return <Loading text="There is no more piece." />
    }
  }

  handleLoadMore(event) {
    event.preventDefault();
    const userId = Session.get("currentCloneId");
    const createdAt = Pieces.findOne({userId}, {sort: {createdAt: 1}}).createdAt;
    const before = createdAt.getTime().toString();
    FlowRouter.go(`/?before=${before}`);
  }
}

MainWithPieces = createContainer(() => {
  const userId = Session.get("currentCloneId");
  return {
    hasPiece: Pieces.findOne({userId}),
    pieces: Pieces.find({userId}, {sort: {createdAt: -1}}).fetch(),
    clones: Clones.find({}, {sort: {createdAt: 1}}).fetch(),
    currentClone: Clones.findOne({_id: Session.get("currentCloneId")}),
    otherClones: Clones.find({_id: {$ne: Session.get("currentCloneId")}}).fetch(),
  };
}, MainWithPiecesComponent);

// MainWithPieces = React.createClass({
//   mixins: [ReactMeteorData],
//   getMeteorData() {
//     const userId = Session.get("currentCloneId");
//     return {
//       hasPiece: Pieces.findOne({userId}),
//       pieces: Pieces.find({userId}, {sort: {createdAt: -1}}).fetch(),
//       clones: Clones.find({}, {sort: {createdAt: 1}}).fetch(),
//       currentClone: Clones.findOne({_id: Session.get("currentCloneId")}),
//       otherClones: Clones.find({_id: {$ne: Session.get("currentCloneId")}}).fetch(),
//     };
//   },
//   render() {
//     if (this.data.hasPiece) {
//       return (
//         <div>
//           {this.renderPieceCards()}
//           {this.renderReadMoreButton()}
//           <div className="hr" />
//         </div>
//       );
//     } else if (!this.data.hasPiece && this.props.before) {
//       return <Loading text="There is no piece." />
//     } else {
//       return <Loading text="Welcome to Piece. It's a place to express your ideas while learning from others. At above, you can write a piece, or find your address to copy and share." />
//     }
//   },
//   renderPieceCards() {
//     return this.data.pieces.map((piece) => {
//       return <PieceCard
//               key={piece._id}
//               piece={piece}
//               clones={this.data.clones}
//               currentClone={this.data.currentClone}
//               otherClones={this.data.otherClones}
//               />
//     })
//   },
//   renderReadMoreButton() {
//     if (this.data.pieces.length === P.publishPieceLimit) {
//       return <LoadMore handle={this.handleLoadMore} />
//     } else {
//       return <Loading text="There is no more piece." />
//     }
//   },
//   handleLoadMore(event) {
//     event.preventDefault();
//     const userId = Session.get("currentCloneId");
//     const createdAt = Pieces.findOne({userId}, {sort: {createdAt: 1}}).createdAt;
//     const before = createdAt.getTime().toString();
//     FlowRouter.go(`/?before=${before}`);
//   }
// });
