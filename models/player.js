// Free DM, a Dungeon Master management Utility
// Copyright (C) 2017  Onyx Zero Software

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  name: {type: String, required: true},

  maxHealth: {type: Number, required: true, default: 10},

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

playerSchema.methods.damage = function(tohit, amount, next) {
  if (tohit < this.ac) {
    next(false);
  } else {
    this.totalDamage += amount;
    this.save(function(err, saved) {
      if (err) {
        console.error(err);
        next(null);
      } else {
        next(saved);
      }
    });
  }
};

playerSchema.methods.heal = function(amount, next) {
  if (this.maxHealth -
    this.totalDamage +
    this.totalHealing +
    amount > this.maxHealth) {
    amount = this.maxHealth - this.currentHealth;
  }
  this.totalHealing += amount;
  this.save(function(err, saved) {
    if (err) {
      console.error(err);
      next(null);
    } else {
      next(saved);
    }
  });
};

playerSchema.set('toObject', {virtuals: true});
playerSchema.set('toJSON', {virtuals: true});

const Player	= mongoose.model('Player', playerSchema);

module.exports = Player;
