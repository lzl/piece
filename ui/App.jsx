App = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      pieces: Pieces.find({}, {sort: {createdAt: -1}}).fetch(),
      currentUser: Meteor.user()
    }
  },

  renderCards() {
    return this.data.pieces.map((piece) => {
      return <Card key={piece._id} piece={piece} />;
    });
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
          { this.data.currentUser ?
            <form onSubmit={this.handleSubmit} >
              <fieldset className="form-group">
                <textarea className="form-control" ref="textarea" rows="3"></textarea>
              </fieldset>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form> : ''
          }
        </div>

        <hr />

        <div className="row">
          {this.renderCards()}
        </div>
      </div>
    );
  }
});
