AddressesWrapper = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const subs = Subs.find({}, {fields: {userId: 1}}).fetch();
    const ids = _.pluck(subs, 'userId');
    const handleAddresses = Meteor.subscribe("multiAddressesByIds", ids);
    return {
      addressesIsReady: handleAddresses.ready(),
    };
  },
  render() {
    if (this.data.addressesIsReady) {
      return this.props.children;
    } else {
      return (
        <div className="row">
          <Loading text="Loading addresses..." />
        </div>
      );
    }
  }
})
