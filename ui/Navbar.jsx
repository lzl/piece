Navbar = React.createClass({
  propTypes: {
    status: React.PropTypes.string.isRequired,
    currentUser: React.PropTypes.object,
    clones: React.PropTypes.array,
    routeName: React.PropTypes.string.isRequired
  },

  renderStatus() {
    switch (this.props.status) {
      case 'connecting':
        return <span className="text-primary">Connecting</span>;
        break;
      case 'connected':
        return <AccountsUIWrapper />;
        break;
      case 'failed':
        return <span className="text-danger">Failed</span>
        break;
      case 'waiting':
        return <span className="text-primary">Waiting</span>;
        break;
      case 'offline':
        return <span className="text-danger">Offline</span>;
        break;
      default:
        return <AccountsUIWrapper />;
    }
  },

  activeRoute(routeName) {
    if (this.props.routeName === routeName) {
      return 'nav-item active';
    } else {
      return 'nav-item';
    }
  },

  renderDashboard() {
    if (this.props.currentUser) {
      return (
        <li className={this.activeRoute('dashboard')}>
          <a className="nav-link" href="/dashboard">Dashboard</a>
        </li>
      );
    }
  },

  render() {
    return (
      <div className="row">
        <nav className="navbar navbar-light">
          <ul className="nav navbar-nav">
            <li className="nav-item active">
              <div className="nav-link">{this.renderStatus()}</div>
            </li>
            <li className={this.activeRoute('piece')}>
              <a className="nav-link" href="/">Piece</a>
            </li>
            {this.renderDashboard()}
          </ul>
        </nav>
      </div>
    )
  }
});
