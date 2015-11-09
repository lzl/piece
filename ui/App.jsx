App = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    let handle;

    if (Meteor.user()) {
      handle = Meteor.subscribe("pieceCurrentUserPosts");
    } else {
      handle = Meteor.subscribe("pieceAllUserPosts");
    }

    return {
      loading: ! handle.ready(),
      pieces: Pieces.find({}, {sort: {createdAt: -1}}).fetch(),
      currentUser: Meteor.user()
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
              <textarea className="form-control" ref="textarea" rows="3"></textarea>
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
    var val = ReactDOM.findDOMNode(this.refs.textarea).value.trim();
    if (val) {
      Meteor.call('pieceInsert', val);
      ReactDOM.findDOMNode(this.refs.textarea).value = "";  
    }
  },

  render() {
    return (
      <div className="container">
        <div className="hr"></div>

        <div className="row">
          <AccountsUIWrapper />
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
