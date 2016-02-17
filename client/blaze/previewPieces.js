Template.registerHelper('fromNow', (timestamp) => {
  return P.fromNow(timestamp);
});

Template.registerHelper('updateRate', (timestamp) => {
  return P.updateRate(timestamp);
});

Template.previewPieces.onCreated(function () {
  const instance = this;
  instance.state = new ReactiveDict();
  instance.state.setDefault({
    wantPiecesCount: 20
  });

  const hostname = FlowRouter.getQueryParam("hostname");
  const userId = FlowRouter.getQueryParam("userId");
  // previewViaForm(instance, hostname, userId, instance.state.get('wantPiecesCount'));
  // const protocol = Meteor.settings.public.protocol;
  // TODO
  instance.connection = DDP.connect(`${P.protocol}${hostname}`);
  instance['collection.pieces'] = new Mongo.Collection('pieces', {connection: instance.connection});
  instance.autorun(() => {
    const limit = instance.state.get('wantPiecesCount');
    instance['subscription.posts'] = instance.connection.subscribe("singleClonePieces", userId, limit);
  });
  instance['collection.clones'] = new Mongo.Collection('clones', {connection: instance.connection});
  instance.autorun(() => {
    instance['subscription.profile'] = instance.connection.subscribe("singleCloneProfile", userId);
  });
})
Template.previewPieces.helpers({
  hasPiece() {
    const instance = Template.instance();
    return instance['collection.pieces'].findOne();
  },
  pieces() {
    const instance = Template.instance();
    const userId = FlowRouter.getQueryParam("userId");
    return instance['collection.pieces'].find({userId: userId}, {sort: {createdAt: -1}});
  },
  showButton() {
    const instance = Template.instance();
    const userId = FlowRouter.getQueryParam("userId");
    const hasPiecesCount = instance['collection.pieces'].find({userId: userId}).count();
    return hasPiecesCount >= 20;
  },
  disabled() {
    const instance = Template.instance();
    const userId = FlowRouter.getQueryParam("userId");
    const hasPiecesCount = instance['collection.pieces'].find({userId: userId}).count();
    const wantPiecesCount = instance.state.get('wantPiecesCount');
    if (hasPiecesCount < wantPiecesCount) {
      return 'disabled';
    } else {
      return '';
    }
  },
  profile() {
    const instance = Template.instance();
    return instance['collection.clones'].findOne();
  }
})
Template.previewPieces.events({
  'click [data-action=more]': (event, instance) => {
    event.preventDefault();
    instance.state.set('wantPiecesCount', instance.state.get('wantPiecesCount') + 20);
  }
})

Template.previewPieceContent.helpers({
  typeIsPlaintext() {
    const piece = Template.instance().data.piece;
    return piece.type === 'plaintext';
  },
  typeIsHyperlink() {
    const piece = Template.instance().data.piece;
    return piece.type === 'hyperlink';
  },
  typeIsSharismPiece() {
    const piece = Template.instance().data.piece;
    return piece.type === 'sharism-piece';
  }
})

Template.previewPieceTypeIsPlaintext.onRendered(function () {
  const instance = this;
  instance.$('span.js-content').linkify(P.linkifyOptions);
})
Template.previewPieceTypeIsSharismPiece.onRendered(function () {
  const instance = this;
  instance.$('span.js-content').linkify(P.linkifyOptions);
})
