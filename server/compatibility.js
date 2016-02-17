// change database schema for backwards compatibility
const hasOldSchema = Pieces.findOne({owner: {$exists: true}});
if (hasOldSchema) {
  { const selector = {owner: {$exists: true}};
    const modifier = {$rename: {'owner': 'username', 'ownerId': 'userId'}};
    const options = {multi: true};
    Pieces.update(selector, modifier, options); }
  { const selector = {origin: {$exists: true}};
    const modifier = {$rename: {'origin.owner': 'origin.username', 'origin.ownerId': 'origin.userId'}};
    const options = {multi: true};
    Pieces.update(selector, modifier, options); }
}
