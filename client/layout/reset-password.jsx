ResetPasswordBox = React.createClass({
  getInitialState() {
    return {
      waiting: false,
    };
  },
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      status: Meteor.status().status,
      loggingIn: Meteor.loggingIn(),
      isUser: !!Meteor.user(),
    };
  },
  render () {
    const disabled = this.state.waiting ? 'disabled' : '';
    return (
      <div className="container">
        <Navigation status={this.data.status} isUser={this.data.isUser} />
        <div className="row">
          <form className="form-inline" onSubmit={this.handle}>
            <fieldset disabled={disabled}>
              <div className="form-group">
                <label className="sr-only" htmlFor="newPassword">New Password</label>
                <input type="password" className="form-control" id="newPassword" ref="newPassword" placeholder="New Password" />
              </div>
              {' '}
              <button type="submit" className="btn btn-primary">Submit</button>
            </fieldset>
          </form>
        </div>
      </div>
    );
  },
  handle(event) {
    event.preventDefault();
    this.setState({waiting: true});
    const password = this.refs.newPassword.value;
    P.resetPassword(password);
  }
});
