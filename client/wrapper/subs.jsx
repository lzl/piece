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
          <Loading text="Loading subscription..." />
        </div>
      );
    }
  }
})