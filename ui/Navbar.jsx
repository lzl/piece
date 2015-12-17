Navbar = React.createClass({
  propTypes: {
    status: React.PropTypes.string.isRequired,
    currentUser: React.PropTypes.object,
    // clones: React.PropTypes.array
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

  // renderCloneNames() {
  //   if (this.props.currentUser && this.props.clones.length > 1) {
  //     const id = this.data.currentCloneId;
  //     return this.props.clones.map((clone) => {
  //       const style = clone._id === id ? "nav-item active" : "nav-item";
  //       return (
  //         <li key={clone._id} className={style}>
  //           <a className="nav-link" onClick={() => Session.set("currentCloneId", clone._id)}>{clone.name}</a>
  //         </li>
  //       );
  //     });
  //   }
  // },

  renderNewCloneForm() {
    if (this.props.currentUser) {
      return (
        <form className="form-inline navbar-form pull-right" onSubmit={this.handleNewCloneSubmit} >
          <input className="form-control" type="text" placeholder="Make a new name" ref="cloneName" required />
          <button className="btn btn-success-outline" type="submit">Clone</button>
        </form>
      );
    }
  },

  handleNewCloneSubmit(event) {
    event.preventDefault();
    var val = this.refs.cloneName.value.trim();
    if (val) {
      Meteor.call('cloneInsert', val);
      this.refs.cloneName.value = "";
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
          </ul>

          {this.renderNewCloneForm()}
        </nav>
      </div>
    )
  }
});
