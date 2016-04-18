import React from 'react';
import Clipboard from 'clipboard';

AddressBox = React.createClass({
  getInitialState() {
    return {
      copyText: 'Copy your address',
    };
  },
  componentDidMount() {
    const clipboard = new Clipboard('.js-copy');
    clipboard.on('success', (e) => {
      e.clearSelection();
      this.setState({copyText: 'Copied!'});
    });
    clipboard.on('error', (e) => {
      let copyText = undefined;
      if (Meteor.isCordova) {
        e.clearSelection();
        cordova.plugins.clipboard.copy(this.props.address);
        copyText = 'Copied!';
      } else if (/iPhone|iPad/i.test(navigator.userAgent)) {
        copyText = 'Hold hightlight to copy';
      } else if (/Mac/i.test(navigator.userAgent)) {
        copyText = 'Press ⌘-C to copy';
      } else {
        copyText = 'Press Ctrl-C to copy';
      }
      this.setState({copyText});
    });
  },
  render() {
    return (
      <div className="input-group input-group-sm">
        <input type="text" id="address" className="form-control" value={this.props.address} aria-label="Address" readOnly />
        <span className="input-group-btn">
          <button className="btn btn-secondary js-copy" type="button" data-clipboard-target="#address" onClick={this.handleCopy}>{this.state.copyText}</button>
        </span>
      </div>
    );
  },
  handleCopy(event) {
    event.preventDefault();
  }
});
