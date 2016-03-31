AccountBar = React.createClass({
  getInitialState() {
    return {
      login: this.props.login,
      forgot: false,
      sending: false,
    };
  },
  render() {
    return (
      <div>
        {this.renderLogin()}
        {this.renderSignup()}
        {this.renderForgot()}
      </div>
    );
  },
  renderLogin() {
    const disabled = this.props.loggingIn ? 'disabled' : '';
    const text = this.props.loggingIn ? 'Logging in' : 'Login';
    if (this.state.login && !this.state.forgot) {
      return (
        <form className="form-inline" onSubmit={this.handleLogin}>
          <fieldset disabled={disabled}>
            <div className="form-group">
              <label className="sr-only" htmlFor="username">Username</label>
              <input type="text" className="form-control" id="username" ref="username" placeholder="Username" />
            </div>
            {' '}
            <div className="form-group">
              <label className="sr-only" htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" ref="password" placeholder="Password" />
            </div>
            {' '}
            <button type="submit" className="btn btn-primary">{text}</button>
            {' '}
            <span className="rwd-forgot"><a href="#" onClick={this.handleForgot}>Forgot Password?</a></span>
            {' '}
            <span className="rwd-login">Don't have an account? <a href="#" onClick={this.handleState}>Sign Up</a>.</span>
          </fieldset>
        </form>
      );
    }
  },
  handleLogin(event) {
    event.preventDefault();
    const username = this.refs.username.value;
    const password = this.refs.password.value;
    this.refs.username.value = '';
    this.refs.password.value = '';
    P.loginWithPassword({username, password});
  },

  renderForgot() {
    const disabled = this.state.sending ? 'disabled' : '';
    if (this.state.login && this.state.forgot) {
      return (
        <form className="form-inline" onSubmit={this.handleForgotPassword}>
          <fieldset disabled={disabled}>
            <div className="form-group">
              <label className="sr-only" htmlFor="forgot">Email Address</label>
              <input type="email" className="form-control" id="forgot" ref="email" placeholder="Email Address" size="30" required />
            </div>
            {' '}
            <button type="submit" className="btn btn-primary">Send</button>
            {' '}
            <span><a href="#" onClick={this.handleForgot}>Back to Login</a></span>
            <div>
              <small className="text-muted">We will send an email to help you reset your password.</small>
            </div>
          </fieldset>
        </form>
      );
    }
  },
  handleForgot(event) {
    event.preventDefault();
    this.setState({forgot: !this.state.forgot});
  },
  handleForgotPassword(event) {
    event.preventDefault();
    const email = this.refs.email.value;
    this.setState({sending: true});
    P.forgotPassword(email, this);
  },

  renderSignup() {
    const disabled = this.props.loggingIn ? 'disabled' : '';
    const text = this.props.loggingIn ? 'Waiting' : 'Sign Up';
    if (!this.state.login) {
      return (
        <form className="form-inline" onSubmit={this.handleSignup}>
          <fieldset disabled={disabled}>
            <div className="form-group">
              <label className="sr-only" htmlFor="username">Username</label>
              <input type="text" className="form-control" id="username" ref="username" placeholder="Username" />
            </div>
            {' '}
            <div className="form-group">
              <label className="sr-only" htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" ref="password" placeholder="Password" />
            </div>
            {' '}
            <button type="submit" className="btn btn-primary">{text}</button>
            {' '}
            <span className="rwd-login">Already have an account? <a href="#" onClick={this.handleState}>Log In</a>.</span>
          </fieldset>
        </form>
      );
    }
  },
  handleSignup(event) {
    event.preventDefault();
    const username = this.refs.username.value;
    const password = this.refs.password.value;
    this.refs.username.value = '';
    this.refs.password.value = '';
    P.createUser({username, password});
  },

  handleState(event) {
    event.preventDefault();
    this.setState({login: !this.state.login});
  }
})

const LoginWithPassword = React.createClass({
  render() {
    return (
      <div className="col-xs-12 col-sm-6">
        <h4 className="page-header">Log In</h4>
        <form ref="login" onSubmit={this.handleSubmit}>
          <fieldset className="form-group">
            <label htmlFor="emailAddress">Username</label>
            <input type="text" className="form-control" id="emailAddress" placeholder="Username" />
          </fieldset>
          <fieldset className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Password" />
          </fieldset>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <div className="hr" />
        <p>Don't have an account? <a href="/signup">Sign Up</a>.</p>
      </div>
    );
  },

  handleSubmit(event) {
    event.preventDefault();
  }
})

const SignupWithPassword = React.createClass({
  render() {
    return (
      <div className="col-xs-12 col-sm-6">
        <h4 className="page-header">Sign Up</h4>
        <form ref="login" onSubmit={this.handleSubmit}>
          <fieldset className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" className="form-control" id="username" placeholder="Username" />
          </fieldset>
          <fieldset className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Password" />
          </fieldset>
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
        <div className="hr" />
        <p>Already have an account? <a href="/login">Log In</a>.</p>
      </div>
    );
  },

  handleSubmit(event) {
    event.preventDefault();
  }
})

const LoginWithEmail = React.createClass({
  render() {
    return (
      <div className="col-xs-12 col-sm-6">
        <h4 className="page-header">Log In</h4>
        <form ref="login" onSubmit={this.handleSubmit}>
          <fieldset className="form-group">
            <label htmlFor="username">Email address</label>
            <input type="email" className="form-control" id="username" placeholder="Email address" />
            <small className="text-muted">We'll never share your email with anyone else.</small>
          </fieldset>
          <fieldset className="form-group">
            <label htmlFor="password">Password</label>
            <label className="pull-xs-right" htmlFor="password">
              <a href="/recover-password">Forget Password?</a>
            </label>
            <input type="password" className="form-control" id="password" placeholder="Password" />
          </fieldset>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <div className="hr" />
        <p>Don't have an account? <a href="/signup">Sign Up</a>.</p>
      </div>
    );
  },

  handleSubmit(event) {
    event.preventDefault();
  }
})

const SignupWithEmail = React.createClass({
  render() {
    return (
      <div className="col-xs-12 col-sm-6">
        <h4 className="page-header">Sign Up</h4>
        <form ref="login" onSubmit={this.handleSubmit}>
          <fieldset className="form-group">
            <label htmlFor="emailAddress">Email address</label>
            <input type="email" className="form-control" id="emailAddress" placeholder="Email address" />
          </fieldset>
          <fieldset className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Password" />
          </fieldset>
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
        <div className="hr" />
        <p>Already have an account? <a href="/login">Log In</a>.</p>
      </div>
    );
  },

  handleSubmit(event) {
    event.preventDefault();
  }
})
