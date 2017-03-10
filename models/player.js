const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  name: {type: String, required: true},

  maxHealth: {type: Number, required: true, default: 0},
  totalDamage: {type: Number, required: true, default: 0},
  totalHealing: {type: Number, required: true, default: 0},

  ac: {type: Number, min: 0, max: 100, default: 10},

  game: {type: String, required: true}
}
, {connect: 'Players'}
, {strict: true});

playerSchema.virtual('currentHealth').get(function() {
  return this.maxHealth - this.totalDamage + this.totalHealing;
});

playerSchema.set('toObject', {virtuals: true});
playerSchema.set('toJSON', {virtuals: true});

const Player	= mongoose.model('Player', playerSchema);

module.exports = Player;
