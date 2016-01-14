// import security check
// isId
const isId = Match.Where((id) => {
  const isString = typeof id === 'string';
  const isSeventeen = id.length === 17;
  return isString && isSeventeen;
});
// isOfficialType
const types = ['plaintext', 'hyperlink', 'sharism-piece'];
const isOfficialType = Match.Where((type) => {
  return types.indexOf(type) > -1;
});
const pieceSchema = {
  _id: Match.Optional(isId),
  type: isOfficialType,
  content: Match.OneOf(String, null),
  owner: String,
  ownerId: isId,
  published: Boolean,
  createdAt: String,
  hostname: String,
  imported: Match.Optional(Boolean),
  importedAt: Match.Optional(String)
}
const sharismPieceSchema = {
  _id: Match.Optional(isId),
  type: isOfficialType,
  content: Match.OneOf(String, null),
  owner: String,
  ownerId: isId,
  published: Boolean,
  createdAt: String,
  hostname: String,
  imported: Match.Optional(Boolean),
  importedAt: Match.Optional(String),
  origin: pieceSchema
}

Dashboard = React.createClass({
  propTypes: {
    currentUser: React.PropTypes.object,
    clones: React.PropTypes.array,
    clonesIsReady: React.PropTypes.bool,
    currentClone: React.PropTypes.object,
    otherClones: React.PropTypes.array
  },

  mixins: [ReactMeteorData],

  getMeteorData() {
    if (this.props.currentUser && this.props.clonesIsReady) {
      // set currentCloneId with first clone's id if it wasn't set before
      Session.setDefault("currentCloneId", Clones.findOne()._id);
      // if currentCloneId was set, then check if it belongs to current user
      if (! Clones.findOne(Session.get("currentCloneId"))) {
        // if not, then set again
        Session.set("currentCloneId", Clones.findOne()._id);
      }
    }
    Session.setDefault('enableCloneFeature', false);
    return {
      currentUser: Meteor.user(),
      enableCloneFeature: Session.get('enableCloneFeature')
    }
  },

  selectClone(event) {
    event.preventDefault();
    const currentCloneId = ReactDOM.findDOMNode(this.refs.selectClone).value;
    Session.set("currentCloneId", currentCloneId);
  },

  renderOtherClones() {
    return this.props.otherClones.map((clone) => {
      return <option key={clone._id} value={clone._id}>{clone.name}</option>
    });
  },

  renderSelectClone() {
    if (this.props.currentClone && this.props.clones.length > 1) {
      return (
        <div>
          <select className="c-select" ref="selectClone" defaultValue={this.props.currentClone._id} onChange={this.selectClone}>
            <option value={this.props.currentClone._id}>{this.props.currentClone.name}</option>
            {this.renderOtherClones()}
          </select>
          <p><small className="text-muted">Select clone as your target to export or import.</small></p>
        </div>
      );
    }
  },

  renderNewCloneFormOrNot() {
    const hasMoreThanOneClone = this.props.clones.length > 1;
    if (this.data.enableCloneFeature || hasMoreThanOneClone) {
      return this.renderNewCloneForm();
    }
  },

  renderNewCloneForm() {
    return (
      <div>
        <form className="form-inline navbar-form" onSubmit={this.handleNewCloneSubmit} >
          <input className="form-control" type="text" placeholder="Make a new name" ref="cloneName" required />
          <button className="btn btn-success-outline" type="submit">Clone</button>
        </form>
        <p><small className="text-muted">Or you can make a new clone.</small></p>
      </div>
    );
  },

  handleNewCloneSubmit(event) {
    event.preventDefault();
    var val = this.refs.cloneName.value.trim();
    if (val) {
      Meteor.call('cloneInsert', val, (error, result) => {
        if (!error) {
          this.refs.cloneName.value = "";
          Session.set("currentCloneId", result);
        }
      });
    }
  },

  renderExportButton() {
    return (
      <div>
        <button type="submit" className="btn btn-secondary" onClick={this.handleExport}>Export</button>
        <p><small className="text-muted">Backup all your own pieces as a JSON file.</small></p>
      </div>
    );
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
    if (Meteor.settings.public.feature.import) {
      return (
        <div>
          <label className="file">
            <input type="file" ref="import" onChange={this.handleImport} />
            <span className="file-custom"></span>
          </label>
          <p><small className="text-muted">Restore pieces from your JSON file.</small></p>
        </div>
      );
    }
  },

  handleImport(event) {
    event.preventDefault();
    const file = event.target.files[0];

    // if select no file, then cancel it
    if (file === undefined) return;
    // if select non-json file, then cancel it
    const extension = file.name.split('.').pop().toLowerCase();
    const isJSON = extension === 'json';
    if (! isJSON) return;

    const reader = new FileReader();
    reader.onload = function(upload) {
      const json = upload.target.result;
      const pieces = JSON.parse(json);

      // check if pieces is an Array
      check(pieces, Array);
      _.each(pieces, (piece) => {
        if (piece.origin) {
          check(piece, sharismPieceSchema)
        } else {
          check(piece, pieceSchema)
        }
      })

      const cloneId = Session.get('currentCloneId');
      Meteor.call('pieceImportByClone', cloneId, pieces, (error, result) => {
        if (error) {
          console.log("import failed:", error);
        } else {
          if (result) {
            alert(`Success. All of ${result} pieces are imported.`)
            FlowRouter.go('/');
          }
        }
      })
    }
    reader.readAsText(file);
  },

  renderDashboard() {
    return (
      <div className="row">
        {this.renderSelectClone()}
        {this.renderNewCloneFormOrNot()}
        {this.renderExportButton()}
        {this.renderImportInput()}
      </div>
    );
  },

  renderSignIn() {
    return (
      <div className="row">
        <ul className="list-group">
          <li className="list-group-item">Please sign in ↖</li>
        </ul>
      </div>
    );
  },

  render() {
    if (this.props.currentUser) {
      return this.renderDashboard();
    } else {
      return this.renderSignIn();
    }
  }
});
