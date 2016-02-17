Follow = React.createClass({
  render() {
    return (
      <ClonesWrapper>
        <SubsWrapper>
          <div className="row">
            <FollowBox hostname={this.props.hostname} userId={this.props.userId} />
            <div className="hr" />
            <FollowWithSubs />
          </div>
        </SubsWrapper>
      </ClonesWrapper>
    );
  }
});

FollowWithSubs = React.createClass({
  componentDidMount() {
    this.view = Blaze.render(Template.previewPieces, this.refs.previewPieces);
  },
  componentWillUnmount() {
    Blaze.remove(this.view);
  },
  render() {
    return <span ref="previewPieces" />
  }
});
