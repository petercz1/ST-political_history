var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27500/politics', {useMongoClient: true});

var president_structure = {
  number: Number,
  president: String,
  birth_year: Number,
  death_year: Number,
  took_office: String,
  left_office: String,
  party: String
}

var schema = new mongoose.Schema(president_structure);

var PRESIDENTSCLASS = mongoose.model('presidents', schema);

module.exports = PRESIDENTSCLASS;