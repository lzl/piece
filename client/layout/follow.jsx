Follow = React.createClass({
  render() {
    return (
      <ClonesWrapper>
        <SubsWrapper>
          <div className="row">
            {this.props.hostname && this.props.userId ? <FollowBox hostname={this.props.hostname} userId={this.props.userId} /> : <PreviewBox />}
            <div className="hr" />
            {this.props.hostname && this.props.userId ? <FollowWithSubs /> : ''}
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
