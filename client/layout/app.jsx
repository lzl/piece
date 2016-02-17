App = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      status: Meteor.status().status,
      loggingIn: Meteor.loggingIn(),
      isUser: !!Meteor.user(),
    };
  },
  render () {
    return (
      <div className="container">
        <Navigation status={this.data.status} isUser={this.data.isUser} />
        {this.data.isUser ? this.props.yield : <Demo loggingIn={this.data.loggingIn} />}
      </div>
    );
  }
});
