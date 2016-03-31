SubsWrapper = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    P.setCurrentCloneId();
    const handleSubs = Meteor.subscribe("currentCloneSubs", Session.get("currentCloneId"));
    return {
      subsIsReady: handleSubs.ready()
    };
  },
  render() {
    if (this.data.subsIsReady) {
      return this.props.children;
    } else {
      return (
        <div className="row">
          <div className="col-xs-12">
            <Loading text="Loading subscription..." />
          </div>
        </div>
      );
    }
  }
})
