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
            <div>
              <CloneBox />
              <SubsWrapper>
                <FollowingWithSubs />
              </SubsWrapper>
            </div>
          </ClonesWrapper>
          <div className="hr" />
          
          <div className="row">
            <About />
          </div>
        </div>
      </div>
    );
  }
})

FollowingWithSubs = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const ownerId = Session.get("currentCloneId");
    return {
      hasSub: Subs.findOne({ownerId}),
    };
  },
  render() {
    return this.renderAddressesWrapper();
  },
  renderAddressesWrapper() {
    if (this.data.hasSub) {
      return (
        <AddressesWrapper>
          <div className="row">
            <FollowingList />
          </div>
        </AddressesWrapper>
      );
    } else {
      return (
        <div className="row">
          <ul id="following" className={P.isActiveListGroup('following')}>
            <li className="list-group-item">
              You have no following.
            </li>
          </ul>
        </div>
      );
    }
  }
})
