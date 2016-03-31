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
          <div className="col-xs-12">
            <Loading text="Loading clones..." />
          </div>
        </div>
      );
    }
  }
})
