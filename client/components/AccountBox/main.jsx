AccountBox = () =>
  <div id="accounts" className={P.isActiveCard('accounts')}>
    <ChangePassword />
    <div className="hr" />
    <AddEmail />
  </div>
AccountBox.displayName = "AccountBox";

const ChangePassword = React.createClass({
  render() {
    return (
      <form className="form-inline" onSubmit={this.handle}>
        <div className="form-group">
          <label className="sr-only" htmlFor="currentPassword">Current Password</label>
          <input type="password" className="form-control" id="currentPassword" ref="currentPassword" placeholder="Current Password" required />
        </div>
        {' '}
        <div className="form-group">
          <label className="sr-only" htmlFor="newPassword">New Password</label>
          <input type="password" className="form-control" id="newPassword" ref="newPassword" placeholder="New Password" required />
        </div>
        {' '}
        <button type="submit" className="btn btn-primary">Change Password</button>
      </form>
    );
  },
  handle(event) {
    event.preventDefault();
    const currentPassword = this.refs.currentPassword.value;
    const newPassword = this.refs.newPassword.value;
    this.refs.currentPassword.value = '';
    this.refs.newPassword.value = '';
    P.changePassword({currentPassword, newPassword});
  }
});

const AddEmail = React.createClass({
  render() {
    return (
      <form className="form-inline">
        <div className="form-group">
          <label className="sr-only" htmlFor="email">Add Email</label>
          <input type="email" className="form-control" id="email" placeholder="Email Address" />
        </div>
        {' '}
        <button type="submit" className="btn btn-primary">Add Email</button>
        <div>
          <small className="text-muted">You could find your password with this email address.</small>
        </div>
      </form>
    );
  }
});
