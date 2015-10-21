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

  handleSubmit(event) {
    event.preventDefault();
    var val = React.findDOMNode(this.refs.textarea).value.trim();
    Meteor.call('pieceInsert', val);
    React.findDOMNode(this.refs.textarea).value = "";
  },

  render() {
    return (
      <div className="container">
        <div className="row">
          <AccountsUIWrapper />
          {this.renderForm()}
        </div>

        <div className="row">
          {this.renderCards()}
        </div>
      </div>
    );
  }
});
