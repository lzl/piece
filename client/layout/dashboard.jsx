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
            <div id="about" className={P.isActiveCard('about')}>
              <p className="card-text">Each piece is one idea. Your idea. People could follow you. Know more about you, piece by piece. And do you know, your best reader may be yourself. Look back your own pieces. Feel and learn from the younger version of yourself.</p>
              <p className="card-text">Each piece is one idea. Their ideas. You can follow them. Know more about the world, piece by piece. Then you will know, the best way to consume is to build. Build something people love. Build something that just works. Build something you are proud of. Now start with an idea, a piece. Day after day you would know what is it. More important, why and how to build it.</p>
            </div>
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
