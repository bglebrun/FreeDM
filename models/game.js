var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const gameSchema = new Schema({
  // game name can be whatever it wants
  name: {type: String, required: true, unique: true},
  // code is for simplicity, type it in to reload the game
  code: {type: String, minlength: 4, maxlength: 4, unique: true}
}
, {connect: 'Players'}
, {strict: true});

gameSchema.set('toObject', {virtuals: true});
gameSchema.set('toJSON', {virtuals: true});

const Game	= mongoose.model('Game', gameSchema);

module.exports = Game;
