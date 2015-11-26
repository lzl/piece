Navbar = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      currentCloneId: Session.get("currentCloneId")
    }
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

  renderCloneNames() {
    if (this.props.currentUser) {
      const id = this.data.currentCloneId;
      return this.props.clones.map((clone) => {
        const style = clone._id === id ? "nav-item active" : "nav-item";
        return (
          <li key={clone._id} className={style}>
            <a className="nav-link" onClick={() => Session.set("currentCloneId", clone._id)}>{clone.name}</a>
          </li>
        );
      });
    } else {
      return '';
    }
  },

  renderNewCloneForm() {
    return (
      <form className="form-inline navbar-form pull-right" onSubmit={this.handleNewCloneSubmit} >
        <input className="form-control" type="text" placeholder="Clone name" ref="cloneName" required />
        <button className="btn btn-success-outline" type="submit">New Clone</button>
      </form>
    );
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
      <nav className="navbar navbar-light">
        <ul className="nav navbar-nav">
          <li className="nav-item active">
            <div className="nav-link">{this.renderStatus()}</div>
          </li>
          {this.renderCloneNames()}
        </ul>

        {this.props.currentUser ? this.renderNewCloneForm() : ''}
      </nav>
    )
  }
});
