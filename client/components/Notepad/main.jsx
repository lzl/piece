Notepad = React.createClass({
  getInitialState() {
    const formDisabled = '';
    const formText = window.localStorage.getItem('P.formText') || '';
    return {
      formDisabled,
      formText
    };
  },
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset disabled={this.state.formDisabled}>
          <div className="form-group">
            <textarea className="form-control" ref="textarea" rows="3" defaultValue={this.state.formText} onChange={this.handleChange} required></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
          {' '}
          <CloneSelectBox />
        </fieldset>
      </form>
    );
  },
  handleSubmit(event) {
    event.preventDefault();
    const content = this.refs.textarea.value.trim();
    const cloneId = Session.get("currentCloneId");
    if (content && cloneId) {
      this.setState({formDisabled: 'disabled'});
      Meteor.call('insertPieceByClone', content, cloneId, (error, result) => {
        this.setState({
          formDisabled: '',
          formText: ''
        });
        if (error) {
          alert(error.reason);
        } else {
          window.localStorage.removeItem("P.formText");
          this.refs.textarea.value = "";
          this.refs.textarea.focus();
        }
      });
    }
  },

  handleChange(event) {
    const content = this.refs.textarea.value.trim();
    this.setState({formText: content});
    window.localStorage.setItem("P.formText", content);
  }
});
