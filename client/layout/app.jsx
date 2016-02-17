App = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      status: Meteor.status().status,
      loggingIn: Meteor.loggingIn(),
      isUser: !!Meteor.user(),
      isPublic(route) {
        return [
          'cloneProfile',
          'notFound'
        ].indexOf(route) > -1;
      },
      canView() {
        // return this.isPublic(FlowRouter.getRouteName()) || !!Meteor.user();
        return !!Meteor.user();
      }
    };
  },
  render () {
    return (
      <div className="container">
        <Navigation status={this.data.status} isUser={this.data.isUser}/>
        {this.data.canView() ? this.props.yield : <Demo loggingIn={this.data.loggingIn} />}
      </div>
    );
  }
})
