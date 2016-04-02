import React from 'react';

PreviewBox = React.createClass({
  getInitialState() {
    return {
      length: 30
    };
  },
  render() {
    return (
      <form className="form-inline" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label className="sr-only" htmlFor="address">Address</label>
          <input type="text" className="form-control" id="address" ref="address" placeholder="Address" size={this.state.length} onChange={this.handleChange} required />
        </div>
        {' '}
        <button type="submit" className="btn btn-primary">Preview</button>
        {' '}
        <CloneSelectBox />
        <button type="button" className="btn btn-link hidden-sm" onClick={this.handleHelp}>How to follow?</button>
        {this.renderHelp()}
      </form>
    );
  },
  renderHelp() {
    P.setCurrentCloneId();
    const address = P.makeAddress({hostname: P.getHostname(), userId: Session.get("currentCloneId")});
    return (
      <div className="modal fade" id="how-to-follow" tabIndex="-1" role="dialog" aria-labelledby="howToFollow" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title" id="myModalLabel">Address is the key.</h4>
            </div>
            <div className="modal-body">
              <p className="card-text">
                First of all, it's totally optional to follow others. You can use Piece alone if you want.
              </p>
              <p className="card-text">
                The key of connecting you with others is named <mark>Address</mark>. It's just a hyperlink. For example, this is your address:
              </p>
              <p className="card-text word-wrap">
                <a href={address} target="_blank">{address}</a>
              </p>
              <p className="card-text">
                Tell friends to paste it into the Address form and click the Preview button. Then the rest is obvious. You can do that too.
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
    const address = this.refs.address.value;
    const {hostname, userId, isValid} = P.resolveAddress(address);
    if (isValid) {
      FlowRouter.go(`/follow?hostname=${hostname}&userId=${userId}`);
    } else {
      alert("Please enter a valid address.");
    }
  },
  handleChange(event) {
    event.preventDefault();
    const length = this.refs.address.value.length;
    if (length > 30) {
      this.setState({length: length});
    } else {
      this.setState({length: 30});
    }
  },
  handleHelp(event) {
    event.preventDefault();
    $('#how-to-follow').modal('show');
    $('#how-to-follow').on('hidden.bs.modal', () => {
      const address = P.makeAddress({hostname: P.getHostname(), userId: Session.get("currentCloneId")});
      this.refs.address.value = address;
      this.setState({length: address.length});
    });
  },
});

PreviewButton = React.createClass({
  render() {
    return <button type="button" className="btn btn-secondary" onClick={this.handlePreview}>Preview</button>
  },
  handlePreview(event) {
    event.preventDefault();
    const hostname = this.props.hostname;
    const userId = this.props.userId;
    FlowRouter.go(`/follow?hostname=${hostname}&userId=${userId}`);
  }
});
