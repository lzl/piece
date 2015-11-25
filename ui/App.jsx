App = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    let handle;
    let handleClones;

    if (Meteor.user()) {
      handle = Meteor.subscribe("pieceCurrentUserPosts");
      handleClones = Meteor.subscribe("pieceCurrentUserClones");
    } else {
      handle = Meteor.subscribe("pieceAllUserPosts");
    }

    return {
      loading: ! handle.ready(),
      pieces: Pieces.find({}, {sort: {createdAt: -1}}).fetch(),
      currentUser: Meteor.user(),
      status: Meteor.status().status
    }
  },

  handleCloneSubmit(event) {
    event.preventDefault();
    var val = this.refs.cloneName.value.trim();
    if (val) {
      Meteor.call('cloneInsert', val);
      this.refs.cloneName.value = "";
    }
  },

  renderNavbar() {
    return (
      <nav className="navbar navbar-light">
        <ul className="nav navbar-nav">
          <li className="nav-item active">
            <div className="nav-link">{this.renderStatus()}</div>
          </li>
        </ul>
        <form className="form-inline navbar-form" onSubmit={this.handleCloneSubmit} >
          <input className="form-control" type="text" placeholder="Clone name" ref="cloneName" required />
          <button className="btn btn-success-outline" type="submit">New Clone</button>
        </form>
      </nav>
    )
  },

  renderStatus() {
    switch (this.data.status) {
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

  renderCards() {
    if (this.data.loading) {
      return "Loading";
    }
    return this.data.pieces.map((piece) => {
      return <Card key={piece._id} piece={piece} />;
    });
  },

  renderForm() {
    if (this.data.currentUser) {
      return (
        <div>
          <form onSubmit={this.handleSubmit} >
            <fieldset className="form-group">
              <textarea className="form-control" ref="textarea" rows="3" required></textarea>
            </fieldset>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>

          <div className="hr"></div>
        </div>
      );
    }
  },

  renderHero() {
    if (! this.data.currentUser) {
      return (
        <div className="jumbotron">
          <h1 className="display-2">Welcome to Piece.</h1>
          <p className="lead">Each piece is a message. You can view recent public pieces at bottom ↓ or you can create an account at top-left corner ↖ to submit your own piece.</p>
        </div>
      );
    }
  },

  handleSubmit(event) {
    event.preventDefault();
    var val = this.refs.textarea.value.trim();
    if (val) {
      Meteor.call('pieceInsert', val);
      this.refs.textarea.value = "";
    }
  },

  render() {
    return (
      <div className="container">
        <div className="row">
          {this.renderNavbar()}
        </div>

        <div className="row">
          {this.renderForm()}
        </div>

        <div className="row">
          {this.renderHero()}
        </div>

        <div className="row">
          {this.renderCards()}
        </div>
      </div>
    );
  }
});
