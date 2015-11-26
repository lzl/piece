App = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    if (Meteor.user()) {
      const handleClones = Meteor.subscribe("pieceCurrentUserClones");
    }

    return {
      clones: Clones.find({}, {sort: {createdAt: 1}}).fetch(),
      currentUser: Meteor.user(),
      status: Meteor.status().status
    }
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
    const val = this.refs.textarea.value.trim();
    const cloneId = Session.get("currentCloneId");
    if (val && cloneId) {
      Meteor.call('pieceInsertByClone', val, cloneId);
      this.refs.textarea.value = "";
    }
  },

  renderCards() {
    if (this.data.currentUser) {
      return <CurrenUserCards clones={this.data.clones}/>;
    } else {
      return <AllUserCards />;
    }
  },

  render() {
    return (
      <div className="container">
        <div className="row">
          <Navbar
            currentUser={this.data.currentUser}
            status={this.data.status}
            clones={this.data.clones}
          />
        </div>

        <div className="row">
          {this.renderForm()}
        </div>

        <div className="row">
          {this.renderHero()}
        </div>

        {this.renderCards()}
      </div>
    );
  }
});
