App = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    const handleClones = Meteor.subscribe("pieceCurrentUserClones");
    return {
      status: Meteor.status().status,
      currentUser: Meteor.user(),
      clones: Clones.find({}, {sort: {createdAt: 1}}).fetch(),
      clonesIsReady: handleClones.ready(),
      currentClone: Clones.findOne({_id: Session.get("currentCloneId")}),
      otherClones: Clones.find({_id: {$ne: Session.get("currentCloneId")}}).fetch()
    }
  },

  selectClone(event) {
    event.preventDefault();
    const currentCloneId = ReactDOM.findDOMNode(this.refs.selectClone).value;
    Session.set("currentCloneId", currentCloneId);
  },

  renderOtherClones() {
    return this.data.otherClones.map((clone) => {
      return <option key={clone._id} value={clone._id}>{clone.name}</option>
    });
  },

  renderSelectClone() {
    if (this.data.currentClone && this.data.clones.length > 1) {
      return (
        <select className="c-select" ref="selectClone" defaultValue={this.data.currentClone._id} onChange={this.selectClone}>
          <option value={this.data.currentClone._id}>{this.data.currentClone.name}</option>
          {this.renderOtherClones()}
        </select>
      );
    }
  },

  renderForm() {
    if (this.data.currentUser) {
      return (
        <div className="row">
          <form onSubmit={this.handleSubmit} >
            <fieldset className="form-group">
              <textarea className="form-control" ref="textarea" rows="3" required></textarea>
            </fieldset>
            <button type="submit" className="btn btn-primary">Submit</button>
            {' '}
            {this.renderSelectClone()}
          </form>

          <div className="hr"></div>
        </div>
      );
    }
  },

  renderHero() {
    if (! this.data.currentUser) {
      return (
        <div className="row">
          <div className="jumbotron">
            <h1 className="display-2">Welcome to Piece.</h1>
            <p className="lead">Each piece is a message. You can view recent public pieces at bottom ↓ or you can create an account at top-left corner ↖ to submit your own piece.</p>
          </div>
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
      if (this.data.clonesIsReady) {
        return <CurrenUserCards />;
      } else {
        return (
          <div className="row">
            <Loading text={"Loading your clones"} />
          </div>
        )
      }
    } else {
      return <AllUserCards />;
    }
  },

  render() {
    return (
      <div className="container">
        <Navbar
          currentUser={this.data.currentUser}
          status={this.data.status}
          clones={this.data.clones}
        />

        {this.renderForm()}
        {this.renderHero()}
        {this.renderCards()}
      </div>
    );
  }
});
