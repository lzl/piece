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

  renderExportButton() {
    return <button type="submit" className="btn btn-secondary" onClick={this.handleExport}>Export</button>
  },

  handleExport(event) {
    event.preventDefault();
    const cloneId = Session.get('currentCloneId');
    Meteor.call("pieceExportByClone", cloneId, (error, result) => {
      if (error) {
        console.log("export failed:", error);
      } else {
        if (result) {
          const blob = new Blob([result], {type: "application/json;charset=utf-8"});
          const username = Clones.findOne({_id: cloneId}).name;
          saveAs(blob, `${username}.json`); // use FileSaver.js
        }
      }
    });
  },

  renderImportInput() {
    return <input type="file" className="form-control-file" ref="import" onChange={this.handleImport}/>
  },

  handleImport(event) {
    event.preventDefault();
    const file = event.target.files[0];
    if (file === undefined) return;
    const reader = new FileReader();
    reader.onload = function(upload) {
      const json = upload.target.result;
      const pieces = JSON.parse(json);
      const cloneId = Session.get('currentCloneId');
      Meteor.call('pieceImportByClone', cloneId, pieces, (error, result) => {
        if (error) {
          console.log("import failed:", error);
        } else {
          if (result) {
            console.log("import success:", result);
          }
        }
      })
    }
    reader.readAsText(file);
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
            {' '}
            {this.renderExportButton()}
            {' '}
            {this.renderImportInput()}
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
      Meteor.call('pieceInsertByClone', val, cloneId, (error, result) => {
        if (! error) {
          this.refs.textarea.value = "";
          this.refs.textarea.focus();
        }
      });
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
