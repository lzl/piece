Card = React.createClass({
  // propTypes: {
  //   piece: React.propTypes.object.isRequired
  // },
  render() {
    return (
      <div className="card card-block">
        <h4 className="card-title">{this.props.piece._id}</h4>
        <p className="card-text">{this.props.piece.content}</p>
        <a href="#" className="card-link">Card link</a>
        <a href="#" className="card-link">Another link</a>
      </div>
    );
  }
})
