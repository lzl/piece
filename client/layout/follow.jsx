Follow = React.createClass({
  render() {
    return (
      <ClonesWrapper>
        <SubsWrapper>
          <FollowWithSubs {...this.props} />
        </SubsWrapper>
      </ClonesWrapper>
    );
  }
})

FollowWithSubs = React.createClass({
  componentDidMount() {
    this.view = Blaze.render(Template.previewPieces, this.refs.previewPieces);
  },
  componentWillUnmount() {
    Blaze.remove(this.view);
  },
  render() {
    return (
      <div className="row">
        <FollowBox hostname={this.props.hostname} userId={this.props.userId} />
        <div className="hr" />
        <span ref="previewPieces" />
      </div>
    );
  }
})
