CloneBox = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    Session.setDefault('enableCloneFeature', false);
    P.setCurrentCloneId();
    const currentCloneId = Session.get("currentCloneId");
    return {
      cloneNum: Clones.find({ownerId: currentCloneId}).count(),
      enableCloneFeature: Session.get('enableCloneFeature'),
    };
  },

  render() {
    if (this.data.cloneNum > 1 || this.data.enableCloneFeature) {
      return (
        <div>
          <CloneNewBox />
          <div className="hr" />
        </div>
      );
    } else {
      return <span />;
    }
  }
});

CloneNewBox = React.createClass({
  render() {
    return (
      <form className="form-inline" onSubmit={this.handleSubmit}>
        <CloneSelectBox />
        {' '}
        <div className="br hidden-sm-up" />
        <div className="form-group">
          <label className="sr-only" htmlFor="new-clone">Make a clone</label>
          <input type="text" className="form-control" id="new-clone" ref="cloneName" placeholder="New name" required />
        </div>
        {' '}
        <button type="submit" className="btn btn-primary-outline">Clone</button>
        <button type="button" className="btn btn-link hidden-sm" onClick={this.handleHelp}>What is clone?</button>
        {this.renderHelp()}
      </form>
    );
  },

  renderHelp() {
    return (
      <div className="modal fade" id="what-is-clone" tabIndex="-1" role="dialog" aria-labelledby="whatIsClone" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title" id="myModalLabel">Clone means reborn.</h4>
            </div>
            <div className="modal-body">
              <p className="card-text">
                Clone is ...
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  },

  handleSubmit(event) {
    event.preventDefault()
    const name = this.refs.cloneName.value.trim();
    if (name) {
      Meteor.call('insertClone', name, (error, result) => {
        if (error) {
          alert(error.reason);
        } else {
          alert(`Your new clone ${name} is created.`);
          this.refs.cloneName.value = "";
          Session.set("currentCloneId", result);
        }
      });
    } else {
      this.refs.cloneName.value = "";
    }
  },

  handleHelp(event) {
    event.preventDefault();
    $('#what-is-clone').modal('show');
    $('#what-is-clone').on('hidden.bs.modal', () => {
      $('#new-clone').focus();
    });
  },
});

CloneSelectBox = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    P.setCurrentCloneId();
    const currentCloneId = Session.get("currentCloneId");
    return {
      clones: Clones.find({ownerId: currentCloneId}, {sort: {createdAt: 1}}).fetch(),
      currentClone: Clones.findOne({_id: currentCloneId}),
      otherClones: Clones.find({_id: {$ne: currentCloneId}, ownerId: currentCloneId}).fetch(),
    };
  },
  render () {
    if (this.data.clones.length > 1) {
      return (
        <select className="c-select" ref="select" defaultValue={this.data.currentClone._id} onChange={this.handleSelect}>
          <option value={this.data.currentClone._id}>{this.data.currentClone.name}</option>
          {this.data.otherClones.map((clone) => {
            return <option key={clone._id} value={clone._id}>{clone.name}</option>
          })}
        </select>
      );
    } else {
      return <span />;
    }
  },
  handleSelect(event) {
    event.preventDefault();
    const node = this.refs.select;
    const currentCloneId = node.value;
    Session.set("currentCloneId", currentCloneId);
  }
});
