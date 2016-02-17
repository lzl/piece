ClonesWrapper = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const handleClones = Meteor.subscribe("currentUserClones");
    return {
      clonesIsReady: handleClones.ready()
    };
  },
  render() {
    if (this.data.clonesIsReady) {
      return this.props.children;
    } else {
      return (
        <div className="row">
          <Loading text="Loading clones..." />
        </div>
      );
    }
  }
})
