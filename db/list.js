var mongoose = require('./mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
  url: {
    type: String,
    unique: true,
    required: true
  },
  model: {type: String},
  createdAt: {
  	type: Date,
  	expires: 60*60*24*5,
  	default: Date.now
  }
});

exports.List = mongoose.model('List', schema);