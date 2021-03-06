'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

const User = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  homeAirport: {type: String, required: true},
  inspirationId: {type: mongoose.Schema.Types.ObjectId, ref: 'inspiration', default: null},
  compareHash: {type: String, unique: true},
});


User.methods.generatePasswordHash = function(password) {
  if(!password) return Promise.reject(new Error('Authorization failed. Password required.'));
  return bcrypt.hash(password, 10)
    .then(hash => this.password = hash)
    .then(() => this)
    .catch(err => err);
};

User.methods.comparePasswordHash = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if(err) return reject(err);
      if(!valid) return reject(new Error('Authorization failed. Password invalid.'));
      resolve(this);
    });
  });
};

User.methods.generateCompareHash = function() {
  this.compareHash = crypto.randomBytes(32).toString('hex');
  return this.save()
    .then(() => Promise.resolve(this.compareHash))
    .catch(() => this.generateCompareHash());
};

User.methods.generateToken = function() {
  return this.generateCompareHash()
    .then(compareHash => jwt.sign({token: compareHash}, process.env.APP_SECRET))
    .catch(err => err);
};

module.exports = mongoose.model('user', User);
