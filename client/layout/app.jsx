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
        <div className="row">
          <div className="col-xs-12">
            <Navigation status={this.data.status} isUser={this.data.isUser} />
          </div>
        </div>
        {this.data.isUser ? this.props.yield : <Demo loggingIn={this.data.loggingIn} />}
      </div>
    );
  }
});
