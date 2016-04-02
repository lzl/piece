import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

Dashboard = React.createClass({
  render () {
    return (
      <div className="row">
        <div className="col-sm-3">
          <Sidebar />
        </div>
        <div className="br hidden-sm-up" />
        <div className="col-sm-9">
          <ClonesWrapper>
            <div className="row">
              <div className="col-xs-12">
                <CloneBox />
                <SubsWrapper>
                  <FollowingHasSub />
                </SubsWrapper>
              </div>
            </div>
          </ClonesWrapper>
          <div className="hr" />
          <div className="row">
            <div className="col-xs-12">
              <AccountBox />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <About />
            </div>
          </div>
        </div>
      </div>
    );
  }
})

class FollowingHasSubComponent extends Component {
  render() {
    if (this.props.hasSub) {
      return (
        <AddressesWrapper>
          <FollowingList />
        </AddressesWrapper>
      );
    } else {
      return (
        <div className="row">
          <div className="col-xs-12">
            <ul id="following" className={P.isActiveListGroup('following')}>
              <li className="list-group-item">You have no following.</li>
            </ul>
          </div>
        </div>
      );
    }
  }
}

FollowingHasSub = createContainer(() => {
  const ownerId = Session.get("currentCloneId");
  return {
    hasSub: Subs.findOne({ownerId}),
  };
}, FollowingHasSubComponent);

// FollowingHasSub = React.createClass({
//   mixins: [ReactMeteorData],
//   getMeteorData() {
//     const ownerId = Session.get("currentCloneId");
//     return {
//       hasSub: Subs.findOne({ownerId}),
//     };
//   },
//   render() {
//     if (this.data.hasSub) {
//       return (
//         <AddressesWrapper>
//           <FollowingList />
//         </AddressesWrapper>
//       );
//     } else {
//       return (
//         <div className="row">
//           <div className="col-xs-12">
//             <ul id="following" className={P.isActiveListGroup('following')}>
//               <li className="list-group-item">You have no following.</li>
//             </ul>
//           </div>
//         </div>
//       );
//     }
//   }
// })
