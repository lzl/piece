// set hostname to the pieces has not
const url = Npm.require("url");
const hostname = url.parse(Meteor.absoluteUrl()).host;
const hasNotHostname = Pieces.find({hostname: {$exists: false}}).count() !== 0;
if (hasNotHostname) {
  console.log("set hostname to the pieces has not");
  Pieces.update({hostname: {$exists: false}}, {$set: {hostname: hostname}}, {multi: true});
}
// take risk for this one, not all of shared pieces are from our host
// const hasOriginButHasNotHostName = Pieces.find({origin: {$exists: true}, 'origin.hostname': {$exists: false}}).count() !== 0;
// if (hasOriginButHasNotHostName) {
//   console.log("set hostname to the pieces' origin has not");
//   Pieces.update({origin: {$exists: true}, 'origin.hostname': {$exists: false}}, {$set: {'origin.hostname': hostname}}, {multi: true});
// }
