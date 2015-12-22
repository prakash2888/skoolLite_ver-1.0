var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://127.0.0.1:27017/saima', {safe:true});
var helper=mongoskin.helper;

var dbOparations={db:db,helper:helper};


module.exports.dbOparations=dbOparations;