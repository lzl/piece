AccountBox = () =>
  <div id="accounts" className={P.isActiveCard('accounts')}>
    <ManageEmail />
    <ChangePassword />
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
      <form className="form-inline" onSubmit={this.handle}>
        <div className="form-group">
          <label className="sr-only" htmlFor="newEmail">Add Email</label>
          <input type="email" className="form-control" id="newEmail" ref="newEmail" placeholder="Email Address" />
        </div>
        {' '}
        <button type="submit" className="btn btn-primary">Add Email</button>
        <div>
          <small className="text-muted">You could find your password with this email address.</small>
        </div>
      </form>
    );
  },
  handle(event) {
    event.preventDefault();
    const newEmail = this.refs.newEmail.value;
    this.refs.newEmail.value = '';
    Meteor.call('addEmail', newEmail, (error, result) => {
      if (error) {
        alert(error.reason);
      }
    });
  }
});

const ManageEmail = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      email: Meteor.user().emails[0],
    }
  },
  render() {
    const email = this.data.email;
    if (email) {
      return (
        <p className="card-text">
          <EmailText address={email.address} />
          {' '}
          {email.verified ? <EmailVerifiedText /> : <SendVerificationEmailText handle={this.handleSendVerificationEmail} />}
          {' '}
          <DeleteEmailText handle={this.handleDeleteEmail} />
        </p>
      );
    } else {
      return (
        <div>
          <AddEmail />
          <div className="hr" />
        </div>
      );
    }
  },
  handleSendVerificationEmail(event) {
    event.preventDefault();
    alert("SendVerificationEmail");
  },
  handleDeleteEmail(event) {
    event.preventDefault();
    const email = this.data.email.address;
    if (confirm(`Do you realy want to remove this email address: ${email} ?`)) {
      Meteor.call('removeEmail', email, (error, result) => {
        if (error) {
          alert(error.reason);
        } else {
          alert(`Success! ${email} is just removed.`);
        }
      });
    }
  }
});

const EmailText = ({address}) =>
  <span>Your email address is <mark>{address}</mark>.</span>
EmailText.displayName = "EmailText";

const EmailVerifiedText = () =>
  <span>It has been verified.</span>
EmailText.displayName = "EmailText";

const SendVerificationEmailText = ({handle}) =>
  <span>It's not verified, how about <a href="#" onClick={handle}>send a verification email</a>.</span>
SendVerificationEmailText.displayName = "SendVerificationEmailText";

const DeleteEmailText = ({handle}) =>
  <span>You can change your email address after <a href="#" onClick={handle}>delete this one</a>.</span>
EmailText.displayName = "EmailText";
