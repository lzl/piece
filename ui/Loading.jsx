Loading = React.createClass({
  propTypes: {
    text: React.PropTypes.string.isRequired
  },

  render() {
    return (
      <div className="card card-block">
        <p className="card-text">{this.props.text}...</p>
      </div>
    )
  }
});
